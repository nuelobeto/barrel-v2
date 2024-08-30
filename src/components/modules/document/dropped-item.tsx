import React, {RefObject, useRef} from 'react';
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {DraggableItem, DroppedItem} from '@/types/document';
import {Button} from '@/components/ui/button';

interface DroppedItemProps {
  item: DroppedItem;
  draggableItem: DraggableItem | undefined;
  setDroppedItems: React.Dispatch<React.SetStateAction<DroppedItem[]>>;
}

export default function DroppedItemComponent({
  item,
  draggableItem,
  setDroppedItems,
}: DroppedItemProps) {
  const reactDraggableRef = useRef<SVGForeignObjectElement | HTMLElement>(null);

  const handleDelete = (id: string) => {
    setDroppedItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleBlur =
    (itemId: string, isCheckbox: boolean) =>
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!isCheckbox) {
        const updatedText = e.currentTarget.innerText;
        setDroppedItems(prevItems =>
          prevItems.map(i => (i.id === itemId ? {...i, text: updatedText} : i)),
        );
      }
    };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setDroppedItems(prevItems =>
      prevItems.map(item => (item.id === id ? {...item, checked} : item)),
    );
  };

  const handleStop = (_: DraggableEvent, data: DraggableData, id: string) => {
    setDroppedItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            x: data.x,
            y: data.y,
          };
        }
        return item;
      });
    });
  };

  const isCheckbox = draggableItem?.label === 'Checkbox';

  const renderComponent = () => {
    if (!draggableItem) return 'Unknown Item';

    if (isCheckbox) {
      return React.cloneElement(draggableItem.component, {
        checked: item.checked ?? false,
        onCheckedChange: (checked: boolean) =>
          handleCheckboxChange(item.id, checked),
      });
    }

    return item.text
      ? React.cloneElement(draggableItem.component, {}, item.text)
      : draggableItem.component;
  };

  return (
    <Draggable
      nodeRef={reactDraggableRef as RefObject<HTMLElement>}
      key={item.id}
      defaultPosition={{x: item.x, y: item.y}}
      onStop={(e, data) => handleStop(e, data, item.id)}
      bounds=".parent"
    >
      <foreignObject
        ref={reactDraggableRef as RefObject<SVGForeignObjectElement>}
        width="100"
        height="100"
        className="overflow-visible"
      >
        <div
          style={{transform: `scale(${2.4})`}}
          className="w-max fixed z-50 rounded-lg border border-purple-400 min-h-8 flex items-center justify-center [background:linear-gradient(0deg,_rgba(230,219,254,0.1),_rgba(230,219,254,0.1)),#FFFFFF]"
        >
          <span
            onDoubleClick={e => {
              if (!isCheckbox) {
                e.currentTarget.contentEditable = 'true';
                e.currentTarget.focus();
              }
            }}
            suppressContentEditableWarning
            onBlur={handleBlur(item.id, isCheckbox)}
            className="text-base text-purple-900 font-medium rounded-lg px-2 min-h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {renderComponent()}
          </span>
          <Button
            variant="ghost"
            className="p-0 absolute -top-2 -right-2 h-4 w-4"
            onClick={() => handleDelete(item.id)}
          >
            <img src="/images/cancel.svg" alt="delete" width={16} height={16} />
          </Button>
        </div>
      </foreignObject>
    </Draggable>
  );
}
