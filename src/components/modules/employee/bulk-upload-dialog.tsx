/* eslint-disable @typescript-eslint/no-explicit-any */
import {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {FileRejection, useDropzone} from 'react-dropzone';
import {v4 as uuidv4} from 'uuid';
import {toast} from 'react-hot-toast';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Text} from '@/components/ui/typography';
import {Progress} from '@/components/ui/progress';
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
import {ScrollArea} from '@/components/ui/scroll-area';
import {formatSize, MAX_FILE_SIZE} from '@/helpers';
import Papa from 'papaparse';
import {InviteMemberType} from '@/types/members';
import memberServices from '@/services/memberServices';
import {ErrorResponse} from '@/types/error';

const getRandomIncrement = () => Math.floor(Math.random() * 30) + 20; // Random number between 20 and 50

interface FileWithMeta {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed';
  uploadedSize: number;
}

export default function BulkUploadTriggerAction({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newMembers, setNewMembers] = useState<InviteMemberType[]>([]);
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, {progress: number; uploadedSize: number}>
  >({});
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, 'uploading' | 'completed'>
  >({});

  // Calculate available height for the scroll area
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateAvailableHeight = () => {
      if (sheetContentRef.current) {
        const totalHeight = window.innerHeight;
        const sheetContentHeight = sheetContentRef.current.offsetTop;
        const calculatedHeight =
          totalHeight - sheetContentHeight - 77 - 57 - 16; // 77px for header, 57px for footer, 16px for padding
        setAvailableHeight(calculatedHeight);
      }
    };

    files.length && updateAvailableHeight();
    window.addEventListener('resize', updateAvailableHeight);

    return () => {
      window.removeEventListener('resize', updateAvailableHeight);
    };
  }, [files.length]);

  const {mutate, status} = useMutation({
    mutationFn: (payload: any[]) => memberServices.bulkInviteMembers(payload),
    onSuccess: () => {
      toast.success('Invitations sent successfully');
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['members'],
      });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data.message || 'Failed to send invitation');
    },
  });

  const inviteEmployees = () => {
    const payload = newMembers.map(m => {
      return {
        email: m.email,
        first_name: m.first_name,
        last_name: m.last_name,
      };
    });

    mutate(payload);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const newFiles: FileWithMeta[] = acceptedFiles.map(file => ({
        id: uuidv4(),
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploadedSize: 0,
        status: 'uploading',
      }));

      setFiles(prevFiles => [...newFiles, ...prevFiles]);

      let accumulatedData: InviteMemberType[] = [];

      const parsePromises = acceptedFiles.map(file => {
        if (file.type === 'text/csv') {
          return new Promise<InviteMemberType[]>((resolve, reject) => {
            Papa.parse(file, {
              header: true,
              complete: result => {
                const data = result.data as InviteMemberType[];
                resolve(data);
              },
              error: error => {
                toast.error(`Error parsing ${file.name}: ${error.message}`);
                reject(error);
              },
            });
          });
        }
        return Promise.resolve([]);
      });

      Promise.all(parsePromises)
        .then(results => {
          results.forEach(result => {
            accumulatedData = [...accumulatedData, ...result];
          });
          setNewMembers(prevMembers => [...prevMembers, ...accumulatedData]);
        })
        .catch(error => {
          console.error('Error parsing files:', error);
        });

      fileRejections.forEach(({file, errors}) => {
        errors.forEach(error => {
          toast.error(`${file.name}: ${error.message}`);
        });
      });

      // Simulate file upload
      newFiles.forEach(file => {
        const uploadFile = (f: FileWithMeta) => {
          const interval = setInterval(() => {
            setUploadProgress(prevProgress => {
              const newProgress = {...prevProgress};
              const increment = getRandomIncrement();
              const newUploadedSize = Math.min(
                (newProgress[f.id]?.uploadedSize || 0) +
                  (f.size * increment) / 100,
                f.size,
              );
              const newProgressValue = Math.min(
                (newProgress[f.id]?.progress || 0) + increment,
                100,
              );

              newProgress[f.id] = {
                progress: newProgressValue,
                uploadedSize: newUploadedSize,
              };

              if (newProgressValue >= 100) {
                clearInterval(interval);
                setUploadStatus(prevStatus => ({
                  ...prevStatus,
                  [f.id]: 'completed',
                }));
              }

              return newProgress;
            });
          }, 500);
        };

        uploadFile(file);
      });
    },
    [],
  );

  const memoizedOnDrop = useMemo(() => onDrop, [onDrop]);
  const {
    getRootProps,
    getInputProps,
    open: openDropzone,
  } = useDropzone({
    onDrop: memoizedOnDrop,
    accept: {'text/csv': ['.csv']},
    noClick: true,
    noKeyboard: true,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="h-auto m-6">
        <SheetHeader className="border-b border-neutral-25 -mx-6 px-6 pb-6">
          <SheetTitle>Bulk Upload</SheetTitle>
          <SheetDescription className="mt-2.5">
            To make life easier for you, click to{' '}
            <a
              href="https://docs.google.com/spreadsheets/d/1j1TxzvXjCtWY8exERUbsZl5csFQOIKR7mKsn3STQ3q0/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
              download="Bulk Upload Template"
              className="text-purple-400 font-medium underline"
            >
              download a template
            </a>{' '}
            fill your employee data and upload below.
          </SheetDescription>
        </SheetHeader>
        <div className="grow flex flex-col">
          <div
            {...getRootProps()}
            className="bg-periwinkle-25 border-2 border-periwinkle-400 border-dashed rounded-xl py-5 flex items-center justify-center"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center w-full max-w-[266px]">
              <div className="bg-[url('/images/file-art.svg')] bg-no-repeat bg-cover bg-center py-10 w-full flex justify-center">
                <img
                  src="/images/large-file.svg"
                  alt=""
                  width={102}
                  height={102}
                />
              </div>
              <Text
                variant="body6"
                className="mt-2 text-purple-400 font-medium"
              >
                Click a file or drag & drop it here.
              </Text>
              <Text variant="body6" className="mt-1.5 text-neutral-300">
                or drag and drop your CSV File (5 MB Max)
              </Text>
              <Button
                onClick={openDropzone}
                className="mt-4 bg-white border border-neutral-50 text-xs text-neutral-600 hover:bg-neutral-25 active:bg-neutral-50"
              >
                Browse File
              </Button>
            </div>
          </div>

          <div className="mt-5 grow flex flex-col h-full">
            <Text className="font-semibold text-neutral-600">Uploads</Text>

            {files.length === 0 && (
              <div className="grow flex items-center justify-center">
                <Text
                  variant="body2"
                  className="font-semibold text-neutral-600 text-center"
                >
                  No file uploaded yet
                </Text>
              </div>
            )}
            {files.length ? (
              <ScrollArea
                ref={sheetContentRef}
                className="mt-3.5"
                style={{maxHeight: availableHeight as number}}
              >
                <div className="flex flex-col gap-4">
                  {files.map(file => {
                    const {progress, uploadedSize} = uploadProgress[
                      file.id
                    ] || {
                      progress: 0,
                      uploadedSize: 0,
                    };
                    const status = uploadStatus[file.id] || 'uploading';
                    const isCompleted = status === 'completed';

                    return (
                      <div
                        key={file.id}
                        className="p-4 border-[1.5px] border-periwinkle-100 rounded-xl flex items-start gap-3.5"
                      >
                        <img
                          src="/images/uploads.svg"
                          alt="file"
                          width={40}
                          height={40}
                        />
                        <div className="flex items-start w-full">
                          <div className="flex flex-col gap-1 grow">
                            <span className="text-neutral-600 font-medium">
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Text className="text-neutral-400">
                                {formatSize(uploadedSize)} of{' '}
                                {formatSize(file.size)}
                              </Text>
                              <Text element="span" className="text-neutral-400">
                                ·
                              </Text>
                              <Text
                                element="span"
                                className="text-periwinkle-800 flex items-center gap-1"
                              >
                                <img
                                  src={
                                    isCompleted
                                      ? '/images/completed.svg'
                                      : '/images/spinner.svg'
                                  }
                                  alt={isCompleted ? 'completed' : 'loading'}
                                  width={16}
                                  height={16}
                                  className={isCompleted ? '' : 'animate-spin'}
                                />
                                {isCompleted ? 'Completed' : 'Uploading...'}
                              </Text>
                            </div>
                            {progress !== 100 ? (
                              <div className="flex items-center gap-3">
                                <Progress value={progress} className="h-2" />
                                <Text className="text-neutral-600">
                                  {progress}%
                                </Text>
                              </div>
                            ) : null}
                          </div>
                          <button
                            className="p-0 w-5 h-5"
                            onClick={() =>
                              setFiles(prevFiles =>
                                prevFiles.filter(f => f.id !== file.id),
                              )
                            }
                          >
                            <img
                              src="/images/close-grey.svg"
                              alt="close"
                              width={20}
                              height={20}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : null}
          </div>
        </div>
        <SheetFooter className="mt-auto flex items-center justify-center border-t border-neutral-25 -mx-6 px-6 pt-4">
          <SheetClose asChild>
            <Button variant="secondary">Cancel</Button>
          </SheetClose>
          <Button
            type="submit"
            disabled={files.length === 0 || status === 'pending'}
            onClick={inviteEmployees}
          >
            <img src="/images/check.svg" alt="" width={20} height={20} />
            Add employee(s)
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
