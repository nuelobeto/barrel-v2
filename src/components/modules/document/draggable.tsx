interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
}

export default function DraggableComponent({id, children}: DraggableItemProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.setData('type', 'new');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };

  return (
    <div
      id={id}
      draggable
      onDragStart={handleDragStart}
      className="cursor-grab last:col-span-2"
    >
      {children}
    </div>
  );
}
