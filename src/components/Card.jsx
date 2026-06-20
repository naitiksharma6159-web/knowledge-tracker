import React from "react";

/**
 * Reusable Card component styled with professional dark dashboard variables.
 * @param {object} props
 * @param {string} [props.title] - Optional title for the card
 * @param {React.ReactNode} [props.actions] - Optional actions/buttons in the header
 * @param {string} [props.className] - Optional custom CSS classes
 * @param {React.ReactNode} props.children - Card contents
 */
const Card = ({ title, actions, className = "", children }) => {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
