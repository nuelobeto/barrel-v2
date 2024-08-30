import apiClient from '@/config/axiosInstance';

const getRoles = async () => {
  const response = await apiClient.get('roles');
  return response.data;
};

const roleServices = {
  getRoles,
};

export default roleServices;
