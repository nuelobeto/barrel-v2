import {useState} from 'react';
import {Link} from 'react-router-dom';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {DocumentApiResponse, IDocument} from '@/types/document';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {ROUTES} from '@/router/routes';

function SuccessDialog({
  openSuccessDialog,
  setOpenSuccessDialog,
}: {
  openSuccessDialog: boolean;
  setOpenSuccessDialog: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={openSuccessDialog} onOpenChange={setOpenSuccessDialog}>
      <AlertDialogContent>
        <AlertDialogHeader className="bg-[#45AEFF40] -mx-6 rounded-t-3xl flex items-center">
          <div className="pt-6 pb-14">
            <img
              src="/images/large-check.svg"
              alt=""
              width={170}
              height={170}
            />
          </div>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <AlertDialogTitle className="px-2 text-neutral-600 text-2xl">
            Congratulations! You’re done.
          </AlertDialogTitle>
          <AlertDialogDescription className="px-2 text-neutral-400 text-base">
            Next, let’s take a look at the list of apps that you can use to
            start improving your business in minutes.
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="py-4 border-t border-neutral-25 -mx-6 px-6">
          <Link to={ROUTES.employeeDirectory}>
            <Button variant="secondary">Go home</Button>
          </Link>
          <Link to={ROUTES.documents}>
            <Button>
              <img src="/images/check.svg" alt="" width={20} height={20} />
              Go to documents
            </Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface DroppedItem {
  id: string;
  x: number;
  y: number;
  pageNumber: number;
}

const updatePdfDocument = async ({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: {
    page: number;
    imageUrl: string;
    components: DroppedItem[];
  }[];
}): Promise<DocumentApiResponse> => {
  const response = await fetch(`http://localhost:3001/documents/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({title, content}),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to update document');
  }

  return response.json();
};

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export default function SaveDocumentTriggerAction({
  children,
  currentDocument,
  components,
}: {
  children: React.ReactNode;
  currentDocument: IDocument;
  components: DroppedItem[];
}) {
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const form = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: currentDocument?.title || '',
    },
  });

  const {mutate, status} = useMutation({
    mutationFn: updatePdfDocument,
    onSuccess: () => {
      toast.success('Document saved successfully');
      setOpenFormDialog(false);
      setOpenSuccessDialog(true);
    },
    onError: error => {
      toast.error(error.message || 'Failed to save document');
    },
  });

  const onSubmit = (values: z.infer<typeof documentSchema>) => {
    const existingContentByPage = new Map(
      currentDocument.content.map(item => [item.page, {...item}]),
    );

    components.forEach(item => {
      const pageContent = existingContentByPage.get(item.pageNumber);

      if (!pageContent) {
        existingContentByPage.set(item.pageNumber, {
          page: item.pageNumber,
          imageUrl: '', // provide a default image URL if necessary
          components: [item],
        });
      } else {
        pageContent.components = pageContent.components
          .filter(comp => comp.id !== item.id)
          .concat(item);
      }
    });

    const content = Array.from(existingContentByPage.values());

    const payload = {
      id: currentDocument.id,
      title: values.title,
      content,
    };

    mutate(payload);
  };

  return (
    <Sheet open={openFormDialog} onOpenChange={setOpenFormDialog}>
      <SuccessDialog
        openSuccessDialog={openSuccessDialog}
        setOpenSuccessDialog={setOpenSuccessDialog}
      />
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="h-auto m-6">
        <SheetHeader className="border-b border-neutral-25 -mx-6 px-6 pb-6">
          <SheetTitle>Save Document</SheetTitle>
          <SheetDescription className="mt-2.5">
            Enter the title of the document you want to save
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grow flex flex-col"
          >
            <FormField
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="title">Document Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="title"
                      type="title"
                      placeholder="Enter document name"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="mt-auto flex items-center justify-center border-t border-neutral-25 -mx-6 px-6 pt-4">
              <SheetClose asChild>
                <Button variant="secondary">Cancel</Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={!form.watch('title') || status === 'pending'}
              >
                <img src="/images/check.svg" alt="" width={20} height={20} />
                Save document
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
