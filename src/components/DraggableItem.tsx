import React from "react";
import { useDrag, useDrop } from "react-dnd";
import RawHtml from "./mail/RawHtml";
import Button from "./mail/Button.tsx";
import Img from "./mail/Img";
import fieldStyle from "./fieldStyle.ts";

const ItemType = "ITEM";

const DraggableItem = ({ item, index, moveItem, deleteItem, updateItem }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleChange = (key: string, value: string) => {
    updateItem(index, { ...item, [key]: value });
  };

  return (
    <div
      ref={node => ref(drop(node))}
      className={"flex bg-primary-100 p-2 shadow-md " + fieldStyle}
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      <button title="Delete Item" aria-label="Delete Item" onClick={() => deleteItem(index)}>
        <svg
          className="-mt-0.5 me-4 inline size-4 text-primary-400 hover:text-primary-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
        >
          <path
            fill="currentColor"
            d="M15.1 3.1L12.9.9L8 5.9L3.1.9L.9 3.1l5 4.9l-5 4.9l2.2 2.2l4.9-5l4.9 5l2.2-2.2l-5-4.9z"
          />
        </svg>
      </button>
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
    </div>
  );
};

export default DraggableItem;
