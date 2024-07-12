import React from "react";

const RawHtml = ({ html, onChange }) => {
  return (
    <div>
      <textarea value={html} onChange={e => onChange(e.target.value)} placeholder="Enter HTML" />
    </div>
  );
};

export default RawHtml;
