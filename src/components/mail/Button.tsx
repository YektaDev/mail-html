import React from "react";

const Button = ({ label, href, inNewTab, onLabelChange, onHrefChange, onInNewTabChange }) => {
  return (
    <div>
      <input value={label} onChange={e => onLabelChange(e.target.value)} placeholder="Label" />
      <input value={href} onChange={e => onHrefChange(e.target.value)} placeholder="URL" />
      <input
        type="checkbox"
        checked={inNewTab}
        onChange={e => onInNewTabChange(e.target.checked)}
      />
    </div>
  );
};

export default Button;
