import axios from 'axios';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const formatSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${bytes.toFixed(1)} B`;
  }
};

export const exportToCsv = (data: any[], fileName: string): void => {
  if (!data || !data.length) {
    console.error('No data provided');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // header row first
    ...data.map(row =>
      headers
        .map(header => {
          const cell = row[header] ?? ''; // handle null or undefined
          return `"${cell.toString().replace(/"/g, '""')}"`; // escape double quotes
        })
        .join(','),
    ),
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME || 'dmb7e4z6v';
const preset_key = import.meta.env.VITE_CLOUDINARY_PRESET_KEY || 'dut9pqqa';

export const uploadToCloudinary = async (file: File | undefined) => {
  const formData = new FormData();
  formData.append('file', file!);
  formData.append('upload_preset', preset_key);
  formData.append('folder', 'barrel');

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
    formData,
  );

  return {
    name: response.data.original_filename,
    format: response.data.format,
    url: response.data.secure_url,
  };
};

export function getImageDimensions(url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({width: img.width, height: img.height});
    img.onerror = reject;
    img.src = url;
  });
}
