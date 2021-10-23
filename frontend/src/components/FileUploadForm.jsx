import React, { useState } from "react";
import Message from "./Message";
import DropZone from "./DropZone";
import { sendEmails } from "../services/apiHandler";

const FileUploadState = {
  idle: "idle",
  loading: "loading",
};

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadState, setUploadState] = useState(FileUploadState.idle);
  const [message, setMessage] = useState(null);

  const fileHandler = async (eventFiles) => {
    setMessage(null);

    const data = Array.from(eventFiles).map((file) => {
      const reader = new FileReader();
      const fileExtension = file.name.split(".").pop();

      if (fileExtension !== "txt") {
        setMessage({
          message: `Unsupported file extension: ${fileExtension}. Use .txt files only!`,
          ok: false,
        });
        return Promise.reject();
      }
      return new Promise((resolve) => {
        reader.onload = () => {
          resolve({ name: file.name, data: reader.result.trim().split("\n") });
        };
        reader.readAsText(file);
      });
    });

    const result = await Promise.all(data);
    setFiles(result);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emails = files.reduce((acc, { data }) => acc.concat(data), []);

    setMessage(null);
    setUploadState(FileUploadState.loading);

    const { message, ok, data } = await sendEmails(emails);

    if (ok) {
      setFiles([]);
    }

    setMessage({ message, ok, data });
    setUploadState(FileUploadState.idle);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <DropZone
          isLoading={uploadState === FileUploadState.loading}
          files={files}
          fileHandler={fileHandler}
        />
        <div className="button-container">
          <input
            type="submit"
            value="Send emails"
            className="upload-btn"
            disabled={files.length === 0}
          />
          {message && <Message item={message} />}
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
