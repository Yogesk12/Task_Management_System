import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./dashboard.module.css";

import Modal from "../../components/Modal/modal.jsx";

import { logout } from "../../module/auth/authSlice.js";

import {
  getProjectsStart,
  getProjectsSuccess,
  getProjectsFailure,
  createProjectStart,
  createProjectSuccess,
  createProjectFailure,
  updateProjectSuccess,
  deleteProjectSuccess,
} from "../../module/projects/projectSlice.js";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../module/projects/projectsApi.js";

import { removeToken } from "../../utils/authStorage.js";


function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(
    (state) => state.auth.token
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const {
    projects,
    loading,
    error,
  } = useSelector(
    (state) => state.projects
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [modalType, setModalType] = useState(null);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        return;
      }

      dispatch(getProjectsStart());

      try {
        const data = await getProjects(token);

        dispatch(
          getProjectsSuccess(data)
        );
      } catch (err) {
        const message =
          err.response?.data?.detail ||
          "Failed to load projects.";

        dispatch(
          getProjectsFailure(message)
        );
      }
    };

    fetchProjects();
  }, [token, dispatch]);


  const handleOpenCreateModal = () => {
    setTitle("");
    setDescription("");
    setSelectedProject(null);

    setModalType("create");
  };

  const handleOpenEditModal = (project) => {
    setSelectedProject(project);

    setTitle(project.title);

    setDescription(
      project.description || ""
    );

    setModalType("edit");
  };


  const handleOpenDeleteModal = (project) => {
    setSelectedProject(project);

    setModalType("delete");
  };

  const handleCloseModal = () => {
    if (loading || actionLoading) {
      return;
    }

    setTitle("");
    setDescription("");

    setSelectedProject(null);

    setModalType(null);
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    dispatch(createProjectStart());

    try {
      const project = await createProject(
        token,
        {
          title: title.trim(),
          description:
            description.trim() || null,
        }
      );

      dispatch(
        createProjectSuccess(project)
      );

      setTitle("");
      setDescription("");
      setSelectedProject(null);
      setModalType(null);

    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Failed to create project.";

      dispatch(
        createProjectFailure(message)
      );
    }
  };

  const handleEditProject = async (event) => {
    event.preventDefault();

    if (
      !selectedProject ||
      !title.trim()
    ) {
      return;
    }

    setActionLoading(true);

    try {
      const updatedProject =
        await updateProject(
          token,
          selectedProject.id,
          {
            title: title.trim(),
            description:
              description.trim() || null,
          }
        );

      dispatch(
        updateProjectSuccess(
          updatedProject
        )
      );

      setTitle("");
      setDescription("");
      setSelectedProject(null);
      setModalType(null);

    } catch (err) {
      console.error(
        "Failed to update project:",
        err
      );

    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) {
      return;
    }

    setActionLoading(true);

    try {
      await deleteProject(
        token,
        selectedProject.id
      );

      dispatch(
        deleteProjectSuccess(
          selectedProject.id
        )
      );

      setSelectedProject(null);
      setModalType(null);

    } catch (err) {
      console.error(
        "Failed to delete project:",
        err
      );

    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();

    dispatch(logout());

    navigate("/login");
  };

  return (
    <main className={styles.dashboard}>

      <header className={styles.header}>

        <div className={styles.headerContent}>

          <div>

            <span className={styles.eyebrow}>
              Task Management
            </span>

            <h1>
              Dashboard
            </h1>

            <p className={styles.welcome}>
              Welcome back,{" "}
              <strong>
                {user?.full_name || "User"}
              </strong>
            </p>

          </div>


          <div className={styles.headerActions}>

            <button
              type="button"
              className={`${styles.btn} ${styles.btnLogout}`}
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      <section className={styles.content}>

        <div className={styles.projectsSection}>

          <div className={styles.sectionHeader}>

            <div>

              <span className={styles.sectionLabel}>
                Workspace
              </span>

              <h2>
                Your Projects
              </h2>

              <p>
                Manage your projects and their tasks.
              </p>

            </div>


            <div className={styles.sectionActions}>

              <span className={styles.projectCount}>
                {projects.length}{" "}
                {projects.length === 1
                  ? "Project"
                  : "Projects"}
              </span>


              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={
                  handleOpenCreateModal
                }
              >
                + Create Project
              </button>

            </div>

          </div>

          {error && (
            <div
              className={styles.errorMessage}
            >
              {error}
            </div>
          )}

          {loading &&
            projects.length === 0 && (
              <div
                className={
                  styles.stateMessage
                }
              >
                Loading projects...
              </div>
            )}

          {!loading &&
            projects.length === 0 && (

              <div
                className={
                  styles.emptyState
                }
              >

                {/* <button
                  type="button"
                  className={
                    styles.emptyIcon
                  }
                  onClick={
                    handleOpenCreateModal
                  }
                  aria-label="Create project"
                >
                  +
                </button> */}


                <h3>
                  No projects yet
                </h3>


                <p>
                  Create your first project
                  to start managing tasks.
                </p>


                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={
                    handleOpenCreateModal
                  }
                >
                 + Create Your First Project
                </button>

              </div>

            )}

          {projects.length > 0 && (

            <div
              className={
                styles.projectGrid
              }
            >

              {projects.map(
                (project) => (

                  <article
                    key={project.id}
                    className={
                      styles.projectCard
                    }

                    
                  >


                    <div
                      className={
                        styles.projectCardHeader
                      }

                      
                    >

                      <div>

                        <span
                          className={
                            styles.projectId
                          }
                        >
                          PROJECT #{project.id}
                        </span>

                        <h3>
                          {project.title}
                        </h3>

                      </div>


                      <span
                        className={
                          styles.projectStatus
                        }
                      >
                        Active
                      </span>

                    </div>



                    <p
                      className={
                        styles.projectDescription
                      }
                    >
                      {project.description ||
                        "No description provided."}
                    </p>



                    <div
                      className={
                        styles.projectCardFooter
                      }
                    >

                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={() =>
                          navigate(
                            `/projects/${project.id}`
                          )
                        }
                      >
                        Open Project
                      </button>


                      <div
                        className={
                          styles.cardActions
                        }
                      >

                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnSecondary}`}
                          onClick={() =>
                            handleOpenEditModal(
                              project
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnDanger}`}
                          onClick={() =>
                            handleOpenDeleteModal(
                              project
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </section>

      <Modal
        isOpen={
          modalType === "create"
        }
        onClose={
          handleCloseModal
        }
        title="Create Project"
        description="Create a project to start managing your tasks."
      >

        <form
          className={
            styles.projectForm
          }
          onSubmit={
            handleCreateProject
          }
        >

          {/* Title */}

          <div
            className={
              styles.formGroup
            }
          >

            <label htmlFor="create-project-title">
              Project Title
            </label>

            <input
              id="create-project-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Enter project title"
              maxLength={255}
              autoFocus
              disabled={loading}
            />

          </div>


          {/* Description */}

          <div
            className={
              styles.formGroup
            }
          >

            <label htmlFor="create-project-description">
              Description
            </label>

            <textarea
              id="create-project-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Enter project description"
              rows={4}
              disabled={loading}
            />

          </div>


          {/* Actions */}

          <div
            className={
              styles.modalActions
            }
          >

            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={
                handleCloseModal
              }
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={
                loading ||
                !title.trim()
              }
            >
              {loading
                ? "Creating..."
                : "Create Project"}
            </button>

          </div>

        </form>

      </Modal>

      <Modal
        isOpen={
          modalType === "edit"
        }
        onClose={
          handleCloseModal
        }
        title="Edit Project"
        description="Update your project details."
      >

        <form
          className={
            styles.projectForm
          }
          onSubmit={
            handleEditProject
          }
        >

          {/* Title */}

          <div
            className={
              styles.formGroup
            }
          >

            <label htmlFor="edit-project-title">
              Project Title
            </label>

            <input
              id="edit-project-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Enter project title"
              maxLength={255}
              autoFocus
              disabled={actionLoading}
            />

          </div>


          {/* Description */}

          <div
            className={
              styles.formGroup
            }
          >

            <label htmlFor="edit-project-description">
              Description
            </label>

            <textarea
              id="edit-project-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Enter project description"
              rows={4}
              disabled={actionLoading}
            />

          </div>


          {/* Actions */}

          <div
            className={
              styles.modalActions
            }
          >

            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={
                handleCloseModal
              }
              disabled={
                actionLoading
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={
                actionLoading ||
                !title.trim()
              }
            >
              {actionLoading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </Modal>

      <Modal
        isOpen={
          modalType === "delete"
        }
        onClose={
          handleCloseModal
        }
        title="Delete Project?"
        description="This action cannot be undone."
        size="small"
      >

        <div
          className={
            styles.deleteContent
          }
        >

          <div
            className={
              styles.deleteIcon
            }
          >
            !
          </div>


          <p>
            Are you sure you want to
            delete{" "}
            <strong>
              {selectedProject?.title}
            </strong>
            ?
          </p>


          <p
            className={
              styles.deleteWarning
            }
          >
            All tasks inside this
            project will also be
            permanently deleted.
          </p>

        </div>


        <div
          className={
            styles.modalActions
          }
        >

          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={
              handleCloseModal
            }
            disabled={
              actionLoading
            }
          >
            Cancel
          </button>


          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={
              handleDeleteProject
            }
            disabled={
              actionLoading
            }
          >
            {actionLoading
              ? "Deleting..."
              : "Delete Project"}
          </button>

        </div>

      </Modal>

    </main>
  );
}

export default Dashboard;