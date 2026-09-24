import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProtectedRoute from "./components/protectedRoute";
import Register from "./pages/Register/register.jsx";
import Login from "./pages/login/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ProjectDetail from "./pages/projectDetails/ProjectDetails.jsx";


import { getCurrentUser } from "./module/auth/authApi.js";

import {
  getUserStart,
  getUserSuccess,
  getUserFailure,
} from "./module/auth/authSlice.js";

import { removeToken } from "./utils/authStorage.js";

function AuthBootstrap() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token || user) {
        return;
      }

      dispatch(getUserStart());

      try {
        const currentUser = await getCurrentUser(token);

        dispatch(getUserSuccess(currentUser));
      } catch (error) {
        removeToken();

        dispatch(
          getUserFailure("Your session has expired.")
        );
      }
    };

    restoreSession();
  }, [token, user, dispatch]);

  return null;
}


function App() {
  return (
    <BrowserRouter>

      <AuthBootstrap />

      <Routes>
        <Route
          path="/"
          element={<Login/>}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/projects/:projectId"
            element={<ProjectDetail />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;