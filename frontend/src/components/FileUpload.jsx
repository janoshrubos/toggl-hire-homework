import React, { useState } from "react";
import Message from "./Message";
import DropZone from "./DropZone";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const fileHandler = async (files) => {
    setMessages([]);

    const emails = Array.from(files).map((file) => {
      const reader = new FileReader();
      const fileExtension = file.name.split(".").pop();
      if (fileExtension !== "txt") {
        addMessage(true, `Unsupported file extension: ${fileExtension}`);
        return null;
      }
      return new Promise((resolve) => {
        reader.onload = () =>
          resolve({ name: file.name, data: reader.result.trim().split("\n") });
        reader.readAsText(file);
      });
    });

    const result = await Promise.all(emails);
    setFiles(result.filter((file) => file !== null));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emails = files
      .map((file) => {
        return file.data;
      })
      .flat();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails: emails }),
    };
    setIsLoading(true);
    setMessages([]);

    fetch(`${process.env.REACT_APP_BACKEND}/send`, requestOptions).then(
      (response) => {
        if (response.status === 200) {
          addMessage(false, "Emails sent successfully!");
          setFiles([]);
        } else if (response.status === 422) {
          response.json().then((data) => {
            addMessage(
              true,
              "There was an error! Failed to send the following emails:",
              data.emails
            );
          });
        } else if (response.status === 500) {
          addMessage(
            true,
            "There was an unexpcted server error! Please try again."
          );
        } else {
          addMessage(true, "There was an unexpcted error! Please try again.");
        }
        setIsLoading(false);
      }
    );
  };

  const addMessage = (isError, text, errorList = []) => {
    setMessages((messages) => [
      ...messages,
      { isError: isError, text: text, errorList: errorList },
    ]);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <DropZone
          isLoading={isLoading}
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
          {messages.map((message) => (
            <Message
              isError={message.isError}
              close={() => {}}
              text={message.text}
              errorList={message.errorList}
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
