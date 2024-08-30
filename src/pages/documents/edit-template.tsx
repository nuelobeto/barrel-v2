import {
  DashboardLayout,
  Header,
  Main,
} from '@/components/layouts/dashboard-layout';
import TextEditor from '@/components/modules/document/editor';
import {SaveTemplate} from '@/components/modules/document/save-template';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {useState} from 'react';
import {PreviewTemplate} from '@/components/modules/document/preview-template';

export const EditTemplate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <DashboardLayout>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <PreviewTemplate title={title} content={content} />
          <SaveTemplate setShowSuccess={setShowSuccess} />
        </div>
      </Header>

      <Main>
        <div className="w-full h-full pt-6 px-7 overflow-auto bg-periwinkle-25">
          <div className="w-full h-[calc(100vh-96px-24px)]">
            <TextEditor
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
            />
          </div>
        </div>

        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogTrigger hidden></DialogTrigger>
          <DialogContent
            style={{borderRadius: '24px'}}
            className="p-6 w-[428px] gap-0 rounded-3xl"
            hideClosebtn={true}
          >
            <DialogHeader className="flex flex-col items-center space-y-4">
              <img
                src="/images/Success.svg"
                alt=""
                className="block mt-[33px]"
              />
              <DialogTitle className="text-2xl font-semibold text-center text-neutral-800">
                Congratulations! You’re done.
              </DialogTitle>
              <DialogDescription className="text-center mt-4 text-base text-neutral-800 font-normal">
                Next, let’s take a look at the list of apps that you can use to
                start improving your business in minutes.
              </DialogDescription>
            </DialogHeader>
            <Button
              className="w-fit block mx-auto mt-8"
              onClick={() => setShowSuccess(false)}
            >
              Go to documents
            </Button>
          </DialogContent>
        </Dialog>
      </Main>
    </DashboardLayout>
  );
};
