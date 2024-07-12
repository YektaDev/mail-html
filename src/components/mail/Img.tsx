import React from "react";

const Img = ({ src, onChange }) => {
  return <input value={src} onChange={e => onChange(e.target.value)} placeholder="Image URL" />;
};

export default Img;
