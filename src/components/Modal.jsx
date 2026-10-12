import React, {
  useEffect,
} from "react";

import Icon from "./Icon.jsx";

export default function Modal({
  open,
  title,
  subtitle,
  children,
  onClose,
  footer,
  wide = false,
}) {
  useEffect(() => {
    if (!open) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.classList.add(
      "modal-open"
    );

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.classList.remove(
        "modal-open"
      );

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-backdrop-custom"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className={`modal-card ${
          wide ? "modal-card--wide" : ""
        }`}
      >
        <div className="modal-card__header">
          <div>
            <h2>{title}</h2>

            {subtitle && (
              <p>{subtitle}</p>
            )}
          </div>

          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon
              name="close"
              size={20}
            />
          </button>
        </div>

        <div className="modal-card__body">
          {children}
        </div>

        {footer && (
          <div className="modal-card__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}