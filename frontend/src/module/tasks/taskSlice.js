import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    getTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    getTasksSuccess: (state, action) => {
      state.loading = false;

      state.tasks = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.pages = action.payload.pages;

      state.error = null;
    },

    getTasksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createTaskStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    createTaskSuccess: (state, action) => {
      state.loading = false;

      state.tasks.unshift(action.payload);
      state.total += 1;

      state.error = null;
    },

    createTaskFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateTaskSuccess: (state, action) => {
      const updatedTask = action.payload;

      const index = state.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );

      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },

    deleteTaskSuccess: (state, action) => {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );

      state.total -= 1;
    },

    clearTaskError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getTasksStart,
  getTasksSuccess,
  getTasksFailure,
  createTaskStart,
  createTaskSuccess,
  createTaskFailure,
  updateTaskSuccess,
  deleteTaskSuccess,
  clearTaskError,
} = taskSlice.actions;

export default taskSlice.reducer;