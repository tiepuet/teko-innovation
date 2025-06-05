import { ConfigProvider } from 'antd';
import { useAuth } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366F1',
          colorSuccess: '#10B981',
          colorWarning: '#F59E0B',
          colorError: '#EF4444',
          colorInfo: '#0EA5E9',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;