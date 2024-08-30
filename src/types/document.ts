import {ReactElement} from 'react';

export interface DroppedItem {
  id: string;
  x: number;
  y: number;
  pageNumber: number;
  text?: string;
  checked?: boolean;
}

export interface DraggableItem {
  id: string;
  label: string;
  component: ReactElement;
  exampleInfo: ReactElement;
}

export interface ImageDimensions {
  [key: number]: {
    width: number;
    height: number;
  };
}

export interface IDocument {
  id: string;
  title: string;
  status: 'draft' | 'published';
  content: {
    page: number;
    imageUrl: string;
    components: DroppedItem[];
  }[];
  updatedAt: string | null;
}

export interface DocumentApiResponse {
  data: IDocument | null;
  error: string | null;
}

export interface DocumentsApiResponse {
  data: IDocument[];
  error: string | null;
}

export interface IEmployeeDocument {
  id: string;
  title: string;
  status: string;
  created_by: string;
}
