import apiClient from '@/config/axiosInstance';
import {
  BusinessApiResponse,
  JobTitleDepartmentApiResponse,
  JobTitlesDepartmentsApiResponse,
  UpdateBusinessType,
} from '@/types/business';

const getBusiness = async (): Promise<BusinessApiResponse> => {
  const response = await apiClient.get<BusinessApiResponse>('/businesses');
  localStorage.setItem('business', JSON.stringify(response.data.data));
  return response.data;
};

const updateBusiness = async (
  payload: UpdateBusinessType,
  business_id: string,
) => {
  const response = await apiClient.patch(`/businesses/${business_id}`, payload);
  localStorage.setItem('business', JSON.stringify(response.data.data));
  return response.data;
};

const createJobTitleDepartments = async ({
  name,
  type,
}: {
  name: string;
  type: string;
}): Promise<JobTitleDepartmentApiResponse> => {
  const response = await apiClient.post<JobTitleDepartmentApiResponse>(
    '/businesses/job-title-departments',
    {
      name,
      type,
    },
  );
  return response.data;
};

const getJobTitles = async (): Promise<JobTitlesDepartmentsApiResponse> => {
  const response = await apiClient.get<JobTitlesDepartmentsApiResponse>(
    '/businesses/job-titles',
  );
  return response.data;
};

const getDepartments = async (): Promise<JobTitlesDepartmentsApiResponse> => {
  const response = await apiClient.get<JobTitlesDepartmentsApiResponse>(
    '/businesses/departments',
  );
  return response.data;
};

const businessServices = {
  getBusiness,
  updateBusiness,
  createJobTitleDepartments,
  getJobTitles,
  getDepartments,
};

export default businessServices;
