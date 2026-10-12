import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Table,
  Form,
  Alert,
  Spinner
} from "react-bootstrap";
import { fetchWithAuth, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load student ID from localStorage
  useEffect(() => {
    const idFromStorage = localStorage.getItem("studentId");
    if (idFromStorage) {
      setStudentId(parseInt(idFromStorage));
    } else {
      setError("Student ID not found in local storage.");
      setLoading(false);
    }
  }, []);

  // Load tasks for student
  useEffect(() => {
    async function loadTasks() {
      if (!studentId) return;

      setLoading(true);
      try {
        const taskData = await fetchWithAuth(`/api/Student/${studentId}/detailed-tasks`);
        setTasks(taskData?.$values || []);
      } catch (err) {
        setError("Error fetching tasks: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [studentId]);

  // Update task status
  async function updateTaskStatus(taskId, status) {
    try {
      await fetchWithAuth(`/api/Student/tasks/${taskId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      const updatedTaskData = await fetchWithAuth(`/api/Student/${studentId}/detailed-tasks`);
      setTasks(updatedTaskData?.$values || []);
    } catch (err) {
      setError("Failed to update task status: " + err.message);
    }
  }

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((t) => {
        if (statusFilter === "all") return true;
        return t.status === parseInt(statusFilter);
      })
    : [];

  return (
    <Container style={{ marginTop: "20px" }}>
      <h2>Student Dashboard</h2>

      <Button
        variant="secondary"
        style={{ marginBottom: "20px" }}
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      <div style={{ marginBottom: "20px" }}>
        <Form.Label>Filter by Status:</Form.Label>
        <Form.Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            width: "200px",
            display: "inline-block",
            marginLeft: "10px",
          }}
        >
          <option value="all">All</option>
          <option value="0">Not Started</option>
          <option value="1">In Progress</option>
          <option value="2">Complete</option>
        </Form.Select>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Task Name</th>
              <th>Module</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr key={task.taskItemId || index}>
                <td>{index + 1}</td>
                <td>{task.taskName}</td>
                <td>{task.module?.moduleName || "N/A"}</td>
                <td>{task.module?.course?.courseName || "N/A"}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>
                  {task.status === 0
                    ? "Not Started"
                    : task.status === 1
                    ? "In Progress"
                    : "Complete"}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    style={{ marginRight: "5px" }}
                    onClick={() => updateTaskStatus(task.taskItemId, 0)}
                  >
                    Not Started
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    style={{ marginRight: "5px" }}
                    onClick={() => updateTaskStatus(task.taskItemId, 1)}
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => updateTaskStatus(task.taskItemId, 2)}
                  >
                    Complete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
