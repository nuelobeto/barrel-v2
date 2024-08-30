import {signInWithPopup, GoogleAuthProvider, signOut} from 'firebase/auth';
import {
  LoginType,
  ActivateAccountType,
  CreatePasswordType,
  UpdateProfileType,
  ForgotPasswordType,
  ResetPasswordType,
} from '@/types/auth';
import apiClient from '@/config/axiosInstance';
import {auth} from '@/config/firebase';

const login = async (payload: LoginType) => {
  const response = await apiClient.post('/auth/login', payload);
  localStorage.setItem('token', JSON.stringify(response.data.data.token));
  localStorage.setItem('user', JSON.stringify(response.data.data.user));

  return response.data;
};

const activateAccount = async (payload: ActivateAccountType) => {
  const response = await apiClient.post('/users/accept-invite', payload);
  localStorage.setItem('verificationToken', JSON.stringify(response.data.data));
  return response.data;
};

const createPassword = async (payload: CreatePasswordType) => {
  const headers = {
    'verification-code': payload.verificationToken,
  };
  const response = await apiClient.put('/users/create-password', payload, {
    headers,
  });
  localStorage.removeItem('verificationToken');
  localStorage.setItem('token', JSON.stringify(response.data.data.token));
  localStorage.setItem('user', JSON.stringify(response.data.data.user));

  return response.data;
};

const updateProfile = async (payload: UpdateProfileType) => {
  const response = await apiClient.put('/users', payload);
  localStorage.setItem('token', JSON.stringify(response.data.data.token));
  localStorage.setItem('user', JSON.stringify(response.data.data.user));
  return response.data;
};

const googleAuth = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const email = user.email;

  const response = await apiClient.get(`auth/google/${email}`);
  localStorage.setItem('token', JSON.stringify(response.data.data.token));
  localStorage.setItem('user', JSON.stringify(response.data.data.user));

  return response.data;
};

const forgotPassword = async (payload: ForgotPasswordType) => {
  const response = await apiClient.post('/auth/forget-password', payload);
  return response.data;
};

const resetPassword = async (payload: ResetPasswordType) => {
  const headers = {
    'hash-id-key': payload.hash_id,
  };
  const response = await apiClient.patch('/auth/reset-password', payload, {
    headers,
  });
  return response.data;
};

const updateLastLogin = async () => {
  await apiClient.patch('/users/last-login', {});
};

const logout = () => {
  signOut(auth)
    .then(() => {
      localStorage.clear();
      console.log('signed out');
    })
    .catch(error => {
      console.log(error);
    });
};

const authServices = {
  login,
  activateAccount,
  createPassword,
  updateProfile,
  googleAuth,
  forgotPassword,
  resetPassword,
  updateLastLogin,
  logout,
};

export default authServices;
