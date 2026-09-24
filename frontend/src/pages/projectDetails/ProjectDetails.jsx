import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import styles from "./projectDetails.module.css";

import Modal from "../../components/Modal/modal.jsx";

import {
  getTasksStart,
  getTasksSuccess,
  getTasksFailure,
} from "../../module/tasks/taskSlice.js";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../module/tasks/tasksApi.js";


const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
];

const TASK_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

const PAGE_LIMIT = 10;


const INITIAL_TASK_FORM = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  due_date: "",
};


const INITIAL_EDIT_FORM = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  due_date: "",
};


function ProjectDetail() {

  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector(
    (state) => state.auth.token
  );

  const {
    tasks,
    total,
    page,
    pages,
    loading,
    error,
  } = useSelector(
    (state) => state.tasks
  );

  const [taskForm, setTaskForm] = useState(
    INITIAL_TASK_FORM
  );

  const [editForm, setEditForm] = useState(
    INITIAL_EDIT_FORM
  );

  const [statusFilter, setStatusFilter] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [formErrors, setFormErrors] =
    useState({});

  const [modalType, setModalType] =
    useState(null);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {

      setSearchQuery(search);

      setCurrentPage(1);

    }, 400);


    return () => clearTimeout(timer);

  }, [search]);

  useEffect(() => {

    setCurrentPage(1);

  }, [
    statusFilter,
    priorityFilter,
  ]);


  useEffect(() => {

    const fetchTasks = async () => {

      if (!token || !projectId) {
        return;
      }


      dispatch(getTasksStart());


      try {

        const response = await getTasks(
          token,
          projectId,
          {
            page: currentPage,
            limit: PAGE_LIMIT,

            ...(statusFilter && {
              status: statusFilter,
            }),

            ...(priorityFilter && {
              priority: priorityFilter,
            }),

            ...(searchQuery && {
              search: searchQuery,
            }),
          }
        );


        dispatch(
          getTasksSuccess(response)
        );

      } catch (err) {

        const message =
          err.response?.data?.detail ||
          "Failed to load tasks.";


        dispatch(
          getTasksFailure(message)
        );
      }
    };


    fetchTasks();

  }, [
    token,
    projectId,
    currentPage,
    statusFilter,
    priorityFilter,
    searchQuery,
    dispatch,
  ]);

  const handleTaskFormChange = (
    field,
    value
  ) => {

    setTaskForm((previous) => ({
      ...previous,
      [field]: value,
    }));


    setFormErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const handleEditFormChange = (
    field,
    value
  ) => {

    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const validateTaskForm = () => {

    const errors = {};


    if (!taskForm.title.trim()) {

      errors.title =
        "Task title is required.";
    }


    if (taskForm.title.length > 255) {

      errors.title =
        "Task title must be 255 characters or less.";
    }


    return errors;
  };

  const handleOpenCreateModal = () => {

    setTaskForm(
      INITIAL_TASK_FORM
    );

    setFormErrors({});

    setSelectedTask(null);

    setModalType("create");
  };

  const handleOpenEditModal = (
    task
  ) => {

    setSelectedTask(task);


    setEditForm({
      title: task.title || "",

      description:
        task.description || "",

      status:
        task.status || "TODO",

      priority:
        task.priority || "MEDIUM",

      due_date:
        task.due_date || "",
    });


    setModalType("edit");
  };


  const handleOpenDeleteModal = (
    task
  ) => {

    setSelectedTask(task);

    setModalType("delete");
  };


  const handleCloseModal = () => {

    if (actionLoading) {
      return;
    }


    setTaskForm(
      INITIAL_TASK_FORM
    );

    setEditForm(
      INITIAL_EDIT_FORM
    );

    setFormErrors({});

    setSelectedTask(null);

    setModalType(null);
  };

  const handleCreateTask = async (
    event
  ) => {

    event.preventDefault();


    const errors =
      validateTaskForm();


    if (
      Object.keys(errors).length > 0
    ) {

      setFormErrors(errors);

      return;
    }


    setActionLoading(true);


    try {

      await createTask(
        token,
        projectId,
        {
          title:
            taskForm.title.trim(),

          description:
            taskForm.description.trim() ||
            null,

          status:
            taskForm.status,

          priority:
            taskForm.priority,

          due_date:
            taskForm.due_date ||
            null,
        }
      );


      setTaskForm(
        INITIAL_TASK_FORM
      );

      setFormErrors({});

      setModalType(null);


      // Reload first page

      setCurrentPage(1);


      const response =
        await getTasks(
          token,
          projectId,
          {
            page: 1,
            limit: PAGE_LIMIT,

            ...(statusFilter && {
              status: statusFilter,
            }),

            ...(priorityFilter && {
              priority: priorityFilter,
            }),

            ...(searchQuery && {
              search: searchQuery,
            }),
          }
        );


      dispatch(
        getTasksSuccess(response)
      );

    } catch (err) {

      const message =
        err.response?.data?.detail ||
        "Failed to create task.";


      dispatch(
        getTasksFailure(message)
      );

    } finally {

      setActionLoading(false);
    }
  };

  const handleSaveEdit = async (
    event
  ) => {

    event.preventDefault();


    if (
      !selectedTask ||
      !editForm.title.trim()
    ) {
      return;
    }


    setActionLoading(true);


    try {

      await updateTask(
        token,
        selectedTask.id,
        {
          title:
            editForm.title.trim(),

          description:
            editForm.description.trim() ||
            null,

          status:
            editForm.status,

          priority:
            editForm.priority,

          due_date:
            editForm.due_date ||
            null,
        }
      );


      setEditForm(
        INITIAL_EDIT_FORM
      );

      setSelectedTask(null);

      setModalType(null);


      // Refresh current page

      const response =
        await getTasks(
          token,
          projectId,
          {
            page: currentPage,
            limit: PAGE_LIMIT,

            ...(statusFilter && {
              status: statusFilter,
            }),

            ...(priorityFilter && {
              priority: priorityFilter,
            }),

            ...(searchQuery && {
              search: searchQuery,
            }),
          }
        );


      dispatch(
        getTasksSuccess(response)
      );

    } catch (err) {

      const message =
        err.response?.data?.detail ||
        "Failed to update task.";


      dispatch(
        getTasksFailure(message)
      );

    } finally {

      setActionLoading(false);
    }
  };

  const handleDeleteTask = async () => {

    if (!selectedTask) {
      return;
    }


    setActionLoading(true);


    try {

      await deleteTask(
        token,
        selectedTask.id
      );


      let nextPage =
        currentPage;


      if (
        tasks.length === 1 &&
        currentPage > 1
      ) {

        nextPage =
          currentPage - 1;

        setCurrentPage(
          nextPage
        );
      }


      const response =
        await getTasks(
          token,
          projectId,
          {
            page: nextPage,
            limit: PAGE_LIMIT,

            ...(statusFilter && {
              status: statusFilter,
            }),

            ...(priorityFilter && {
              priority: priorityFilter,
            }),

            ...(searchQuery && {
              search: searchQuery,
            }),
          }
        );


      dispatch(
        getTasksSuccess(response)
      );


      setSelectedTask(null);

      setModalType(null);

    } catch (err) {

      const message =
        err.response?.data?.detail ||
        "Failed to delete task.";


      dispatch(
        getTasksFailure(message)
      );

    } finally {

      setActionLoading(false);
    }
  };

  const handlePreviousPage = () => {

    if (currentPage > 1) {

      setCurrentPage(
        (previous) =>
          previous - 1
      );
    }
  };


  const handleNextPage = () => {

    if (
      currentPage < pages
    ) {

      setCurrentPage(
        (previous) =>
          previous + 1
      );
    }
  };

  const handleClearSearch = () => {

    setSearch("");

    setSearchQuery("");

    setCurrentPage(1);
  };

  const getStatusClass = (
    status
  ) => {

    const statusClasses = {

      TODO:
        styles.statusTodo,

      IN_PROGRESS:
        styles.statusInProgress,

      COMPLETED:
        styles.statusCompleted,
    };


    return (
      statusClasses[status] ||
      ""
    );
  };

  const getPriorityClass = (
    priority
  ) => {

    const priorityClasses = {

      LOW:
        styles.priorityLow,

      MEDIUM:
        styles.priorityMedium,

      HIGH:
        styles.priorityHigh,
    };


    return (
      priorityClasses[priority] ||
      ""
    );
  };

  return (

    <main
      className={styles.projectPage}
    >


      <header
        className={
          styles.projectHeader
        }
      >

        <div
          className={
            styles.projectHeaderContent
          }
        >

          <div>

            <span
              className={
                styles.pageLabel
              }
            >
              Project
            </span>


            <h1>
              Project Details
            </h1>


            <p
              className={
                styles.projectId
              }
            >
              Project ID: #{projectId}
            </p>

          </div>


          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

        </div>

      </header>


      <section
        className={
          styles.taskSection
        }
      >


        <div
          className={
            styles.sectionHeader
          }
        >

          <div>

            <h2>
              Tasks
            </h2>

            <span
              className={
                styles.taskCount
              }
            >
              {total}{" "}
              {total === 1
                ? "task"
                : "tasks"}
            </span>

          </div>


          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={
              handleOpenCreateModal
            }
          >
            + Create Task
          </button>

        </div>



        <div
          className={
            styles.filterCard
          }
        >

          <div
            className={
              styles.filterHeader
            }
          >

            <div>

              <h3>
                Filter Tasks
              </h3>

              <p>
                Search and filter your
                project tasks.
              </p>

            </div>

          </div>


          <div
            className={
              styles.filterGrid
            }
          >

            {/* Status */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="status-filter">
                Status
              </label>


              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="">
                  All Statuses
                </option>


                {TASK_STATUSES.map(
                  (status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status.replace(
                        "_",
                        " "
                      )}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Priority */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="priority-filter">
                Priority
              </label>


              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target.value
                  )
                }
              >

                <option value="">
                  All Priorities
                </option>


                {TASK_PRIORITIES.map(
                  (priority) => (

                    <option
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Search */}

            <div
              className={`${styles.formGroup} ${styles.searchGroup}`}
            >

              <label htmlFor="task-search">
                Search
              </label>


              <div
                className={
                  styles.searchWrapper
                }
              >

                <input
                  id="task-search"
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search tasks..."
                />


                {search && (

                  <button
                    type="button"
                    className={
                      styles.clearSearch
                    }
                    onClick={
                      handleClearSearch
                    }
                    aria-label="Clear search"
                  >
                    ×
                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

        {error && (

          <div
            className={
              styles.errorMessage
            }
          >
            {error}
          </div>

        )}

        {loading &&
          tasks.length === 0 && (

            <div
              className={
                styles.stateMessage
              }
            >
              Loading tasks...
            </div>

          )}

        {!loading &&
          tasks.length === 0 && (

            <div
              className={
                styles.emptyState
              }
            >

              <h3>
                No tasks found
              </h3>


              <p>
                Create a task or change
                your filters to see
                results.
              </p>


              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={
                  handleOpenCreateModal
                }
              >
                + Create Task
              </button>

            </div>

          )}

        {tasks.length > 0 && (

          <div
            className={
              styles.taskList
            }
          >

            {tasks.map(
              (task) => (

                <article
                  key={task.id}
                  className={
                    styles.taskCard
                  }
                >

                  {/* Task Header */}

                  <div
                    className={
                      styles.taskCardHeader
                    }
                  >

                    <div>

                      <h3>
                        {task.title}
                      </h3>


                      <span
                        className={
                          styles.taskId
                        }
                      >
                        #{task.id}
                      </span>

                    </div>


                    <div
                      className={
                        styles.taskMeta
                      }
                    >

                      <span
                        className={`${styles.badge} ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {task.status.replace(
                          "_",
                          " "
                        )}
                      </span>


                      <span
                        className={`${styles.badge} ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                    </div>

                  </div>


                  {/* Description */}

                  {task.description && (

                    <p
                      className={
                        styles.taskDescription
                      }
                    >
                      {task.description}
                    </p>

                  )}


                  {/* Footer */}

                  <div
                    className={
                      styles.taskFooter
                    }
                  >

                    <div
                      className={
                        styles.taskDate
                      }
                    >
                      {task.due_date
                        ? `Due: ${task.due_date}`
                        : "No due date"}
                    </div>


                    <div
                      className={
                        styles.taskActions
                      }
                    >

                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={() =>
                          handleOpenEditModal(
                            task
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
                            task
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

        {pages > 1 && (

          <div
            className={
              styles.pagination
            }
          >

            <div
              className={
                styles.paginationInfo
              }
            >
              Page {page} of {pages}
            </div>


            <div
              className={
                styles.paginationActions
              }
            >

              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={
                  handlePreviousPage
                }
                disabled={
                  currentPage === 1
                }
              >
                Previous
              </button>


              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={
                  handleNextPage
                }
                disabled={
                  currentPage === pages
                }
              >
                Next
              </button>

            </div>

          </div>

        )}

      </section>

      <Modal
        isOpen={
          modalType === "create"
        }
        onClose={
          handleCloseModal
        }
        title="Create Task"
        description="Create a new task for this project."
      >

        <form
          className={
            styles.taskForm
          }
          onSubmit={
            handleCreateTask
          }
        >

          <div
            className={
              styles.formGrid
            }
          >

            {/* Title */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="create-task-title">
                Title
              </label>


              <input
                id="create-task-title"
                type="text"
                value={
                  taskForm.title
                }
                onChange={(event) =>
                  handleTaskFormChange(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Enter task title"
                maxLength={255}
                autoFocus
                disabled={
                  actionLoading
                }
              />


              {formErrors.title && (

                <span
                  className={
                    styles.fieldError
                  }
                >
                  {formErrors.title}
                </span>

              )}

            </div>


            {/* Status */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="create-task-status">
                Status
              </label>


              <select
                id="create-task-status"
                value={
                  taskForm.status
                }
                onChange={(event) =>
                  handleTaskFormChange(
                    "status",
                    event.target.value
                  )
                }
                disabled={
                  actionLoading
                }
              >

                {TASK_STATUSES.map(
                  (status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status.replace(
                        "_",
                        " "
                      )}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Priority */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="create-task-priority">
                Priority
              </label>


              <select
                id="create-task-priority"
                value={
                  taskForm.priority
                }
                onChange={(event) =>
                  handleTaskFormChange(
                    "priority",
                    event.target.value
                  )
                }
                disabled={
                  actionLoading
                }
              >

                {TASK_PRIORITIES.map(
                  (priority) => (

                    <option
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Due Date */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="create-task-due-date">
                Due Date
              </label>


              <input
                id="create-task-due-date"
                type="date"
                value={
                  taskForm.due_date
                }
                onChange={(event) =>
                  handleTaskFormChange(
                    "due_date",
                    event.target.value
                  )
                }
                disabled={
                  actionLoading
                }
              />

            </div>


            {/* Description */}

            <div
              className={`${styles.formGroup} ${styles.formFull}`}
            >

              <label htmlFor="create-task-description">
                Description
              </label>


              <textarea
                id="create-task-description"
                rows="4"
                value={
                  taskForm.description
                }
                onChange={(event) =>
                  handleTaskFormChange(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the task..."
                disabled={
                  actionLoading
                }
              />

            </div>

          </div>


          {/* Actions */}

          <div
            className={
              styles.formActions
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
                !taskForm.title.trim()
              }
            >
              {actionLoading
                ? "Creating..."
                : "Create Task"}
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
        title="Edit Task"
        description="Update the task details, status, priority, or due date."
      >

        <form
          className={
            styles.taskForm
          }
          onSubmit={
            handleSaveEdit
          }
        >

          <div
            className={
              styles.formGrid
            }
          >

            {/* Title */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="edit-task-title">
                Title
              </label>


              <input
                id="edit-task-title"
                type="text"
                value={
                  editForm.title
                }
                onChange={(event) =>
                  handleEditFormChange(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Enter task title"
                maxLength={255}
                autoFocus
                disabled={
                  actionLoading
                }
              />

            </div>


            {/* Status */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="edit-task-status">
                Status
              </label>


              <select
                id="edit-task-status"
                value={
                  editForm.status
                }
                onChange={(event) =>
                  handleEditFormChange(
                    "status",
                    event.target.value
                  )
                }
                disabled={
                  actionLoading
                }
              >

                {TASK_STATUSES.map(
                  (status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status.replace(
                        "_",
                        " "
                      )}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Priority */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="edit-task-priority">
                Priority
              </label>


              <select
                id="edit-task-priority"
                value={
                  editForm.priority
                }
                onChange={(event) =>
                  handleEditFormChange(
                    "priority",
                    event.target.value
                  )
                }
                disabled={
                  actionLoading
                }
              >

                {TASK_PRIORITIES.map(
                  (priority) => (

                    <option
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Due Date */}

            <div
              className={
                styles.formGroup
              }
            >

              <label htmlFor="edit-task-due-date">
                Due Date
              </label>


              <input
                id="edit-task-due-date"
                type="date"
                value={
                  editForm.due_date
                }
                onChange={(event) =>
                  handleEditFormChange(
                    "due_date",
                    event.target.value
                  )
                }
                disabled={
                  actionLoading
                }
              />

            </div>


            {/* Description */}

            <div
              className={`${styles.formGroup} ${styles.formFull}`}
            >

              <label htmlFor="edit-task-description">
                Description
              </label>


              <textarea
                id="edit-task-description"
                rows="4"
                value={
                  editForm.description
                }
                onChange={(event) =>
                  handleEditFormChange(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the task..."
                disabled={
                  actionLoading
                }
              />

            </div>

          </div>


          {/* Actions */}

          <div
            className={
              styles.formActions
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
                !editForm.title.trim()
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
        title="Delete Task?"
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

            Are you sure you want
            to delete{" "}

            <strong>
              {selectedTask?.title}
            </strong>
            ?

          </p>


          <p
            className={
              styles.deleteWarning
            }
          >
            This task will be
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
              handleDeleteTask
            }
            disabled={
              actionLoading
            }
          >
            {actionLoading
              ? "Deleting..."
              : "Delete Task"}
          </button>

        </div>

      </Modal>

    </main>
  );
}


export default ProjectDetail;