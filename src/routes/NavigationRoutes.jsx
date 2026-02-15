import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - dashboard pages
const DefaultPages = Loadable(lazy(() => import('views/navigation/dashboard/Default')));

// ==============================|| NAVIGATION ROUTING ||============================== //

const NavigationRoutes = {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <DefaultPages />
        }
      ]
};

export default NavigationRoutes;
