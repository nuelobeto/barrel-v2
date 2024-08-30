export interface IObject {
  id: string;
  object_name: string;
  category: string;
  api_name: string;
  type: string;
  last_modified: string | null;
  modified_at: string | null;
}

export interface IField {
  id: string;
  field_name: string;
  field_description: string;
  section: string;
  data_type: string;
  type: string;
}
