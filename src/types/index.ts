export type FileType = {
  name: string;
  format: string;
  url: string;
};

export type FilterType = {
  label: string;
  critria: string[];
  setCriteria: React.Dispatch<React.SetStateAction<string[]>>;
  filterOptions: string[];
};

export type ViewType = 'list' | 'grid';

export type StatusType =
  | 'active'
  | 'on leave'
  | 'onboarding'
  | 'resigned'
  | 'off boarding'
  | 'dismissed'
  | 'allocated'
  | 'deprecated'
  | 'unallocated'
  | 'perfect'
  | 'compliant'
  | 'installed'
  | 'integrated'
  | 'updated to latest version'
  | 'downloading'
  | 'uninstalled';

export interface Option {
  value: string;
  label: string;
}

export interface FilterOption {
  id: string;
  name: string;
  avatar?: string | null;
}
