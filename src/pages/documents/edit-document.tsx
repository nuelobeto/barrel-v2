import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {useQuery} from '@tanstack/react-query';
import {Loader} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Button} from '@/components/ui/button';
import {DocumentFilledIcon, EyeOpenIcon} from '@/components/ui/icons';
import {
  DashboardLayout,
  Header,
  Main,
} from '@/components/layouts/dashboard-layout';
import SaveDocumentTriggerAction from '@/components/modules/document/save-document';
import {
  ImageDimensions,
  DocumentApiResponse,
  DroppedItem,
} from '@/types/document';
import PreviewDocumentActionTrigger from '@/components/modules/document/preview-document';
import {draggableItems} from '@/lib/constants';
import {ROUTES} from '@/router/routes';
import {getImageDimensions} from '@/helpers';
import DraggableComponent from '@/components/modules/document/draggable';
import PdfDocument from '@/components/modules/document/pdf-document';

const fetchPdfDocument = async (id: string): Promise<DocumentApiResponse> => {
  const response = await fetch(`http://localhost:3001/documents/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch state');
  }
  return response.json();
};

export const EditDocument = () => {
  const {docId} = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageDimensions, setPageDimensions] = useState<ImageDimensions>({});
  const [isPageDimensionsReady, setIsPageDimensionsReady] = useState(false);
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);

  const {data, status} = useQuery({
    queryKey: ['document', docId],
    queryFn: () => fetchPdfDocument(docId as string),
  });

  const document = data?.data;

  useEffect(() => {
    if (document?.content) {
      const allComponents = document.content.flatMap(page => page.components);
      setDroppedItems(allComponents);

      // we need to get the exact dimensions of the images to pass to the SVG viewBox
      const fetchDimensions = async () => {
        const dimensions: ImageDimensions = {};
        for (const page of document.content) {
          try {
            const dimension = await getImageDimensions(page.imageUrl);
            dimensions[page.page] = dimension as {
              width: number;
              height: number;
            };
          } catch (error) {
            console.error(
              `Error fetching dimensions for page ${page.page}:`,
              error,
            );
            dimensions[page.page] = {width: 600, height: 850};
          }
        }
        setPageDimensions(dimensions);
        setIsPageDimensionsReady(true);
      };

      fetchDimensions();
    }
  }, [document?.content]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const isDocumentReady =
    document && status === 'success' && isPageDimensionsReady;

  return (
    <DashboardLayout>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.documentTemplates}>
                Documents
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit document</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          {!isDocumentReady ? (
            <>
              <Button variant="secondary">
                <EyeOpenIcon className="fill-neutral-600" />
                Preview
              </Button>

              <Button>
                <DocumentFilledIcon className="fill-white" />
                Continue
              </Button>
            </>
          ) : (
            <>
              <PreviewDocumentActionTrigger
                document={document}
                droppedItems={droppedItems}
                pageDimensions={pageDimensions}
              >
                <EyeOpenIcon className="fill-neutral-600" />
                Preview
              </PreviewDocumentActionTrigger>
              <SaveDocumentTriggerAction
                currentDocument={document}
                components={droppedItems}
              >
                <Button>
                  <DocumentFilledIcon className="fill-white" />
                  Continue
                </Button>
              </SaveDocumentTriggerAction>
            </>
          )}
        </div>
      </Header>

      <Main>
        <section className="min-h-screen h-fit flex items-start gap-7 w-full bg-periwinkle-25 pl-7">
          {!isDocumentReady ? (
            <div className="w-[72%] pt-20 flex justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <div
              ref={containerRef}
              onDragOver={handleDragOver}
              className="w-[72%] pb-20 mt-6 bg-periwinkle-100 border border-neutral-50 rounded-xl rounded-b-none relative"
            >
              <PdfDocument
                document={document}
                droppedItems={droppedItems}
                setDroppedItems={setDroppedItems}
                handleDragOver={handleDragOver}
                pageDimensions={pageDimensions}
              />
            </div>
          )}

          <div className="w-[28%] sticky top-0 border-l border-b border-periwinkle-100 bg-white grid grid-cols-2 text-neutral-600 text-center">
            {draggableItems.map(item => (
              <DraggableComponent
                key={`${item.id}-${uuidv4()}`}
                id={`${item.id}-${uuidv4()}`}
              >
                <div className="flex flex-col items-center gap-1.5 py-6 xl:py-10 px-4 2xl:px-0 h-full border-r border-b border-periwinkle-100">
                  <img
                    src={`/images/templates/${item.id}.svg`}
                    alt={item.label}
                    width={32}
                    height={32}
                  />
                  <p className="text-xs xl:text-sm">{item.label}</p>
                </div>
              </DraggableComponent>
            ))}
          </div>
        </section>
      </Main>
    </DashboardLayout>
  );
};
