import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthLayout from 'layout/Auth';

// render - login pages
const LoginPage = Loadable(lazy(() => import('views/auth/login/Login')));

// ==============================|| AUTH PAGES ROUTING ||============================== //

const LoginRoutes = {
    path: '/login',
    element: <LoginPage />
};

export default LoginRoutes;
