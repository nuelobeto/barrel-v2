import {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {ROUTES} from './routes';

const ProtectedRoutes = () => {
  const savedToken: string | null = localStorage.getItem('token');
  const token: string | null = savedToken ? JSON.parse(savedToken) : null;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.login);
    }
  }, [token, navigate]);

  return <Outlet />;
};

export default ProtectedRoutes;
