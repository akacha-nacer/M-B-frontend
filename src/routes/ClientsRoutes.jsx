import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ClientDetailPage from "../views/Clients/ClientdetailPage";

const ClientsPage = Loadable(lazy(() => import('views/clients/ClientsPage')));

// ==============================|| CLIENTS ROUTING ||============================== //

const ClientsRoutes = {
    path: '/clients',
    element: <DashboardLayout />,
    children: [
        {
            index: true,
            element: <ClientsPage />
        },
        {
            path: ':id',
            element: <ClientDetailPage />
        }
    ]
};

export default ClientsRoutes;