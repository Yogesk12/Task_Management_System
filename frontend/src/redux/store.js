import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../module/auth/authSlice";
import projectReducer from "../module/projects/projectSlice.js";
import taskReducer from "../module/tasks/taskSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
  },
});