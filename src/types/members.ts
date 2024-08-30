import {BadgeVariant} from '@/components/ui/badge';

interface Pagination {
  page: string;
  totalPages: number;
  totalEntriesSize: number;
  perPage: string;
}

export interface InviteMemberType {
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
  manager?: string | null;
}

export interface MembersApiResponse {
  data: {
    result: MemberType[];
    paginate: Pagination;
  };
}

export interface InviteDetailsType {
  inviteeEmail: string;
  inviterInfo: {
    name: string;
    email: string;
    avatar: string | null;
    BusinessName: string;
  };
}

export interface MemberType {
  id: string;
  manager?: string | null;
  status: string;
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    avatar: string | null;
    email: string;
    last_login: string;
  };
  role: string;
}

export interface UpdateMemberType {
  manager?: string | null;
  first_name?: string;
  last_name?: string;
  email?: string;
  user_name?: string;
  role_id?: string;
}

export interface UpdateMemberStatusType {
  status: string;
}

export interface EmployeeApiResponse {
  message: string;
  status: string;
  statusCode: number;
  data: IEmployee;
}

export interface IEmployee {
  business_id: string;
  status: BadgeVariant;
  manager: string | null;
  created_at: string;
  personal_info: {
    employee_id: string;
    dob: string | null;
    gender: string | null;
    marital_status: string | null;
    personal_email: string | null;
    nationality: string | null;
    middle_name: string | null;
    user_id: string;
    first_name: string;
    last_name: string;
    user_name: string | null;
    avatar: string | null;
    country: string | null;
  };
  contact_info: {
    email: string;
    phone_number: string | null;
    emergency_contact_name: string | null;
    emergency_contact_relationship: string | null;
    emergency_contact_phone_number: string | null;
    current_address: string | null;
    permanent_address: string | null;
  };
  work_exp: {
    previous_job_titles: null;
    previous_employers: null;
    employment_dates: null;
    job_responsibilities: null;
  };
  employment_details: {
    job_title: string | null;
    department: string | null;
    employment_type: string | null;
    employee_status: string | null;
    date_of_hire: string | null; // ISO date string (YYYY-MM-DD)
    date_of_termination: string | null;
    manager: string | null;
    work_location: string | null;
  };
  education_cert: {
    highest_degree_obtained: string | null;
    field_of_study: string | null;
    institution_name: string | null;
    graduation_year: string | null;
    certification: string | null;
  };
  compensations: {
    id: string | null;
    salary_grade: string | null;
    base_salary: string | null;
    net_salary: string | null;
    bonus: string | null;
    commission: string | null;
    pay_frequency: string | null;
    bank_name: string | null;
    bank_account_name: string | null;
    account_number: string | null;
    swift_code: string | null;
    sort_code: string | null;
    tax_amount: string | null;
  };
  role: string | null;
}

export interface IUpdateEmployeePersonalInfo {
  member_id: string;
  employee_id: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string | null;
  dob?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  nationality?: string | null;
  country?: string | null;
}

export interface IUpdateEmployeeContact {
  member_id: string;
  email?: string;
  phone_number?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_relationship?: string | null;
  emergency_contact_phone_number?: string | null;
  current_address?: string | null;
  permanent_address?: string | null;
}

export interface IUpdateEmployeeWorkExp {
  member_id: string;
  previous_job_titles?: string | null;
  previous_employers?: string | null;
  employment_dates?: string | null;
  job_responsibilities?: string | null;
}

export interface IupdateEmployeeEmploymentDetails {
  member_id: string;
  job_title?: string | null;
  department?: string | null;
  employment_type?: string | null;
  employee_status?: string | null;
  date_of_hire?: string | null;
  date_of_termination?: string | null;
  manager?: string | null;
  work_location?: string | null;
}

export interface IUpdateEmployeeEducationCert {
  member_id: string;
  highest_degree_obtained?: string | null;
  field_of_study?: string | null;
  institution_name?: string | null;
  graduation_year?: string | null;
  certification?: string | null;
}

export interface IApp {
  id: string;
  app: string;
  icon: string;
  version: string;
  date_installed: string;
  managed_by: string;
  status: BadgeVariant;
}

export interface IPayslip {
  id: string;
  month: string;
  date: string;
}

export interface Manager {
  id: string;
  name: string;
  avatar: string | null;
}

export interface GetMembersParams {
  businessId: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    job_title?: string;
    status?: string;
    manager?: string;
  };
}
