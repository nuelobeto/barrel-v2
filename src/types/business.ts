export interface BusinessApiResponse {
  data: BusinessType;
  message: string;
  status: string;
  statusCode: number;
}

export interface BusinessType {
  id: string;
  name: string;
  description: string | null;
  domain: string;
  industry: null;
  country: string;
  status: string;
  support_email: string;
  logo: string;
}

export interface UpdateBusinessType {
  logo: string;
  name: string;
}

export interface JobTitleDepartment {
  id: string;
  business_id: string;
  name: string;
}

export interface JobTitleDepartmentApiResponse {
  data: JobTitleDepartment;
  message: string;
  status: string;
  statusCode: number;
}

export interface JobTitlesDepartmentsApiResponse {
  data: JobTitleDepartment[];
  message: string;
  status: string;
  statusCode: number;
}
