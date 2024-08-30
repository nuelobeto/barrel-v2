export type FileType = {
  name: string;
  format: string;
  url: string;
};

export type FilterType = {
  label: string;
  critria: FilterOption[];
  setCriteria: React.Dispatch<React.SetStateAction<FilterOption[]>>;
  filterOptions: FilterOption[];
};

export type ViewType = 'list' | 'grid';

export type BadgeVariant =
  | 'active'
  | 'on leave'
  | 'pending'
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
