import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Input } from "reactstrap";
import { putImageToEmployee } from "../../api";
import { v4 } from "uuid";
import "./Register.css";
import { toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";

function Upload() {
  const webcamRef = useRef(null);
  const [employeeId, setEmployeeId] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [spinner, setSpinner] = useState(false);

  const capture = useCallback(() => {
    setImageSrc(webcamRef?.current?.getScreenshot());
  }, [webcamRef]);

  const upload = async (e) => {
    e.preventDefault();
    if (!imageSrc) {
      toast.warn("You need an image to upload!");
      return;
    }
    if (!employeeId) {
      toast.warn("Employee ID is required!");
      return;
    }
    setSpinner(true);
    try {
      const imageName = `${employeeId}_${v4()}.jpeg`;
      const base64Response = await fetch(imageSrc);
      const imageBlob = await base64Response.blob();
      const imageFile = new File([imageBlob], imageName, {
        type: "image/jpeg",
      });
      const res = await putImageToEmployee(imageFile, imageName);
      if (res.status === 200) {
        toast.success("Uploaded");
        setImageSrc("");
        setEmployeeId("");
      }
    } catch {
      toast.error("Something went wrong! Please try again");
    }
    setSpinner(false);
  };
  return (
    <div className="d-flex justify-content-center flex-column align-items-center register-page">
      <p className="register-header">REGISTER</p>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
        <button className="camera-button" onClick={capture}>
          <i className="fa-solid fa-camera" style={{ fontSize: 30 }}></i>
        </button>
      </div>
      {imageSrc && (
        <div className="d-flex flex-column justify-content-center align-items-center position-absolute">
          <img className="camera-center" src={imageSrc} />
          <button
            className="camera-button camera-button--clear"
            onClick={() => setImageSrc("")}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: 30 }}></i>
          </button>
        </div>
      )}

      <div className="d-flex justify-content-center mb-5">
        <Input
          className="register-input"
          placeholder="Enter Employee ID"
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <button className="btn-upload" onClick={upload}>
          Upload
        </button>
        <ColorRing
          visible={spinner}
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          height={35}
          width={35}
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    </div>
  );
}

export default Upload;
