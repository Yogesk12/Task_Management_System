import api from "../../services/api";

export const getProjects = async (token) => {
  const response = await api.get("/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createProject = async (token, projectData) => {
  const response = await api.post("/projects", projectData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProject = async (token, projectId, projectData) => {
  const response = await api.put(
    `/projects/${projectId}`,
    projectData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteProject = async (token, projectId) => {
  await api.delete(`/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};