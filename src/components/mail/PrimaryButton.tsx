import React from "react";

const PrimaryButton = ({ label, onChange }) => {
  return (
    <input
      value={label}
      onChange={e => onChange(e.target.value)}
      placeholder="Primary Button Label"
    />
  );
};

export default PrimaryButton;
