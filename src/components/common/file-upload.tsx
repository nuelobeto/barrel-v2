import {uploadToCloudinary} from '@/helpers';
import {FileType} from '@/types';

interface FileUploadProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<React.SetStateAction<FileType | null>>;
}

const FileUpload = ({
  children,
  setLoading,
  setFile,
  ...props
}: FileUploadProps) => {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLoading && setLoading(true);
    try {
      const file = event.target.files?.[0];
      const result = await uploadToCloudinary(file);
      setLoading && setLoading(false);
      setFile(result);
    } catch (error) {
      console.log();
      setLoading && setLoading(false);
    }
  };

  return (
    <div {...props}>
      <label htmlFor="file">{children}</label>
      <input
        type="file"
        id="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export {FileUpload};
