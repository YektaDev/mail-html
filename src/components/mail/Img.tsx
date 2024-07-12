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
  const fieldClass = "mt-1 w-full rounded border border-primary-300 py-1 px-1.5";
  const sizeFieldClass = fieldClass + " w-[3.1rem]";
  return (
    <div className="flex w-full space-x-2 text-xs">
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

      <div className="flex flex-1 items-center">
        <input
          value={width}
          onChange={e => onWidthChange(e.target.value)}
          placeholder="Width"
          className={sizeFieldClass}
        />
        <span
          className="-mb-1.5 select-none items-center text-center font-light text-primary-700"
          aria-hidden={true}
          dangerouslySetInnerHTML={{ __html: "&times;" }}
        />
        <input
          value={height}
          onChange={e => onHeightChange(e.target.value)}
          placeholder="Height"
          className={sizeFieldClass}
        />
      </div>
    </div>
  );
};

export default Img;
