import React, { useEffect, useState } from "react";
import { fetchWithAuth, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function LecturerDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchWithAuth("/api/Lecturer/courses");
        setCourses(data.$values || []);
      } catch (err) {
        console.error("Error loading lecturer courses:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedModule) return;

    try {
      const data = await fetchWithAuth("/api/Lecturer/tasks", {
        method: "POST",
        body: JSON.stringify({
          taskName,
          dueDate,
          moduleId: selectedModule.moduleId,
        }),
      });
      setMessage(data.message || "Task created successfully!");
      setTaskName("");
      setDueDate("");
    } catch (err) {
      console.error("Task creation failed:", err);
      setMessage("Error creating task.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3f3f3" }}>
        <p style={{ color: "#555", fontSize: "18px" }}>Loading courses...</p>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f3f3", fontFamily: "Arial, sans-serif" }}>
      {}
      <header style={{
        backgroundColor: "#1e40af",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Lecturer Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc2626",
            padding: "8px 16px",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </header>

      {}
      <main style={{ padding: "32px" }}>
        {courses.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "80px", color: "#777", fontSize: "18px" }}>
            No courses assigned yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {courses.map((course) => (
              <div
                key={course.courseId}
                style={{
                  backgroundColor: "white",
                  borderRadius: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "24px",
                  flex: "1 1 300px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default"
                }}
              >
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111", marginBottom: "8px" }}>
                  {course.courseName}
                </h2>
                <p style={{ color: "#555", marginBottom: "16px" }}>
                  {course.description || "No course description provided."}
                </p>

                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#333", marginBottom: "12px" }}>
                  Modules
                </h3>

                {course.modules?.$values?.length > 0 ? (
                  course.modules.$values.map((m) => (
                    <div
                      key={m.moduleId}
                      style={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: "16px",
                        padding: "12px 16px",
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e0e0e0"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                    >
                      <div>
                        <p style={{ fontWeight: "600", color: "#111", marginBottom: "4px" }}>{m.moduleName}</p>
                        <p style={{ fontSize: "14px", color: "#555" }}>{m.description || "No module description"}</p>
                      </div>
                      <button
                        onClick={() => setSelectedModule(m)}
                        style={{
                          backgroundColor: "#1e40af",
                          color: "white",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border: "none",
                          fontSize: "14px",
                          cursor: "pointer"
                        }}
                      >
                        Create Task
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ fontStyle: "italic", color: "#777" }}>No modules assigned yet.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {}
      {selectedModule && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "24px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#111" }}>
              Create Task for {selectedModule.moduleName}
            </h2>

            <form onSubmit={handleCreateTask}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#333" }}>Task Name</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
                placeholder="Enter task name"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
              />

              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#333" }}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedModule(null)}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Go-Back
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#16a34a",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Create Task
                </button>
              </div>
            </form>

            {message && <p style={{ marginTop: "12px", color: "#1e40af", fontWeight: "500", textAlign: "center" }}>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
