import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {EyeOpenIcon} from '@/components/ui/icons';
import {useState} from 'react';

type Props = {
  title: string;
  content: string;
};

export const PreviewTemplate = ({title, content}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="secondary">
          <EyeOpenIcon className="fill-neutral-600" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent
        hideClosebtn={true}
        className="w-[900px] h-screen py-[70px] bg-transparent  border-transparent overflow-auto"
      >
        <div className="w-full h-full bg-white rounded-xl">
          <DialogHeader className="flex-row justify-between items-center h-[88px] border-b border-neutral-25 px-[24px]">
            <div className="flex flex-col gap-[8px]">
              <DialogTitle className="text-neutral-600 text-[20px] leading-8">
                {title ? title : 'Untitled document'}
              </DialogTitle>
              <DialogDescription className="text-neutral-400">
                We’ve filled in your smart text with example info so you can see
                what this offer will look like.
              </DialogDescription>
            </div>
            <Button variant={'secondary'} onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogHeader>
          <div
            className="whitespace-pre-line py-[58px] px-[36px] text-neutral-500 text-base leading-[34px]"
            dangerouslySetInnerHTML={{__html: content}}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
