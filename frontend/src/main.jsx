import { createRoot } from 'react-dom/client';

import './index.css';

import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';

import MainPage from './pages/Main';
import LoginPage from './pages/Login';
import RegistrationPage from './pages/Registration';

import { store } from './store';
import { selectIsAuthenticated } from './store/user';

// eslint-disable-next-line react/prop-types
const RequireAuth = ({ children }) => {
  const auth = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!auth) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth>
              <MainPage />
            </RequireAuth>
          }
        />
        <Route
          path='/chat/:id'
          element={
            <RequireAuth>
              <MainPage />
            </RequireAuth>
          }
        />
        <Route
          path='/chat/new'
          element={
            <RequireAuth>
              <MainPage newChat />
            </RequireAuth>
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/registration' element={<RegistrationPage />} />
      </Routes>
    </Router>
  </Provider>
);
