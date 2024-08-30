import {useRef, useState} from 'react';
import {DroppedItem, IDocument} from '@/types/document';
import DocumentHeader from './document-header';
import DroppedItemComponent from './dropped-item';
import {draggableItems} from '@/lib/constants';

interface PdfDocumentProps {
  document: IDocument;
  droppedItems: DroppedItem[];
  setDroppedItems: React.Dispatch<React.SetStateAction<DroppedItem[]>>;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  pageDimensions: {[key: number]: {width: number; height: number}};
}

export default function PdfDocument({
  document,
  droppedItems,
  setDroppedItems,
  handleDragOver,
  pageDimensions,
}: PdfDocumentProps) {
  const [scale, setScale] = useState(1);
  const svgRefs = useRef<SVGElement[]>([]);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    pageNumber: number,
  ) => {
    e.preventDefault();

    const id = e.dataTransfer.getData('text/plain');
    const type = e.dataTransfer.getData('type');

    const targetElement = e.currentTarget;
    const svgElement = targetElement.querySelector('svg');

    if (!svgElement) {
      return;
    }

    const svgRect = svgElement.getBoundingClientRect();
    const viewBox = svgElement.viewBox.baseVal;

    const scaleX = viewBox.width / svgRect.width;
    const scaleY = viewBox.height / svgRect.height;

    const adjustedScaleX = scaleX / scale;
    const adjustedScaleY = scaleY / scale;

    const x = (e.clientX - svgRect.left) * adjustedScaleX;
    const y = (e.clientY - svgRect.top) * adjustedScaleY;

    const newItem: DroppedItem = {
      id,
      x,
      y,
      pageNumber,
    };

    if (type === 'new') {
      if (id === 'checkbox') {
        newItem.checked = false;
      }
      setDroppedItems(prevItems => [...prevItems, newItem]);
    }
  };

  return (
    <>
      <DocumentHeader
        document={document}
        scale={scale}
        setScale={setScale}
        svgRefs={svgRefs}
      />
      <div className="p-14 w-full overflow-y-auto overflow-x-hidden max-h-screen rounded-10px rounded-b-none">
        {document?.content?.map(({page, imageUrl}) => (
          <div
            key={page}
            className="parent relative w-full h-full overflow-hidden [&:not(:first-child)]:my-5 rounded-10px shadow-[0px_24px_48px_-2px_rgba(16,24,40,0.18)]"
            onDrop={e => handleDrop(e, page)}
            onDragOver={handleDragOver}
          >
            <svg
              ref={el => {
                if (el) {
                  svgRefs.current[page] = el;
                }
              }}
              width="100%"
              height="100%"
              viewBox={`0 0 ${pageDimensions[page]?.width || 600} ${
                pageDimensions[page]?.height || 850
              }`}
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto rounded-10px"
            >
              <g transform={`matrix(1,0,0,1,0,0)`}>
                <image
                  href={imageUrl}
                  width="100%"
                  height="100%"
                  className="w-full h-auto rounded-10px"
                  data-page-number={page}
                />
              </g>
              {droppedItems
                .filter(item => item.pageNumber === page)
                .map(item => {
                  const draggableItem = draggableItems.find(
                    i => i.id === item.id.split('-')[0],
                  );

                  return (
                    <DroppedItemComponent
                      key={item.id}
                      item={item}
                      draggableItem={draggableItem}
                      setDroppedItems={setDroppedItems}
                    />
                  );
                })}
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}
