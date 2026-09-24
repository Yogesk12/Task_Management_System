import api from "../../services/api";

export const getTasks = async (
  token,
  projectId,
  params = {}
) => {
  const response = await api.get(
    `/projects/${projectId}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data;
};

export const createTask = async (
  token,
  projectId,
  taskData
) => {
  const response = await api.post(
    `/projects/${projectId}/tasks`,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateTask = async (
  token,
  taskId,
  taskData
) => {
  const response = await api.put(
    `/tasks/${taskId}`,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteTask = async (
  token,
  taskId
) => {
  await api.delete(`/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};