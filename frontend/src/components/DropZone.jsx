const DropZone = ({ isLoading, files, fileHandler }) => {
  const dragOver = (event) => {
    event.preventDefault();
  };

  const dragEnter = (event) => {
    event.preventDefault();
  };

  const dragLeave = (event) => {
    event.preventDefault();
  };

  const fileDrop = (event) => {
    event.preventDefault();
    fileHandler(event.dataTransfer.files);
  };

  const dragClick = (event) => {
    document.getElementById("fileInput").click();
  };

  const onFileChange = async (event) => {
    event.preventDefault();
    fileHandler(event.target.files);
    event.target.value = null;
  };

  return (
    <div
      className="drop-zone"
      onDragOver={dragOver}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDrop={fileDrop}
      onClick={dragClick}
    >
      <input
        id="fileInput"
        type="file"
        name="myFile"
        multiple
        accept=".txt"
        onChange={(event) => onFileChange(event)}
      />
      <div className="drop-message-container">
        {files.length === 0 && !isLoading && (
          <>
            <img
              src="/img/drag.svg"
              alt="Drag and Drop icon"
              className="drop-icon"
            />
            <div className="drop-message">
              Drag and Drop files here or click to upload
            </div>
          </>
        )}
        {files.length > 0 && !isLoading && (
          <div className="file-container">
            {files.map((file) => {
              return (
                <div key={file.name} className="file">
                  <i className="fas fa-file-alt fa-4x"></i>
                  <div className="file-name">{file.name}</div>
                  <div className="file-length">{file.data.length} emails</div>
                </div>
              );
            })}
          </div>
        )}
        {isLoading && <div className="spinner"></div>}
      </div>
    </div>
  );
};

export default DropZone;
