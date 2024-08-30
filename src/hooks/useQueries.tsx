import {useQuery} from '@tanstack/react-query';
import businessServices from '@/services/businessServices';
import memberServices from '@/services/memberServices';
import roleServices from '@/services/roleServices';
import {GetMembersParams} from '@/types/members';

const savedToken: string | null = localStorage.getItem('token');
const token: string | null = savedToken ? JSON.parse(savedToken) : null;

export function useFetchBusiness() {
  return useQuery({
    queryKey: ['business'],
    queryFn: () => businessServices.getBusiness(),
    enabled: !!token,
  });
}

export function useFetchMembers({
  businessId = '',
  page = 1,
  limit = 10,
  search = '',
  filters = {},
}: GetMembersParams) {
  return useQuery({
    queryKey: ['members', businessId, page, limit, search, filters],
    queryFn: () =>
      memberServices.getMembers({businessId, page, limit, search, filters}),
    enabled: !!businessId,
  });
}

export function useFetchEmployee(employeeId: string) {
  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => memberServices.getEmployee(employeeId),
    enabled: !!employeeId,
  });
}

export function useFetchJobTitles() {
  return useQuery({
    queryKey: ['jobTitles'],
    queryFn: businessServices.getJobTitles,
  });
}

export function useFetchRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => roleServices.getRoles(),
  });
}
