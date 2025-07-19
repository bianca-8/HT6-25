import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev-rb7h2zv1l2rb2ysz.us.auth0.com";
const clientId = "03mm5T3PAz4NEprAmQTPYXGTeNx891Io";

const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: 'http://localhost:3000' }} // authorizationParams={{ redirect_uri: window.location.origin }}
    onRedirectCallback={onRedirectCallback}
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    <App />
  </Auth0Provider>
);
