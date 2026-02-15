import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthLayout from 'layout/Auth';

const LoginPage = Loadable(lazy(() => import('views/auth/login/Login')));

const RegisterPage = Loadable(lazy(() => import('views/auth/register/Register')));

const ForgotPasswordPage = Loadable(lazy(()=> import ('views/auth/forgotPassword/ForgotPassword')))

// ==============================|| AUTH PAGES ROUTING ||============================== //

const PagesRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />
        },
        {
          path: 'register',
          element: <RegisterPage />
        },
        {
          path: 'forgotPassword',
          element: <ForgotPasswordPage />
        }
      ]
    }
  ]
};

export default PagesRoutes;
