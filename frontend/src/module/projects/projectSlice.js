import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",

  initialState,

  reducers: {
    getProjectsStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    getProjectsSuccess: (state, action) => {
      state.loading = false;
      state.projects = action.payload;
      state.error = null;
    },

    getProjectsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createProjectStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    createProjectSuccess: (state, action) => {
      state.loading = false;

      state.projects.unshift(action.payload);

      state.error = null;
    },

    createProjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateProjectSuccess: (state, action) => {
      const updatedProject = action.payload;

      const index = state.projects.findIndex(
        (project) => project.id === updatedProject.id
      );

      if (index !== -1) {
        state.projects[index] = updatedProject;
      }
    },

    deleteProjectSuccess: (state, action) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },

    clearProjectError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getProjectsStart,
  getProjectsSuccess,
  getProjectsFailure,

  createProjectStart,
  createProjectSuccess,
  createProjectFailure,

  updateProjectSuccess,
  deleteProjectSuccess,

  clearProjectError,
} = projectSlice.actions;

export default projectSlice.reducer;