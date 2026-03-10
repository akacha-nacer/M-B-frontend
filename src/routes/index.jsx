import {createBrowserRouter, Navigate} from 'react-router-dom';

// project-imports
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import FormsRoutes from './FormsRoutes';
import TablesRoutes from './TablesRoutes';
import ChartMapRoutes from './ChartMapRoutes';
import OtherRoutes from './OtherRoutes';
import AuthRoutes from "./AuthRoutes";
import ClientsRoutes from "./ClientsRoutes";

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [{
      path: '/',
      element: <Navigate to={"/login"} replace />
  },
      PagesRoutes, NavigationRoutes, ComponentsRoutes, FormsRoutes, TablesRoutes, ChartMapRoutes, OtherRoutes, ClientsRoutes],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
