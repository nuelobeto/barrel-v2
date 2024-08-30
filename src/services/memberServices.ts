import qs from 'qs';
import apiClient from '@/config/axiosInstance';
import {
  InviteMemberType,
  UpdateMemberType,
  UpdateMemberStatusType,
  IUpdateEmployeePersonalInfo,
  IUpdateEmployeeContact,
  IUpdateEmployeeWorkExp,
  IUpdateEmployeeEducationCert,
  MembersApiResponse,
  EmployeeApiResponse,
  GetMembersParams,
} from '@/types/members';

const getMembers = async ({
  businessId,
  page,
  limit,
  search,
  filters = {},
}: GetMembersParams): Promise<MembersApiResponse> => {
  const queryString = qs.stringify(
    {
      page,
      limit,
      search,
      ...filters,
    },
    {
      filter: (_, value) => value || undefined, // remove empty values
    },
  );
  const response = await apiClient.get<MembersApiResponse>(
    `businesses/members/${businessId}?${queryString}`,
  );
  return response.data;
};

const inviteMembers = async (payload: InviteMemberType[]) => {
  const response = await apiClient.post('invite/members', payload);
  return response.data;
};

const bulkInviteMembers = async (payload: InviteMemberType[]) => {
  const response = await apiClient.post('bulk-invite', payload);
  return response.data;
};

const resendInvite = async (payload: InviteMemberType) => {
  const response = await apiClient.post('users/resend-invite', payload);
  return response.data;
};

const getInviteDetails = async (token: string) => {
  const response = await apiClient.get(`users/invite/${token}`);
  return response.data;
};

const acceptInvite = async (token: string) => {
  const response = await apiClient.get(`users/accept-member/${token}`);
  localStorage.setItem('verificationToken', JSON.stringify(response.data.data));
  return response.data;
};

const getEmployee = async (member_id: string): Promise<EmployeeApiResponse> => {
  const response = await apiClient.get<EmployeeApiResponse>(
    `businesses/members/details/${member_id}`,
  );
  return response.data;
};

const updateEmployeePersonal = async (payload: IUpdateEmployeePersonalInfo) => {
  const response = await apiClient.put(`businesses/members/personal`, payload);
  return response.data;
};

const updateEmployeeContact = async (payload: IUpdateEmployeeContact) => {
  const response = await apiClient.put(`businesses/members/contact`, payload);
  return response.data;
};

const updateEmployeeWorkExp = async (payload: IUpdateEmployeeWorkExp) => {
  const response = await apiClient.put(
    `businesses/members/work-experience`,
    payload,
  );
  return response.data;
};

const updateEmploymentDetails = async (payload: IUpdateEmployeeWorkExp) => {
  const response = await apiClient.put(
    `businesses/members/employment-details`,
    payload,
  );
  return response.data;
};

const updateEmployeeEducationCert = async (
  payload: IUpdateEmployeeEducationCert,
) => {
  const response = await apiClient.put(
    `businesses/members/educational-cert`,
    payload,
  );
  return response.data;
};

const updateEmployeeCompensations = async (
  payload: IUpdateEmployeeEducationCert,
) => {
  const response = await apiClient.put(
    `businesses/members/compensations`,
    payload,
  );
  return response.data;
};

const updateMember = async (payload: UpdateMemberType, memberId: string) => {
  const response = await apiClient.patch(
    `businesses/members/${memberId}`,
    payload,
  );
  return response.data;
};

const updateMemberStatus = async (
  payload: UpdateMemberStatusType,
  memberId: string,
) => {
  const response = await apiClient.patch(
    `businesses/members/status/${memberId}`,
    payload,
  );
  return response.data;
};

const deleteMember = async (userId: string) => {
  const response = await apiClient.delete(`users/${userId}`);
  return response.data;
};

const memberServices = {
  getMembers,
  inviteMembers,
  resendInvite,
  getInviteDetails,
  acceptInvite,
  getEmployee,
  updateEmployeePersonal,
  updateEmployeeContact,
  updateEmployeeWorkExp,
  updateEmployeeEducationCert,
  updateMember,
  updateMemberStatus,
  deleteMember,
  updateEmploymentDetails,
  updateEmployeeCompensations,
  bulkInviteMembers,
};

export default memberServices;
