import React from "react";
import { fieldStyle } from "../styles.ts";

const commonFieldClass = "py-1 px-1.5 " + fieldStyle;
const propFieldClass = commonFieldClass + " sm:w-0 flex-1";
const sizeFieldClass = commonFieldClass + " w-[3.1rem]";
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
  return (
    <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row">
      <input
        value={src}
        onChange={e => onSrcChange(e.target.value)}
        placeholder="Image URL"
        className={propFieldClass}
      />
      <input
        value={alt}
        onChange={e => onAltChange(e.target.value)}
        placeholder="Alt Text"
        className={propFieldClass}
      />

      <div className="mx-auto flex items-center">
        <input
          value={width}
          onChange={e => onWidthChange(e.target.value)}
          placeholder="Width"
          className={sizeFieldClass}
        />
        <span
          className="-mb-1.5 select-none items-center px-0.5 text-center font-light text-primary-600"
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
