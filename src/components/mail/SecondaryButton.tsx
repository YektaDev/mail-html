import React from "react";

const SecondaryButton = ({ label, onChange }) => {
  return (
    <input
      value={label}
      onChange={e => onChange(e.target.value)}
      placeholder="Secondary Button Label"
    />
  );
};

export default SecondaryButton;
