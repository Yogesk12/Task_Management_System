import styles from "./modal.module.css";

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "medium",
}) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
    >
      <div
        className={`${styles.modal} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >

        {/* Header */}

        <div className={styles.header}>

          <div>
            <h2 id="modal-title">
              {title}
            </h2>

            {description && (
              <p>
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className={styles.body}>
          {children}
        </div>

      </div>
    </div>
  );
}

export default Modal;