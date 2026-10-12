
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Alert, Spinner, Row, Col } from "react-bootstrap";
import { fetchWithAuth, logout, getUserFromToken } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);


  const [newCourse, setNewCourse] = useState({ courseName: "", description: "" });
  const [assignData, setAssignData] = useState({ courseId: "", lecturerId: "" });
  const [newModule, setNewModule] = useState({ moduleName: "", description: "", courseId: "" });
  const [newLecturer, setNewLecturer] = useState({ staffNumber: "", name: "", surname: "", email: "", phoneNumber: "", password: "" });
  const [newStudent, setNewStudent] = useState({ studentNumber: "", name: "", surname: "", email: "", courseId: "", password: "" });


  const [searchStudent, setSearchStudent] = useState("");
  const [searchLecturer, setSearchLecturer] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [courseData, lecturerData, studentData] = await Promise.all([
        fetchWithAuth("/api/admin/Courses"),
        fetchWithAuth("/api/admin/Lecturers"),
        fetchWithAuth("/api/admin/Students")
      ]);
      setCourses(courseData?.$values || []);
      setLecturers(lecturerData?.$values || []);
      setStudents(studentData?.$values || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  async function createOrUpdateCourse() {
    if (!newCourse.courseName) return setError("Course name is required");
    try {
      if (editingCourse) {
        
        await fetchWithAuth(`/api/admin/Courses/${editingCourse.courseId}`, {
          method: "PUT",
          body: JSON.stringify(newCourse)
        });
      } else {
        
        await fetchWithAuth("/api/admin/Courses", { method: "POST", body: JSON.stringify(newCourse) });
      }
      setShowCourseModal(false);
      setNewCourse({ courseName: "", description: "" });
      setEditingCourse(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteCourse(id) {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await fetchWithAuth(`/api/admin/Courses/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function assignLecturer() {
    if (!assignData.courseId || !assignData.lecturerId) return setError("Select both course and lecturer");
    try {
      await fetchWithAuth("/api/admin/Courses/assign-lecturer", { method: "POST", body: JSON.stringify(assignData) });
      setShowAssignModal(false);
      loadData();
    } catch (err) { setError(err.message); }
  }

  async function addModule() {
    if (!newModule.moduleName || !newModule.courseId) return setError("Module name and course required");
    try {
      await fetchWithAuth(`/api/admin/Modules?courseId=${newModule.courseId}`, { method: "POST", body: JSON.stringify({ moduleName: newModule.moduleName, description: newModule.description }) });
      setShowModuleModal(false);
      setNewModule({ moduleName: "", description: "", courseId: "" });
      loadData();
    } catch (err) { setError(err.message); }
  }

  async function createStudent() {
    if (!newStudent.name || !newStudent.studentNumber || !newStudent.courseId)
      return setError("Name, student number and course are required");

    try {
      if (editingStudent) {
        await fetchWithAuth(`/api/admin/Students/${editingStudent.studentId}`, {
          method: "PUT",
          body: JSON.stringify(newStudent),
        });
      } else {
        await fetchWithAuth("/api/admin/Students", { method: "POST", body: JSON.stringify(newStudent) });
      }

      setShowStudentModal(false);
      setNewStudent({ studentNumber: "", name: "", surname: "", email: "", courseId: "", password: "" });
      setEditingStudent(null);
      loadData();
    } catch (err) { setError(err.message); }
  }

  async function deleteStudent(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await fetchWithAuth(`/api/admin/Students/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) { setError(err.message); }
  }

  const filteredStudents = students.filter(s => {
    if (!searchStudent) return true;
    const term = searchStudent.toLowerCase();
    return s.studentNumber?.toLowerCase().includes(term) ||
           s.name?.toLowerCase().includes(term) ||
           s.surname?.toLowerCase().includes(term);
  });

  const filteredLecturers = lecturers.filter(l => {
    if (!searchLecturer) return true;
    const term = searchLecturer.toLowerCase();
    return l.staffNumber?.toLowerCase().includes(term) ||
           l.name?.toLowerCase().includes(term) ||
           l.surname?.toLowerCase().includes(term);
  });

  async function createLecturer() {
    if (!newLecturer.name || !newLecturer.staffNumber) return setError("Name and staff number required");
    try {
      await fetchWithAuth("/api/admin/Lecturers", { method: "POST", body: JSON.stringify(newLecturer) });
      setShowLecturerModal(false);
      setNewLecturer({ staffNumber: "", name: "", surname: "", email: "", phoneNumber: "", password: "" });
      loadData();
    } catch (err) { setError(err.message); }
  }

  async function updateLecturer() {
    if (!editingLecturer) return;
    try {
      await fetchWithAuth(`/api/admin/Lecturers/${editingLecturer.lecturerId}`, {
        method: "PUT",
        body: JSON.stringify(newLecturer)
      });
      setShowLecturerModal(false);
      setEditingLecturer(null);
      setNewLecturer({ staffNumber: "", name: "", surname: "", email: "", phoneNumber: "", password: "" });
      loadData();
    } catch (err) { setError(err.message); }
  }

  async function deleteLecturer(id) {
    if (!window.confirm("Are you sure you want to delete this lecturer?")) return;
    try {
      await fetchWithAuth(`/api/admin/Lecturers/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) { setError(err.message); }
  }

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.email}</p>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="secondary" className="mb-3" onClick={() => { logout(); navigate("/login"); }}>Logout</Button>

      {loading ? <Spinner animation="border" /> : (
        <>
          {}
          <section>
            <h4>Courses</h4>
            <div className="mb-2">
              <Button variant="success" className="me-2" onClick={() => { setEditingCourse(null); setShowCourseModal(true); }}>+ Add Course</Button>
              <Button variant="primary" className="me-2" onClick={() => setShowAssignModal(true)}>Assign Lecturer</Button>
              <Button variant="info" onClick={() => setShowModuleModal(true)}>Add Module</Button>
            </div>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th><th>Course Name</th><th>Description</th><th>Lecturer</th><th>Modules</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c,i) => (
                  <tr key={c.courseId || i}>
                    <td>{i+1}</td>
                    <td>{c.courseName}</td>
                    <td>{c.description}</td>
                    <td>{c.lecturerId || "Unassigned"}</td>
                    <td>{c.modules?.$values?.map(m => m.moduleName).join(", ") || "None"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-1"
                        onClick={() => {
                          setEditingCourse(c);
                          setNewCourse({ courseName: c.courseName, description: c.description });
                          setShowCourseModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteCourse(c.courseId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>

          {}
          <Modal show={showCourseModal} onHide={() => { setShowCourseModal(false); setEditingCourse(null); }} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editingCourse ? "Edit Course" : "Add Course"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.courseName}
                    onChange={e => setNewCourse({ ...newCourse, courseName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.description}
                    onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { setShowCourseModal(false); setEditingCourse(null); }}>Cancel</Button>
              <Button variant="primary" onClick={createOrUpdateCourse}>{editingCourse ? "Update" : "Save"}</Button>
            </Modal.Footer>
          </Modal>

          {}
          <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Assign Lecturer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Course</Form.Label>
                  <Form.Select value={assignData.courseId} onChange={e => setAssignData({...assignData, courseId: e.target.value})}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Lecturer</Form.Label>
                  <Form.Select value={assignData.lecturerId} onChange={e => setAssignData({...assignData, lecturerId: e.target.value})}>
                    <option value="">Select Lecturer</option>
                    {lecturers.map(l => <option key={l.lecturerId} value={l.lecturerId}>{l.name} {l.surname}</option>)}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={assignLecturer}>Assign</Button>
            </Modal.Footer>
          </Modal>

          {}
          <Modal show={showModuleModal} onHide={() => setShowModuleModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add Module</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Module Name</Form.Label>
                  <Form.Control type="text" value={newModule.moduleName} onChange={e => setNewModule({...newModule, moduleName: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" value={newModule.description} onChange={e => setNewModule({...newModule, description: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Course</Form.Label>
                  <Form.Select value={newModule.courseId} onChange={e => setNewModule({...newModule, courseId: e.target.value})}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModuleModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={addModule}>Save</Button>
            </Modal.Footer>
          </Modal>

          <hr style={{ borderTop: "1px solid black" }} />

          {}
          <section>
            <h4>Lecturers</h4>
            <Row className="mb-2">
              <Col md={6}>
                <Button variant="success" onClick={() => { setEditingLecturer(null); setShowLecturerModal(true); }}>+ Add Lecturer</Button>
              </Col>
              <Col md={6}>
                <Form.Control
                  placeholder="Search by staff number, name or surname"
                  value={searchLecturer}
                  onChange={e => setSearchLecturer(e.target.value)}
                />
              </Col>
            </Row>

            <Table bordered hover responsive>
              <thead>
                <tr><th>#</th><th>Staff Number</th><th>Name</th><th>Surname</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredLecturers.map((l,i) => (
                  <tr key={l.lecturerId || i}>
                    <td>{i+1}</td>
                    <td>{l.staffNumber}</td>
                    <td>{l.name}</td>
                    <td>{l.surname}</td>
                    <td>{l.email}</td>
                    <td>{l.phoneNumber}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-1"
                        onClick={() => {
                          setEditingLecturer(l);
                          setNewLecturer({
                            staffNumber: l.staffNumber,
                            name: l.name,
                            surname: l.surname,
                            email: l.email,
                            phoneNumber: l.phoneNumber,
                            password: "",
                          });
                          setShowLecturerModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => deleteLecturer(l.lecturerId)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {}
            <Modal show={showLecturerModal} onHide={() => { setShowLecturerModal(false); setEditingLecturer(null); }} centered>
              <Modal.Header closeButton>
                <Modal.Title>{editingLecturer ? "Edit Lecturer" : "Add Lecturer"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  {["staffNumber","name","surname","email","phoneNumber","password"].map(field => (
                    <Form.Group className="mb-2" key={field}>
                      <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                      <Form.Control
                        type={field === "password" ? "password" : "text"}
                        value={newLecturer[field]}
                        onChange={e => setNewLecturer({ ...newLecturer, [field]: e.target.value })}
                      />
                    </Form.Group>
                  ))}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowLecturerModal(false); setEditingLecturer(null); }}>Cancel</Button>
                <Button variant="primary" onClick={editingLecturer ? updateLecturer : createLecturer}>{editingLecturer ? "Update" : "Save"}</Button>
              </Modal.Footer>
            </Modal>
          </section>

          <hr style={{ borderTop: "1px solid black" }} />

          {}
          <section>
            <h4>Students</h4>
            <Row className="mb-2">
              <Col md={6}>
                <Button
                  variant="success"
                  onClick={() => { setEditingStudent(null); setShowStudentModal(true); }}
                >
                  + Add Student
                </Button>
              </Col>
              <Col md={6}>
                <Form.Control
                  placeholder="Search by number, name or surname"
                  value={searchStudent}
                  onChange={e => setSearchStudent(e.target.value)}
                />
              </Col>
            </Row>

            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Number</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Home Address</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s.studentId || i}>
                    <td>{i + 1}</td>
                    <td>{s.studentNumber}</td>
                    <td>{s.name}</td>
                    <td>{s.surname}</td>
                    <td>{s.email}</td>
                    <td>{s.gender || "-"}</td>
                    <td>{s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : "-"}</td>
                    <td>{s.homeAddress || "-"}</td>
                    <td>{s.phoneNumber || "-"}</td>
                    <td>{s.course?.courseName || "None"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-1"
                        onClick={() => {
                          setEditingStudent(s);
                          setNewStudent({
                            studentNumber: s.studentNumber,
                            name: s.name,
                            surname: s.surname,
                            email: s.email,
                            gender: s.gender || "",
                            dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split("T")[0] : "",
                            homeAddress: s.homeAddress || "",
                            phoneNumber: s.phoneNumber || "",
                            courseId: s.courseId,
                            password: "",
                          });
                          setShowStudentModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteStudent(s.studentId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>

        </>
      )}

      {}
     <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingStudent ? "Edit Student" : "Add Student"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {["studentNumber","name","surname","email","password","gender","homeAddress","phoneNumber"].map(field => (
            <Form.Group className="mb-2" key={field}>
              <Form.Label>{field.charAt(0).toUpperCase()+field.slice(1)}</Form.Label>
              <Form.Control
                type={field==="password" ? "password" : "text"}
                value={newStudent[field]}
                onChange={e => setNewStudent({...newStudent,[field]:e.target.value})}
              />
            </Form.Group>
          ))}
          <Form.Group className="mb-2">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={newStudent.dateOfBirth || ""}
              onChange={e => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Course</Form.Label>
            <Form.Select
              value={newStudent.courseId}
              onChange={e => setNewStudent({...newStudent, courseId: e.target.value})}
            >
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { setShowStudentModal(false); setEditingStudent(null); }}>Cancel</Button>
        <Button variant="primary" onClick={createStudent}>{editingStudent ? "Update" : "Save"}</Button>
      </Modal.Footer>
    </Modal>
  </Container>
  );
}
