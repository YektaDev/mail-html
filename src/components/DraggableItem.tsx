import { useDrag, useDrop } from "react-dnd";

const ItemType = "ITEM";

const DraggableItem = ({ item, index, moveItem }) => {
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
    <div ref={node => ref(drop(node))} className="draggable-item">
      {item.type === "raw" && <div dangerouslySetInnerHTML={{ __html: item.html }} />}
      {item.type === "primaryButton" && <button className="btn btn-primary">{item.label}</button>}
      {item.type === "secondaryButton" && (
        <button className="btn btn-secondary">{item.label}</button>
      )}
    </div>
  );
};

export default DraggableItem;
