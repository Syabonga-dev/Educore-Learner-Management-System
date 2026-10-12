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

function statusDetails(status) {
  switch (status) {
    case 1:
      return {
        text: "In progress",
        className:
          "status-pill--warning",
      };

    case 2:
      return {
        text: "Complete",
        className:
          "status-pill--success",
      };

    default:
      return {
        text: "Not started",
        className:
          "status-pill--neutral",
      };
  }
}

export default function StudentDashboard() {
  const [studentId, setStudentId] =
    useState(null);

  const [tasks, setTasks] =
    useState([]);

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const storedStudentId =
      localStorage.getItem(
        "studentId"
      );

    if (storedStudentId) {
      setStudentId(
        Number(storedStudentId)
      );
    } else {
      setError(
        "Your student profile could not be linked to this session."
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!studentId) {
      return;
    }

    loadTasks();
  }, [studentId]);

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const data =
        await fetchWithAuth(
          `/api/Student/${studentId}/detailed-tasks`
        );

      setTasks(
        data?.$values ||
          data ||
          []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load your tasks."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(
    taskId,
    status
  ) {
    try {
      await fetchWithAuth(
        `/api/Student/tasks/${taskId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({
            status,
          }),
        }
      );

      await loadTasks();
    } catch (err) {
      setError(
        err.message ||
          "Unable to update task."
      );
    }
  }

  const notStartedCount =
    useMemo(
      () =>
        tasks.filter(
          (task) =>
            task.status === 0
        ).length,
      [tasks]
    );

  const progressCount =
    useMemo(
      () =>
        tasks.filter(
          (task) =>
            task.status === 1
        ).length,
      [tasks]
    );

  const completedCount =
    useMemo(
      () =>
        tasks.filter(
          (task) =>
            task.status === 2
        ).length,
      [tasks]
    );

  const filteredTasks =
    useMemo(() => {
      if (
        statusFilter === "all"
      ) {
        return tasks;
      }

      return tasks.filter(
        (task) =>
          task.status ===
          Number(statusFilter)
      );
    }, [
      tasks,
      statusFilter,
    ]);

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedCount /
            tasks.length) *
            100
        );

  return (
    <DashboardShell
      title="Student dashboard"
      eyebrow="My learning"
      navigation={[
        {
          label: "Overview",
          href: "#overview",
          icon: "dashboard",
        },
        {
          label: "My tasks",
          href: "#tasks",
          icon: "task",
        },
      ]}
      actions={
        <button
          className="button button--outline button--small topbar-action"
          onClick={loadTasks}
          disabled={!studentId}
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
              Something needs attention
            </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <section
        id="overview"
        className="student-hero"
      >
        <div className="student-hero__copy">
          <span className="section-kicker section-kicker--light">
            Keep moving
          </span>

          <h2>
            Your work.
            <br />
            Your progress.
          </h2>

          <p>
            Stay on top of every task
            and keep your learning
            moving forward.
          </p>
        </div>

        <div className="progress-ring-card">
          <div
            className="progress-ring"
            style={{
              "--progress": `${completionPercentage * 3.6}deg`,
            }}
          >
            <div>
              <strong>
                {
                  completionPercentage
                }
                %
              </strong>
              <span>
                complete
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="stat-grid stat-grid--three">
        <article className="stat-card">
          <div className="stat-card__icon">
            <Icon
              name="clock"
              size={24}
            />
          </div>

          <div>
            <span>
              Not started
            </span>
            <strong>
              {notStartedCount}
            </strong>
            <small>
              Waiting for you
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
              In progress
            </span>
            <strong>
              {progressCount}
            </strong>
            <small>
              Currently active
            </small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-card__icon">
            <Icon
              name="check"
              size={24}
            />
          </div>

          <div>
            <span>
              Complete
            </span>
            <strong>
              {completedCount}
            </strong>
            <small>
              Finished tasks
            </small>
          </div>
        </article>
      </section>

      <section
        id="tasks"
        className="data-card"
      >
        <div className="data-card__header">
          <div>
            <span className="section-kicker">
              Learning activity
            </span>

            <h2>My tasks</h2>

            <p>
              View deadlines and
              update your progress.
            </p>
          </div>
        </div>

        <div className="filter-tabs">
          {[
            {
              value: "all",
              label: "All",
            },
            {
              value: "0",
              label:
                "Not started",
            },
            {
              value: "1",
              label:
                "In progress",
            },
            {
              value: "2",
              label:
                "Complete",
            },
          ].map((filter) => (
            <button
              key={filter.value}
              className={
                statusFilter ===
                filter.value
                  ? "filter-tab filter-tab--active"
                  : "filter-tab"
              }
              onClick={() =>
                setStatusFilter(
                  filter.value
                )
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-panel">
            <div className="loader" />
            <strong>
              Loading your tasks...
            </strong>
          </div>
        ) : filteredTasks.length ===
          0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon
                name="task"
                size={30}
              />
            </div>

            <h3>
              No tasks here
            </h3>

            <p>
              There are no tasks
              matching this status
              right now.
            </p>
          </div>
        ) : (
          <div className="student-task-list">
            {filteredTasks.map(
              (task) => {
                const status =
                  statusDetails(
                    task.status
                  );

                return (
                  <article
                    className="student-task-card"
                    key={
                      task.taskItemId
                    }
                  >
                    <div className="student-task-card__main">
                      <div className="task-symbol">
                        <Icon
                          name="task"
                          size={21}
                        />
                      </div>

                      <div>
                        <div className="student-task-card__heading">
                          <h3>
                            {
                              task.taskName
                            }
                          </h3>

                          <span
                            className={`status-pill ${status.className}`}
                          >
                            {
                              status.text
                            }
                          </span>
                        </div>

                        <div className="task-meta">
                          <span>
                            <Icon
                              name="course"
                              size={
                                15
                              }
                            />
                            {task.module
                              ?.course
                              ?.courseName ||
                              "Course"}
                          </span>

                          <span>
                            <Icon
                              name="layers"
                              size={
                                15
                              }
                            />
                            {task.module
                              ?.moduleName ||
                              "Module"}
                          </span>

                          <span>
                            <Icon
                              name="calendar"
                              size={
                                15
                              }
                            />
                            {task.dueDate
                              ? new Date(
                                  task.dueDate
                                ).toLocaleDateString()
                              : "No due date"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="task-status-actions">
                      <button
                        className={
                          task.status ===
                          0
                            ? "task-status-button task-status-button--active"
                            : "task-status-button"
                        }
                        onClick={() =>
                          updateTaskStatus(
                            task.taskItemId,
                            0
                          )
                        }
                      >
                        Not started
                      </button>

                      <button
                        className={
                          task.status ===
                          1
                            ? "task-status-button task-status-button--active"
                            : "task-status-button"
                        }
                        onClick={() =>
                          updateTaskStatus(
                            task.taskItemId,
                            1
                          )
                        }
                      >
                        In progress
                      </button>

                      <button
                        className={
                          task.status ===
                          2
                            ? "task-status-button task-status-button--complete"
                            : "task-status-button"
                        }
                        onClick={() =>
                          updateTaskStatus(
                            task.taskItemId,
                            2
                          )
                        }
                      >
                        <Icon
                          name="check"
                          size={
                            15
                          }
                        />
                        Complete
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}