import React, { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth';
import Profile from './pages/profile';
import Chat from './pages/chat';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { USER_INFO } from './utils/constants';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRouter = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setuserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getuserdata = async () => {
      try {
        const response = await apiClient.get(USER_INFO, {
          withCredentials: true,
        });
        //console.log({ response });


        if (response.status == 200 && response.data.id) {
          setuserInfo(response.data);
        } else {
          setuserInfo(undefined)
        }
        console.log({ response })
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false)
      }
    };

    if (!userInfo) {
      getuserdata();
    } else {
      setLoading(false);
    }
  }, [userInfo, setuserInfo]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRouter>
                <Auth />
              </AuthRouter>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>

        
      </BrowserRouter>
    </>
  );
};

export default App;
