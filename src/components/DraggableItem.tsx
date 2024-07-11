import { useDrag, useDrop } from "react-dnd";

const ItemType = "ITEM";

const DraggableItem = ({ item, index, moveItem, deleteItem }) => {
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

  return (
    <div
      ref={node => ref(drop(node))}
      className="flex rounded border border-primary-300 bg-primary-200 p-2"
    >
      <button aria-label="Delete Item" onClick={() => deleteItem(index)}>
        <svg
          className="-mt-0.5 me-4 inline size-5"
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
        {item.type === "raw" && <div dangerouslySetInnerHTML={{ __html: item.html }} />}
        {item.type === "primaryButton" && <button className="btn btn-primary">{item.label}</button>}
        {item.type === "secondaryButton" && (
          <button className="btn btn-secondary">{item.label}</button>
        )}
      </div>
    </div>
  );
};

export default DraggableItem;
