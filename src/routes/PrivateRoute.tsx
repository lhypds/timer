import { Outlet, Navigate, useLocation } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores';

const PrivateRoute = () => {
  const { auth } = useStore();
  const location = useLocation();
  if (auth.loggedIn) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

const ObserverPrivateRoute = observer(PrivateRoute);

export default ObserverPrivateRoute;
