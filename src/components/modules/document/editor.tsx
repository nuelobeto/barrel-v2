import {Button} from '@/components/ui/button';
import {
  DownArrowIcon,
  FormatAddLinkIcon,
  FormatAlignCenterIcon,
  FormatAlignJustifyIcon,
  FormatAlignLeftIcon,
  FormatAlignRightIcon,
  FormatBoldIcon,
  FormatBulletListIcon,
  FormatImageIcon,
  FormatItalicsIcon,
  FormatNumberedListIcon,
  FormatQuoteIcon,
  FormatStrikethroughIcon,
  FormatUnderlineIcon,
} from '@/components/ui/icons';
import {Separator} from '@/components/ui/separator';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/ui/popover';

import {cn} from '@/lib/utils';

import {useEffect, useRef, useState} from 'react';
import {FileType} from '@/types';
import {Input} from '@/components/ui/input';
import {FileUpload} from '@/components/common/file-upload';

type Props = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

interface SmartTextFieldType {
  id: string;
  name: string;
  type: string;
}

export default function TextEditor({
  title,
  setTitle,
  content,
  setContent,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState('');
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const [uploadSrc, setUploadSrc] = useState<FileType | null>(null);
  const [src, setSrc] = useState('');
  const [openImageModal, setOpenImageModal] = useState(false);
  const savedSelectionRef = useRef<Range | null>(null);
  const smartTextFields: SmartTextFieldType[] = [
    {
      id: '5b82b72d-1718-4135-ab1d-77c107451f1c',
      name: 'Employee First Name',
      type: 'Short Text',
    },
    {
      id: '6c9d8d69-0c21-4d24-826f-5d9e93f4a5ea',
      name: 'Employee Last Name',
      type: 'Short Text',
    },
    {
      id: 'c0f75878-7e32-493a-89b8-df7b8fb3b63b',
      name: 'Employee Full Name',
      type: 'Short Text',
    },
    {
      id: '4a571c6e-e5fc-45b7-9c55-abae8a59504f',
      name: 'Employee Signature',
      type: 'Signature',
    },
    {
      id: 'f0b0a4be-4e7a-47f1-95d7-2a17906d96ae',
      name: 'Employee Email',
      type: 'Email',
    },
    {
      id: 'c95d89c1-d1ff-4b0d-b5be-dc9c53b3fc70',
      name: 'Employer Signatory name',
      type: 'Short Text',
    },
    {
      id: '8a2d1b23-cbf8-499a-bb95-216ff4f1843d',
      name: 'Employer Signatory Title',
      type: 'Short Text',
    },
    {
      id: 'e6a16ab7-d8d9-4d0a-9b25-83b1a2c2f6b0',
      name: 'Company name',
      type: 'Short Text',
    },
  ];

  console.log({content});

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // const insertSmartTextField = (field: SmartTextFieldType) => {
  //   const smartField = document.createElement('div');
  //   smartField.classList.add('smart-field');
  //   smartField.id = field.id;
  //   smartField.contentEditable = 'false';
  //   const text = document.createElement('span');
  //   text.innerText = field.name;
  //   const cancelBtn = document.createElement('button');
  //   const icon = document.createElement('img');
  //   icon.src = '/images/cancel-field.svg';
  //   cancelBtn.appendChild(icon);
  //   smartField.appendChild(text);
  //   smartField.appendChild(cancelBtn);

  //   cancelBtn.addEventListener('click', () => deleteSmartTextField(field.id));

  //   const selection = window.getSelection();
  //   if (selection && selection.rangeCount > 0) {
  //     const range = selection.getRangeAt(0);
  //     range.deleteContents(); // Remove any selected text
  //     range.insertNode(smartField);
  //   } else if (editorRef.current) {
  //     // If there's no selection, append it to the editor as a fallback
  //     editorRef.current.appendChild(smartField);
  //   }
  // };

  const insertSmartTextField = (field: SmartTextFieldType) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedNode = range.commonAncestorContainer;

    // Check if the selection is inside the editor
    if (!editorRef.current.contains(selectedNode)) {
      // If not, do not insert the smart field
      return;
    }

    const smartField = document.createElement('div');
    smartField.classList.add('smart-field');
    smartField.id = field.id;
    smartField.contentEditable = 'false';

    const text = document.createElement('span');
    text.innerText = field.name;

    const cancelBtn = document.createElement('button');
    const icon = document.createElement('img');
    icon.src = '/images/cancel-field.svg';
    cancelBtn.appendChild(icon);

    smartField.appendChild(text);
    smartField.appendChild(cancelBtn);

    cancelBtn.addEventListener('click', () => deleteSmartTextField(field.id));

    range.deleteContents(); // Remove any selected text
    range.insertNode(smartField);
  };

  const deleteSmartTextField = (id: string) => {
    const smartField = document.getElementById(id);
    smartField?.remove();
  };

  const applyStyle = (command: string, value?: string) => {
    document.execCommand(command, false, value || '');
  };

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && savedSelectionRef.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRef.current);
    }
  };

  const collapseSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.collapseToEnd();
    }
  };

  const setLink = () => {
    if (url) {
      restoreSelection(); // Restore the selection before applying the link
      applyStyle('createLink', url);
      collapseSelection();
      setUrl('');
      setOpenLinkModal(false);
      focusEditor();
    }
  };

  const insertImageViaUrl = () => {
    if (src) {
      restoreSelection(); // Restore the selection before inserting the image
      applyStyle('insertImage', src);
      setSrc('');
      setOpenImageModal(false);
      focusEditor();
    }
  };

  useEffect(() => {
    if (uploadSrc) {
      applyStyle('insertImage', uploadSrc.url);
      setUploadSrc(null);
      focusEditor();
    }
  }, [uploadSrc]);

  useEffect(() => {
    if (openLinkModal || openImageModal) {
      saveSelection(); // Save the selection when the modal opens
    }
  }, [openLinkModal, openImageModal]);

  useEffect(() => {
    focusEditor();
  }, []);

  return (
    <>
      <div className="w-full h-[72px] bg-white border border-neutral-50 rounded-t-xl flex items-center justify-between gap-16 px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="bg-white hover:bg-white active:bg-white justify-between min-w-[263px] w-fit text-neutral-300 p-[10px]"
            >
              Insert smart text field
              <DownArrowIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[263px] w-fit">
            {smartTextFields.map((field, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => insertSmartTextField(field)}
              >
                {field.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('bold')}
          >
            <FormatBoldIcon />
          </Button>
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('italic')}
          >
            <FormatItalicsIcon />
          </Button>
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('underline')}
          >
            <FormatUnderlineIcon />
          </Button>
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('strikeThrough')}
          >
            <FormatStrikethroughIcon />
          </Button>
          <Separator className="h-[18px] w-[1px] bg-neutral-100" />
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('justifyLeft')}
          >
            <FormatAlignLeftIcon />
          </Button>
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('justifyCenter')}
          >
            <FormatAlignCenterIcon />
          </Button>
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('justifyRight')}
          >
            <FormatAlignRightIcon />
          </Button>
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('justifyFull')}
          >
            <FormatAlignJustifyIcon />
          </Button>
          <Separator className="h-[18px] w-[1px] bg-neutral-100" />
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('insertUnorderedList')}
          >
            <FormatBulletListIcon />
          </Button>
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('insertOrderedList')}
          >
            <FormatNumberedListIcon />
          </Button>
          <Separator className="h-[18px] w-[1px] bg-neutral-100" />
          <Button
            variant="ghost"
            className={cn('p-2 hover:bg-neutral-25')}
            onClick={() => applyStyle('formatBlock', 'blockquote')}
          >
            <FormatQuoteIcon />
          </Button>
          <Dialog open={openLinkModal} onOpenChange={setOpenLinkModal}>
            <DialogTrigger asChild>
              <Button variant="ghost" className={cn('p-2 hover:bg-neutral-25')}>
                <FormatAddLinkIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="pt-[50px] w-[400px] flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
              </DialogHeader>
              <Input
                type="url"
                placeholder="Enter link"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              <Button variant="secondary" className="w-full" onClick={setLink}>
                Apply
              </Button>
            </DialogContent>
          </Dialog>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn('p-2 hover:bg-neutral-25')}
                >
                  <FormatImageIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <PopoverItem>
                  <FileUpload setFile={setUploadSrc}>
                    Upload from computer
                  </FileUpload>
                </PopoverItem>
                <PopoverItem onClick={() => setOpenImageModal(true)}>
                  By URL
                </PopoverItem>
              </PopoverContent>
            </Popover>

            <Dialog open={openImageModal} onOpenChange={setOpenImageModal}>
              <DialogTrigger></DialogTrigger>
              <DialogContent className="pt-[50px] w-[400px] flex flex-col gap-4">
                <DialogHeader>
                  <DialogTitle>Insert Image</DialogTitle>
                </DialogHeader>
                <Input
                  type="url"
                  placeholder="Enter image url"
                  value={src}
                  onChange={e => setSrc(e.target.value)}
                />
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={insertImageViaUrl}
                >
                  Insert image
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="w-full h-[calc(100%-72px)] overflow-auto hide-scroll pb-6">
        <div className="min-h-full bg-periwinkle-100 border-b border-x border-neutral-50 rounded-b-xl py-[34px] px-[58px]">
          <div className="bg-white rounded-3xl overflow-hidden border border-periwinkle-400 shadow-xl">
            <div className="w-full h-[72px] border-b border-neutral-50 bg-periwinkle-25 flex items-center justify-center">
              <input
                type="text"
                placeholder="Untitled document"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="font-bold text-xl leading-8 placeholder:text-neutral-300 text-neutral-600 text-center bg-transparent outline-none"
              />
            </div>
            <div
              id="editor"
              tabIndex={0}
              className="editor w-full min-h-screen p-10 outline-none"
              ref={editorRef}
              contentEditable
              onInput={handleInput}
            />
          </div>
        </div>
      </div>
    </>
  );
}
