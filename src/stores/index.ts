import React from 'react';

import auth, { Auth } from './modules/auth';

export type RootStore = {
  auth: Auth;
};

export const store: RootStore = {
  auth
};

const StoreContext = React.createContext<RootStore>(store);

export const StoreProvider = StoreContext.Provider;

export const useStore = () => React.useContext(StoreContext);

export { auth };
