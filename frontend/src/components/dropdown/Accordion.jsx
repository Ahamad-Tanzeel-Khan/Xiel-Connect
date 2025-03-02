import React from "react";
import "./Accordion.css";

const Accordion = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="accordion">
      <div className="accordion-header" onClick={onToggle}>
        <span>{title}</span>
        <span className={`arrow ${isOpen ? "open" : ""}`}>&#9662;</span>
      </div>
      <div className={`accordion-content ${isOpen ? "show" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
