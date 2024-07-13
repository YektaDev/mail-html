import RawHtml from "./mail/RawHtml.tsx";
import Button from "./mail/Button.tsx";
import Img from "./mail/Img.tsx";
import React from "react";

const Item = ({ item, handleChange }) => {
  if (!item) return null;
  return (
    <div className="flex flex-1 items-center">
      {item.type === "raw" && (
        <RawHtml html={item.html} onChange={value => handleChange("html", value)} />
      )}
      {(item.type === "primaryButton" || item.type === "secondaryButton") && (
        <Button
          label={item.label}
          href={item.href}
          inNewTab={item.inNewTab}
          onLabelChange={(value: string) => handleChange("label", value)}
          onHrefChange={(value: string) => handleChange("href", value)}
          onInNewTabChange={(value: string) => handleChange("inNewTab", value)}
        />
      )}
      {item.type === "img" && (
        <Img
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          onSrcChange={(value: string) => handleChange("src", value)}
          onAltChange={(value: string) => handleChange("alt", value)}
          onWidthChange={(value: string) => handleChange("width", value)}
          onHeightChange={(value: string) => handleChange("height", value)}
        />
      )}
    </div>
  );
};

export default Item;
