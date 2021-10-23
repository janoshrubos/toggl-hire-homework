const Message = ({ item }) => {
  const { ok, message, data } = item;

  return (
    <div className={`message-container ${ok ? "success" : "error"}`}>
      {message}
      {data && data.length !== 0 && (
        <ul className="error-list">
          {data.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Message;
