import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import FloatingLogo from './components/FloatingLogo';
import publicRoutes from './routes/PublicRoutes';
import userRoutes from './routes/UserRoutes';
import adminRoutes from './routes/AdminRoutes';

const AppRoutes = () => {
  const routing = useRoutes([
    ...publicRoutes,
    ...userRoutes,
    ...adminRoutes,
  ]);
  return routing;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#0a100d', color: '#00ff88', border: '1px solid #10b981' }
          }}
        />
        <FloatingLogo />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
