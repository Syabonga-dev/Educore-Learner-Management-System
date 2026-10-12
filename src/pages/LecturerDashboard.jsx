import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchWithAuth,
} from "../services/auth";

import DashboardShell from "../components/DashboardShell.jsx";
import Icon from "../components/Icon.jsx";
import Modal from "../components/Modal.jsx";

export default function LecturerDashboard() {
  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    selectedModule,
    setSelectedModule,
  ] = useState(null);

  const [taskName, setTaskName] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    setError("");

    try {
      const data =
        await fetchWithAuth(
          "/api/Lecturer/courses"
        );

      setCourses(
        data?.$values ||
          data ||
          []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load assigned courses."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalModules =
    useMemo(
      () =>
        courses.reduce(
          (total, course) =>
            total +
            (
              course.modules
                ?.$values ||
              course.modules ||
              []
            ).length,
          0
        ),
      [courses]
    );

  async function createTask(
    event
  ) {
    event.preventDefault();

    if (
      !selectedModule ||
      !taskName ||
      !dueDate
    ) {
      return;
    }

    setMessage("");

    try {
      const data =
        await fetchWithAuth(
          "/api/Lecturer/tasks",
          {
            method: "POST",
            body: JSON.stringify({
              taskName,
              dueDate,
              moduleId:
                selectedModule.moduleId,
            }),
          }
        );

      setMessage(
        data?.message ||
          data?.Message ||
          "Task created successfully."
      );

      setTaskName("");
      setDueDate("");

      setTimeout(() => {
        setSelectedModule(null);
      }, 900);
    } catch (err) {
      setMessage(
        err.message ||
          "Unable to create task."
      );
    }
  }

  return (
    <DashboardShell
      title="Lecturer dashboard"
      eyebrow="Teaching workspace"
      navigation={[
        {
          label: "Overview",
          href: "#overview",
          icon: "dashboard",
        },
        {
          label: "My courses",
          href: "#courses",
          icon: "course",
        },
      ]}
      actions={
        <button
          className="button button--outline button--small topbar-action"
          onClick={loadCourses}
        >
          <Icon
            name="refresh"
            size={17}
          />
          Refresh
        </button>
      }
    >
      {error && (
        <div className="alert alert--danger">
          <div>
            <strong>
              Unable to load workspace
            </strong>

            <span>{error}</span>
          </div>
        </div>
      )}

      <section
        id="overview"
        className="dashboard-welcome dashboard-welcome--lecturer"
      >
        <div>
          <span className="section-kicker">
            Your teaching space
          </span>

          <h2>
            Teach with everything
            in view.
          </h2>

          <p>
            Review assigned courses,
            work across modules and
            create tasks for your
            students.
          </p>
        </div>

        <div className="welcome-icon">
          <Icon
            name="course"
            size={40}
          />
        </div>
      </section>

      <section className="stat-grid stat-grid--three">
        <article className="stat-card">
          <div className="stat-card__icon">
            <Icon
              name="course"
              size={24}
            />
          </div>

          <div>
            <span>
              Assigned courses
            </span>
            <strong>
              {courses.length}
            </strong>
            <small>
              Your teaching load
            </small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-card__icon">
            <Icon
              name="layers"
              size={24}
            />
          </div>

          <div>
            <span>
              Modules
            </span>
            <strong>
              {totalModules}
            </strong>
            <small>
              Available to manage
            </small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-card__icon">
            <Icon
              name="task"
              size={24}
            />
          </div>

          <div>
            <span>
              Task creation
            </span>
            <strong>
              Active
            </strong>
            <small>
              Assign work by module
            </small>
          </div>
        </article>
      </section>

      <section
        id="courses"
        className="section-block"
      >
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">
              Assigned to you
            </span>

            <h2>My courses</h2>

            <p>
              Choose a module when
              you are ready to create
              a task.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-panel">
            <div className="loader" />
            <strong>
              Loading your courses...
            </strong>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon
                name="course"
                size={30}
              />
            </div>

            <h3>
              No courses assigned yet
            </h3>

            <p>
              Courses assigned to you
              by an administrator will
              appear here.
            </p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map(
              (course) => {
                const modules =
                  course.modules
                    ?.$values ||
                  course.modules ||
                  [];

                return (
                  <article
                    className="course-card"
                    key={
                      course.courseId
                    }
                  >
                    <div className="course-card__top">
                      <div className="course-card__icon">
                        <Icon
                          name="course"
                          size={24}
                        />
                      </div>

                      <span className="status-pill status-pill--success">
                        Assigned
                      </span>
                    </div>

                    <h3>
                      {
                        course.courseName
                      }
                    </h3>

                    <p>
                      {course.description ||
                        "No course description provided."}
                    </p>

                    <div className="course-card__meta">
                      <span>
                        <Icon
                          name="layers"
                          size={16}
                        />
                        {
                          modules.length
                        }{" "}
                        module
                        {modules.length ===
                        1
                          ? ""
                          : "s"}
                      </span>
                    </div>

                    <div className="module-list">
                      {modules.length >
                      0 ? (
                        modules.map(
                          (module) => (
                            <button
                              className="module-row"
                              key={
                                module.moduleId
                              }
                              onClick={() => {
                                setMessage(
                                  ""
                                );
                                setSelectedModule(
                                  module
                                );
                              }}
                            >
                              <div>
                                <strong>
                                  {
                                    module.moduleName
                                  }
                                </strong>

                                <span>
                                  {module.description ||
                                    "No description"}
                                </span>
                              </div>

                              <span className="module-row__action">
                                Create task
                                <Icon
                                  name="arrow"
                                  size={
                                    16
                                  }
                                />
                              </span>
                            </button>
                          )
                        )
                      ) : (
                        <div className="module-empty">
                          No modules have
                          been added to
                          this course.
                        </div>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      <Modal
        open={Boolean(selectedModule)}
        title="Create task"
        subtitle={
          selectedModule
            ? `Assign a task to students in ${selectedModule.moduleName}.`
            : ""
        }
        onClose={() => {
          setSelectedModule(null);
          setMessage("");
        }}
        footer={
          <>
            <button
              type="button"
              className="button button--ghost"
              onClick={() =>
                setSelectedModule(null)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              form="create-task-form"
              className="button button--primary"
            >
              Create task
            </button>
          </>
        }
      >
        {message && (
          <div className="alert alert--info">
            <div>
              <strong>
                Task update
              </strong>
              <span>
                {message}
              </span>
            </div>
          </div>
        )}

        <form
          id="create-task-form"
          className="form-grid"
          onSubmit={createTask}
        >
          <div className="field-group form-grid__full">
            <label>
              Task name
            </label>

            <input
              className="field"
              placeholder="e.g. Assignment 1"
              required
              value={taskName}
              onChange={(event) =>
                setTaskName(
                  event.target.value
                )
              }
            />
          </div>

          <div className="field-group form-grid__full">
            <label>
              Due date
            </label>

            <input
              className="field"
              type="date"
              required
              value={dueDate}
              onChange={(event) =>
                setDueDate(
                  event.target.value
                )
              }
            />
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}