import React from "react";

const Img = ({
  src,
  alt,
  width,
  height,
  onSrcChange,
  onAltChange,
  onWidthChange,
  onHeightChange,
}) => {
  const fieldClass = "mt-1 w-full rounded border border-primary-300 p-2";
  return (
    <div>
      <input
        value={src}
        onChange={e => onSrcChange(e.target.value)}
        placeholder="Image URL"
        className={fieldClass}
      />
      <input
        value={alt}
        onChange={e => onAltChange(e.target.value)}
        placeholder="Alt Text"
        className={fieldClass}
      />
      <input
        value={width}
        onChange={e => onWidthChange(e.target.value)}
        placeholder="Width"
        className={fieldClass}
      />
      <input
        value={height}
        onChange={e => onHeightChange(e.target.value)}
        placeholder="Height"
        className={fieldClass}
      />
    </div>
  );
};

export default Img;
