const Message = ({ isError, text, errorList }) => {
  return (
    <div className={`message-container ${isError ? "error" : "success"}`}>
      {text}
      {errorList.length !== 0 && (
        <ul>
          {errorList.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Message;
