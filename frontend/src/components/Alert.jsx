function Alert({ alert, onClose }) {
  return (
    <div className={`alert alert--${alert.type}`}>
      <span>{alert.message}</span>
      <button type="button" onClick={onClose}>
        x
      </button>
    </div>
  );
}

export default Alert;
