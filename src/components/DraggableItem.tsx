import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { fieldStyle } from "./styles.ts";
import Item from "./Item.tsx";

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
          className="xs:me-4 -mt-0.5 me-2 inline size-4 text-primary-400 hover:text-primary-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
        >
          <path
            fill="currentColor"
            d="M15.1 3.1L12.9.9L8 5.9L3.1.9L.9 3.1l5 4.9l-5 4.9l2.2 2.2l4.9-5l4.9 5l2.2-2.2l-5-4.9z"
          />
        </svg>
      </button>
      <Item item={item} handleChange={handleChange} />
    </div>
  );
};

export default DraggableItem;
