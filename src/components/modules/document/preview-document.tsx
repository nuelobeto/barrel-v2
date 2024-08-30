import React, {RefObject, useRef, useState} from 'react';
import Draggable from 'react-draggable';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Text} from '@/components/ui/typography';
import {DroppedItem, IDocument} from '@/types/document';
import {draggableItems} from '@/lib/constants';

interface PreviewProps {
  document: IDocument;
  droppedItems: DroppedItem[];
  pageDimensions: Record<number, {width: number; height: number}>;
  children: React.ReactNode;
}

export default function PreviewDocumentActionTrigger({
  document,
  droppedItems,
  pageDimensions,
  children,
}: PreviewProps) {
  const [open, setOpen] = useState(false);
  const reactDraggableRef = useRef<SVGForeignObjectElement | HTMLElement>(null);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 bg-neutral-25 border border-neutral-50 text-neutral-600 hover:bg-neutral-50 active:bg-neutral-100 h-10 px-4 py-2">
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent
        aria-describedby="preview-document"
        className="max-w-[1042px]"
      >
        <AlertDialogHeader className="sticky top-0 py-4 rounded-t-3xl border-b border-neutral-25 -mx-6 px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Text
                variant="heading9"
                element="h2"
                className="font-semibold text-neutral-600"
              >
                Preview of “{document?.title}”
              </Text>
              <Text variant="body6" className="text-neutral-400">
                We’ve filled in your smart text with example info so you can see
                what this offer will look like.
              </Text>
            </div>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </div>
        </AlertDialogHeader>
        <AlertDialogTitle className="sr-only">
          Preview of “{document?.title}”
        </AlertDialogTitle>
        <div className="space-y-2 pt-6 pb-10" id="preview-document">
          <div className="w-full overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] bg-white">
            {document?.content?.map(({page, imageUrl}) => (
              <div
                key={page}
                className="parent relative w-full h-full overflow-hidden my-5"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${pageDimensions[page]?.width || 600} ${
                    pageDimensions[page]?.height || 850
                  }`}
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  <g transform={`matrix(1,0,0,1, 0, 0)`}>
                    <image
                      href={imageUrl}
                      width="100%"
                      height="100%"
                      className="w-full h-auto"
                      data-page-number={page}
                    />
                  </g>
                  {droppedItems
                    .filter(item => item.pageNumber === page)
                    .map(item => {
                      const draggableItem = draggableItems.find(
                        i => i.id === item.id.split('-')[0],
                      );

                      const renderComponent = () => {
                        if (draggableItem) {
                          if (draggableItem.label === 'Checkbox') {
                            return React.cloneElement(
                              draggableItem.component as React.ReactElement,
                              {
                                checked: item.checked ?? false,
                              },
                            );
                          }

                          if (item.text) {
                            return React.cloneElement(
                              draggableItem.component as React.ReactElement,
                              {},
                              item.text,
                            );
                          } else {
                            return draggableItem.component;
                          }
                        }
                        return 'Unknown Item';
                      };

                      return (
                        <Draggable
                          nodeRef={reactDraggableRef as RefObject<HTMLElement>}
                          key={item.id}
                          defaultPosition={{x: item.x, y: item.y}}
                          bounds=".parent"
                          disabled
                        >
                          <foreignObject
                            ref={
                              reactDraggableRef as RefObject<SVGForeignObjectElement>
                            }
                            width="100"
                            height="100"
                            className="overflow-visible"
                          >
                            <div
                              style={{transform: `scale(${2.4})`}}
                              className="min-h-8 w-max text-xs font-medium flex items-center"
                            >
                              <span className="text-purple-700 font-medium px-2 min-h-8 flex items-center justify-center text-base bg-white">
                                {renderComponent()}
                              </span>
                            </div>
                          </foreignObject>
                        </Draggable>
                      );
                    })}
                </svg>
              </div>
            ))}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
