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

const emptyLecturer = {
  staffNumber: "",
  name: "",
  surname: "",
  email: "",
  phoneNumber: "",
  password: "",
};

const emptyStudent = {
  studentNumber: "",
  name: "",
  surname: "",
  email: "",
  password: "",
  gender: "",
  dateOfBirth: "",
  homeAddress: "",
  phoneNumber: "",
  courseId: "",
};

export default function AdminDashboard() {
  const [courses, setCourses] =
    useState([]);

  const [lecturers, setLecturers] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchStudent, setSearchStudent] =
    useState("");

  const [
    searchLecturer,
    setSearchLecturer,
  ] = useState("");

  const [
    showCourseModal,
    setShowCourseModal,
  ] = useState(false);

  const [
    showAssignModal,
    setShowAssignModal,
  ] = useState(false);

  const [
    showModuleModal,
    setShowModuleModal,
  ] = useState(false);

  const [
    showLecturerModal,
    setShowLecturerModal,
  ] = useState(false);

  const [
    showStudentModal,
    setShowStudentModal,
  ] = useState(false);

  const [
    editingCourse,
    setEditingCourse,
  ] = useState(null);

  const [
    editingLecturer,
    setEditingLecturer,
  ] = useState(null);

  const [
    editingStudent,
    setEditingStudent,
  ] = useState(null);

  const [newCourse, setNewCourse] =
    useState({
      courseName: "",
      description: "",
    });

  const [assignData, setAssignData] =
    useState({
      courseId: "",
      lecturerId: "",
    });

  const [newModule, setNewModule] =
    useState({
      moduleName: "",
      description: "",
      courseId: "",
    });

  const [newLecturer, setNewLecturer] =
    useState(emptyLecturer);

  const [newStudent, setNewStudent] =
    useState(emptyStudent);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [
        courseData,
        lecturerData,
        studentData,
      ] = await Promise.all([
        fetchWithAuth(
          "/api/admin/Courses"
        ),
        fetchWithAuth(
          "/api/admin/Lecturers"
        ),
        fetchWithAuth(
          "/api/admin/Students"
        ),
      ]);

      setCourses(
        courseData?.$values ||
          courseData ||
          []
      );

      setLecturers(
        lecturerData?.$values ||
          lecturerData ||
          []
      );

      setStudents(
        studentData?.$values ||
          studentData ||
          []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalModules = useMemo(
    () =>
      courses.reduce(
        (total, course) =>
          total +
          (
            course.modules?.$values ||
            course.modules ||
            []
          ).length,
        0
      ),
    [courses]
  );

  const assignedCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.lecturerId
      ).length,
    [courses]
  );

  const filteredStudents =
    useMemo(() => {
      const term =
        searchStudent
          .trim()
          .toLowerCase();

      if (!term) {
        return students;
      }

      return students.filter(
        (student) =>
          student.studentNumber
            ?.toLowerCase()
            .includes(term) ||
          student.name
            ?.toLowerCase()
            .includes(term) ||
          student.surname
            ?.toLowerCase()
            .includes(term) ||
          student.email
            ?.toLowerCase()
            .includes(term)
      );
    }, [
      students,
      searchStudent,
    ]);

  const filteredLecturers =
    useMemo(() => {
      const term =
        searchLecturer
          .trim()
          .toLowerCase();

      if (!term) {
        return lecturers;
      }

      return lecturers.filter(
        (lecturer) =>
          lecturer.staffNumber
            ?.toLowerCase()
            .includes(term) ||
          lecturer.name
            ?.toLowerCase()
            .includes(term) ||
          lecturer.surname
            ?.toLowerCase()
            .includes(term) ||
          lecturer.email
            ?.toLowerCase()
            .includes(term)
      );
    }, [
      lecturers,
      searchLecturer,
    ]);

  function lecturerName(
    lecturerId
  ) {
    const lecturer =
      lecturers.find(
        (item) =>
          item.lecturerId ===
          lecturerId
      );

    if (!lecturer) {
      return "Unassigned";
    }

    return `${lecturer.name} ${lecturer.surname}`;
  }

  function openNewCourse() {
    setEditingCourse(null);

    setNewCourse({
      courseName: "",
      description: "",
    });

    setShowCourseModal(true);
  }

  function openEditCourse(course) {
    setEditingCourse(course);

    setNewCourse({
      courseName:
        course.courseName || "",
      description:
        course.description || "",
    });

    setShowCourseModal(true);
  }

  async function saveCourse() {
    if (!newCourse.courseName.trim()) {
      setError(
        "Course name is required."
      );
      return;
    }

    try {
      if (editingCourse) {
        await fetchWithAuth(
          `/api/admin/Courses/${editingCourse.courseId}`,
          {
            method: "PUT",
            body: JSON.stringify(
              newCourse
            ),
          }
        );
      } else {
        await fetchWithAuth(
          "/api/admin/Courses",
          {
            method: "POST",
            body: JSON.stringify(
              newCourse
            ),
          }
        );
      }

      setShowCourseModal(false);
      setEditingCourse(null);

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteCourse(id) {
    if (
      !window.confirm(
        "Delete this course? Its modules may also be removed."
      )
    ) {
      return;
    }

    try {
      await fetchWithAuth(
        `/api/admin/Courses/${id}`,
        {
          method: "DELETE",
        }
      );

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function assignLecturer() {
    if (
      !assignData.courseId ||
      !assignData.lecturerId
    ) {
      setError(
        "Select both a course and lecturer."
      );
      return;
    }

    try {
      await fetchWithAuth(
        "/api/admin/Courses/assign-lecturer",
        {
          method: "POST",
          body: JSON.stringify({
            courseId: Number(
              assignData.courseId
            ),
            lecturerId: Number(
              assignData.lecturerId
            ),
          }),
        }
      );

      setAssignData({
        courseId: "",
        lecturerId: "",
      });

      setShowAssignModal(false);

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addModule() {
    if (
      !newModule.moduleName.trim() ||
      !newModule.courseId
    ) {
      setError(
        "Module name and course are required."
      );
      return;
    }

    try {
      await fetchWithAuth(
        `/api/admin/Modules?courseId=${newModule.courseId}`,
        {
          method: "POST",
          body: JSON.stringify({
            moduleName:
              newModule.moduleName,
            description:
              newModule.description,
          }),
        }
      );

      setNewModule({
        moduleName: "",
        description: "",
        courseId: "",
      });

      setShowModuleModal(false);

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function openNewLecturer() {
    setEditingLecturer(null);
    setNewLecturer(
      emptyLecturer
    );
    setShowLecturerModal(true);
  }

  function openEditLecturer(
    lecturer
  ) {
    setEditingLecturer(lecturer);

    setNewLecturer({
      staffNumber:
        lecturer.staffNumber || "",
      name: lecturer.name || "",
      surname:
        lecturer.surname || "",
      email:
        lecturer.email || "",
      phoneNumber:
        lecturer.phoneNumber || "",
      password: "",
    });

    setShowLecturerModal(true);
  }

  async function saveLecturer() {
    if (
      !newLecturer.name.trim() ||
      !newLecturer.staffNumber.trim()
    ) {
      setError(
        "Name and staff number are required."
      );
      return;
    }

    try {
      if (editingLecturer) {
        await fetchWithAuth(
          `/api/admin/Lecturers/${editingLecturer.lecturerId}`,
          {
            method: "PUT",
            body: JSON.stringify(
              newLecturer
            ),
          }
        );
      } else {
        await fetchWithAuth(
          "/api/admin/Lecturers",
          {
            method: "POST",
            body: JSON.stringify(
              newLecturer
            ),
          }
        );
      }

      setShowLecturerModal(false);
      setEditingLecturer(null);
      setNewLecturer(
        emptyLecturer
      );

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteLecturer(id) {
    if (
      !window.confirm(
        "Delete this lecturer?"
      )
    ) {
      return;
    }

    try {
      await fetchWithAuth(
        `/api/admin/Lecturers/${id}`,
        {
          method: "DELETE",
        }
      );

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function openNewStudent() {
    setEditingStudent(null);
    setNewStudent(emptyStudent);
    setShowStudentModal(true);
  }

  function openEditStudent(student) {
    setEditingStudent(student);

    setNewStudent({
      studentNumber:
        student.studentNumber || "",
      name: student.name || "",
      surname:
        student.surname || "",
      email:
        student.email || "",
      password: "",
      gender:
        student.gender || "",
      dateOfBirth:
        student.dateOfBirth
          ? student.dateOfBirth.split(
              "T"
            )[0]
          : "",
      homeAddress:
        student.homeAddress || "",
      phoneNumber:
        student.phoneNumber || "",
      courseId:
        student.courseId || "",
    });

    setShowStudentModal(true);
  }

  async function saveStudent() {
    if (
      !newStudent.name.trim() ||
      !newStudent.studentNumber.trim() ||
      !newStudent.courseId
    ) {
      setError(
        "Name, student number and course are required."
      );
      return;
    }

    try {
      const payload = {
        ...newStudent,
        courseId: Number(
          newStudent.courseId
        ),
      };

      if (editingStudent) {
        await fetchWithAuth(
          `/api/admin/Students/${editingStudent.studentId}`,
          {
            method: "PUT",
            body: JSON.stringify(
              payload
            ),
          }
        );
      } else {
        await fetchWithAuth(
          "/api/admin/Students",
          {
            method: "POST",
            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      setShowStudentModal(false);
      setEditingStudent(null);
      setNewStudent(emptyStudent);

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteStudent(id) {
    if (
      !window.confirm(
        "Delete this student?"
      )
    ) {
      return;
    }

    try {
      await fetchWithAuth(
        `/api/admin/Students/${id}`,
        {
          method: "DELETE",
        }
      );

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <DashboardShell
      title="Admin dashboard"
      eyebrow="Academic management"
      navigation={[
        {
          label: "Overview",
          href: "#overview",
          icon: "dashboard",
        },
        {
          label: "Courses",
          href: "#courses",
          icon: "course",
        },
        {
          label: "Lecturers",
          href: "#lecturers",
          icon: "users",
        },
        {
          label: "Students",
          href: "#students",
          icon: "student",
        },
      ]}
      actions={
        <button
          className="button button--outline button--small topbar-action"
          onClick={loadData}
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

          <button
            onClick={() =>
              setError("")
            }
          >
            ×
          </button>
        </div>
      )}

      <section
        id="overview"
        className="dashboard-welcome"
      >
        <div>
          <span className="section-kicker">
            System overview
          </span>

          <h2>
            Keep your academic
            environment organised.
          </h2>

          <p>
            Manage the people,
            courses and structures
            that keep Educore moving.
          </p>
        </div>

        <button
          className="button button--primary"
          onClick={openNewCourse}
        >
          <Icon
            name="plus"
            size={18}
          />
          Add course
        </button>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <div className="stat-card__icon">
            <Icon
              name="course"
              size={24}
            />
          </div>

          <div>
            <span>
              Courses
            </span>
            <strong>
              {courses.length}
            </strong>
            <small>
              {assignedCourses} with
              lecturers
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
              Across all courses
            </small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-card__icon">
            <Icon
              name="users"
              size={24}
            />
          </div>

          <div>
            <span>
              Lecturers
            </span>
            <strong>
              {lecturers.length}
            </strong>
            <small>
              Academic staff
            </small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-card__icon">
            <Icon
              name="student"
              size={24}
            />
          </div>

          <div>
            <span>
              Students
            </span>
            <strong>
              {students.length}
            </strong>
            <small>
              Enrolled learners
            </small>
          </div>
        </article>
      </section>

      <section className="quick-actions">
        <button
          onClick={openNewCourse}
        >
          <span>
            <Icon
              name="plus"
              size={20}
            />
          </span>
          <div>
            <strong>
              New course
            </strong>
            <small>
              Create a new learning
              programme
            </small>
          </div>
        </button>

        <button
          onClick={() =>
            setShowAssignModal(true)
          }
        >
          <span>
            <Icon
              name="users"
              size={20}
            />
          </span>
          <div>
            <strong>
              Assign lecturer
            </strong>
            <small>
              Connect staff to a
              course
            </small>
          </div>
        </button>

        <button
          onClick={() =>
            setShowModuleModal(true)
          }
        >
          <span>
            <Icon
              name="layers"
              size={20}
            />
          </span>
          <div>
            <strong>
              Add module
            </strong>
            <small>
              Extend an existing
              course
            </small>
          </div>
        </button>

        <button
          onClick={openNewStudent}
        >
          <span>
            <Icon
              name="student"
              size={20}
            />
          </span>
          <div>
            <strong>
              Add student
            </strong>
            <small>
              Create a learner
              profile
            </small>
          </div>
        </button>
      </section>

      {loading ? (
        <div className="loading-panel">
          <div className="loader" />
          <strong>
            Loading Educore data...
          </strong>
          <span>
            Preparing your dashboard.
          </span>
        </div>
      ) : (
        <>
          <section
            id="courses"
            className="data-card"
          >
            <div className="data-card__header">
              <div>
                <span className="section-kicker">
                  Academic structure
                </span>

                <h2>Courses</h2>

                <p>
                  Manage courses,
                  lecturer assignments
                  and modules.
                </p>
              </div>

              <div className="section-actions">
                <button
                  className="button button--outline button--small"
                  onClick={() =>
                    setShowAssignModal(
                      true
                    )
                  }
                >
                  Assign lecturer
                </button>

                <button
                  className="button button--outline button--small"
                  onClick={() =>
                    setShowModuleModal(
                      true
                    )
                  }
                >
                  Add module
                </button>

                <button
                  className="button button--primary button--small"
                  onClick={
                    openNewCourse
                  }
                >
                  <Icon
                    name="plus"
                    size={17}
                  />
                  Add course
                </button>
              </div>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Lecturer</th>
                    <th>Modules</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {courses.map(
                    (course) => {
                      const modules =
                        course.modules
                          ?.$values ||
                        course.modules ||
                        [];

                      return (
                        <tr
                          key={
                            course.courseId
                          }
                        >
                          <td>
                            <div className="primary-cell">
                              <div className="table-icon">
                                <Icon
                                  name="course"
                                  size={
                                    18
                                  }
                                />
                              </div>

                              <div>
                                <strong>
                                  {
                                    course.courseName
                                  }
                                </strong>

                                <span>
                                  {course.description ||
                                    "No description provided"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <strong className="table-main-text">
                              {lecturerName(
                                course.lecturerId
                              )}
                            </strong>
                          </td>

                          <td>
                            <div className="chip-list">
                              {modules.length >
                              0 ? (
                                modules
                                  .slice(
                                    0,
                                    3
                                  )
                                  .map(
                                    (
                                      module
                                    ) => (
                                      <span
                                        className="chip"
                                        key={
                                          module.moduleId
                                        }
                                      >
                                        {
                                          module.moduleName
                                        }
                                      </span>
                                    )
                                  )
                              ) : (
                                <span className="table-muted">
                                  No modules
                                </span>
                              )}

                              {modules.length >
                                3 && (
                                <span className="chip chip--muted">
                                  +
                                  {modules.length -
                                    3}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <span
                              className={`status-pill ${
                                course.lecturerId
                                  ? "status-pill--success"
                                  : "status-pill--neutral"
                              }`}
                            >
                              {course.lecturerId
                                ? "Assigned"
                                : "Unassigned"}
                            </span>
                          </td>

                          <td>
                            <div className="table-actions">
                              <button
                                className="icon-button icon-button--soft"
                                title="Edit"
                                onClick={() =>
                                  openEditCourse(
                                    course
                                  )
                                }
                              >
                                <Icon
                                  name="edit"
                                  size={
                                    17
                                  }
                                />
                              </button>

                              <button
                                className="icon-button icon-button--danger"
                                title="Delete"
                                onClick={() =>
                                  deleteCourse(
                                    course.courseId
                                  )
                                }
                              >
                                <Icon
                                  name="trash"
                                  size={
                                    17
                                  }
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="lecturers"
            className="data-card"
          >
            <div className="data-card__header">
              <div>
                <span className="section-kicker">
                  Academic staff
                </span>

                <h2>Lecturers</h2>

                <p>
                  View and manage
                  teaching staff.
                </p>
              </div>

              <button
                className="button button--primary button--small"
                onClick={
                  openNewLecturer
                }
              >
                <Icon
                  name="plus"
                  size={17}
                />
                Add lecturer
              </button>
            </div>

            <div className="data-toolbar">
              <div className="search-box">
                <Icon
                  name="search"
                  size={18}
                />

                <input
                  placeholder="Search staff number, name or email..."
                  value={
                    searchLecturer
                  }
                  onChange={(event) =>
                    setSearchLecturer(
                      event.target.value
                    )
                  }
                />
              </div>

              <span className="result-count">
                {
                  filteredLecturers.length
                }{" "}
                lecturer
                {filteredLecturers.length ===
                1
                  ? ""
                  : "s"}
              </span>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lecturer</th>
                    <th>
                      Staff number
                    </th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Courses</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredLecturers.map(
                    (lecturer) => (
                      <tr
                        key={
                          lecturer.lecturerId
                        }
                      >
                        <td>
                          <div className="person-cell">
                            <div className="avatar avatar--table">
                              {(
                                lecturer.name?.[0] ||
                                ""
                              ).toUpperCase()}
                              {(
                                lecturer.surname?.[0] ||
                                ""
                              ).toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  lecturer.name
                                }{" "}
                                {
                                  lecturer.surname
                                }
                              </strong>

                              <span>
                                Lecturer
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="code-pill">
                            {
                              lecturer.staffNumber
                            }
                          </span>
                        </td>

                        <td>
                          {
                            lecturer.email
                          }
                        </td>

                        <td>
                          {lecturer.phoneNumber ||
                            "—"}
                        </td>

                        <td>
                          {(
                            lecturer.courses
                              ?.$values ||
                            lecturer.courses ||
                            []
                          ).length}
                        </td>

                        <td>
                          <div className="table-actions">
                            <button
                              className="icon-button icon-button--soft"
                              onClick={() =>
                                openEditLecturer(
                                  lecturer
                                )
                              }
                            >
                              <Icon
                                name="edit"
                                size={
                                  17
                                }
                              />
                            </button>

                            <button
                              className="icon-button icon-button--danger"
                              onClick={() =>
                                deleteLecturer(
                                  lecturer.lecturerId
                                )
                              }
                            >
                              <Icon
                                name="trash"
                                size={
                                  17
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="students"
            className="data-card"
          >
            <div className="data-card__header">
              <div>
                <span className="section-kicker">
                  Learners
                </span>

                <h2>Students</h2>

                <p>
                  Manage student
                  information and
                  course enrolment.
                </p>
              </div>

              <button
                className="button button--primary button--small"
                onClick={
                  openNewStudent
                }
              >
                <Icon
                  name="plus"
                  size={17}
                />
                Add student
              </button>
            </div>

            <div className="data-toolbar">
              <div className="search-box">
                <Icon
                  name="search"
                  size={18}
                />

                <input
                  placeholder="Search student number, name or email..."
                  value={
                    searchStudent
                  }
                  onChange={(event) =>
                    setSearchStudent(
                      event.target.value
                    )
                  }
                />
              </div>

              <span className="result-count">
                {
                  filteredStudents.length
                }{" "}
                student
                {filteredStudents.length ===
                1
                  ? ""
                  : "s"}
              </span>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Number</th>
                    <th>Course</th>
                    <th>Contact</th>
                    <th>Gender</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
                    (student) => (
                      <tr
                        key={
                          student.studentId
                        }
                      >
                        <td>
                          <div className="person-cell">
                            <div className="avatar avatar--table">
                              {(
                                student.name?.[0] ||
                                ""
                              ).toUpperCase()}
                              {(
                                student.surname?.[0] ||
                                ""
                              ).toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  student.name
                                }{" "}
                                {
                                  student.surname
                                }
                              </strong>

                              <span>
                                {
                                  student.email
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="code-pill">
                            {
                              student.studentNumber
                            }
                          </span>
                        </td>

                        <td>
                          {student.course
                            ?.courseName ||
                            courses.find(
                              (
                                course
                              ) =>
                                course.courseId ===
                                student.courseId
                            )
                              ?.courseName ||
                            "Not assigned"}
                        </td>

                        <td>
                          {student.phoneNumber ||
                            "—"}
                        </td>

                        <td>
                          {student.gender ||
                            "—"}
                        </td>

                        <td>
                          <div className="table-actions">
                            <button
                              className="icon-button icon-button--soft"
                              onClick={() =>
                                openEditStudent(
                                  student
                                )
                              }
                            >
                              <Icon
                                name="edit"
                                size={
                                  17
                                }
                              />
                            </button>

                            <button
                              className="icon-button icon-button--danger"
                              onClick={() =>
                                deleteStudent(
                                  student.studentId
                                )
                              }
                            >
                              <Icon
                                name="trash"
                                size={
                                  17
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <Modal
        open={showCourseModal}
        title={
          editingCourse
            ? "Edit course"
            : "Create course"
        }
        subtitle="Keep course information clear and easy to identify."
        onClose={() => {
          setShowCourseModal(false);
          setEditingCourse(null);
        }}
        footer={
          <>
            <button
              className="button button--ghost"
              onClick={() =>
                setShowCourseModal(
                  false
                )
              }
            >
              Cancel
            </button>

            <button
              className="button button--primary"
              onClick={saveCourse}
            >
              {editingCourse
                ? "Save changes"
                : "Create course"}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field-group form-grid__full">
            <label>
              Course name
            </label>

            <input
              className="field"
              value={
                newCourse.courseName
              }
              onChange={(event) =>
                setNewCourse({
                  ...newCourse,
                  courseName:
                    event.target.value,
                })
              }
              placeholder="e.g. Software Development"
            />
          </div>

          <div className="field-group form-grid__full">
            <label>
              Description
            </label>

            <textarea
              className="field field--textarea"
              value={
                newCourse.description
              }
              onChange={(event) =>
                setNewCourse({
                  ...newCourse,
                  description:
                    event.target.value,
                })
              }
              placeholder="Describe this course..."
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={showAssignModal}
        title="Assign lecturer"
        subtitle="Choose a lecturer to take responsibility for a course."
        onClose={() =>
          setShowAssignModal(false)
        }
        footer={
          <>
            <button
              className="button button--ghost"
              onClick={() =>
                setShowAssignModal(
                  false
                )
              }
            >
              Cancel
            </button>

            <button
              className="button button--primary"
              onClick={
                assignLecturer
              }
            >
              Assign lecturer
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field-group form-grid__full">
            <label>Course</label>

            <select
              className="field"
              value={
                assignData.courseId
              }
              onChange={(event) =>
                setAssignData({
                  ...assignData,
                  courseId:
                    event.target.value,
                })
              }
            >
              <option value="">
                Select course
              </option>

              {courses.map(
                (course) => (
                  <option
                    key={
                      course.courseId
                    }
                    value={
                      course.courseId
                    }
                  >
                    {
                      course.courseName
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div className="field-group form-grid__full">
            <label>
              Lecturer
            </label>

            <select
              className="field"
              value={
                assignData.lecturerId
              }
              onChange={(event) =>
                setAssignData({
                  ...assignData,
                  lecturerId:
                    event.target.value,
                })
              }
            >
              <option value="">
                Select lecturer
              </option>

              {lecturers.map(
                (lecturer) => (
                  <option
                    key={
                      lecturer.lecturerId
                    }
                    value={
                      lecturer.lecturerId
                    }
                  >
                    {lecturer.name}{" "}
                    {
                      lecturer.surname
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={showModuleModal}
        title="Add module"
        subtitle="Create a module inside an existing course."
        onClose={() =>
          setShowModuleModal(false)
        }
        footer={
          <>
            <button
              className="button button--ghost"
              onClick={() =>
                setShowModuleModal(
                  false
                )
              }
            >
              Cancel
            </button>

            <button
              className="button button--primary"
              onClick={addModule}
            >
              Add module
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field-group form-grid__full">
            <label>
              Module name
            </label>

            <input
              className="field"
              value={
                newModule.moduleName
              }
              onChange={(event) =>
                setNewModule({
                  ...newModule,
                  moduleName:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group form-grid__full">
            <label>
              Description
            </label>

            <textarea
              className="field field--textarea"
              value={
                newModule.description
              }
              onChange={(event) =>
                setNewModule({
                  ...newModule,
                  description:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group form-grid__full">
            <label>Course</label>

            <select
              className="field"
              value={
                newModule.courseId
              }
              onChange={(event) =>
                setNewModule({
                  ...newModule,
                  courseId:
                    event.target.value,
                })
              }
            >
              <option value="">
                Select course
              </option>

              {courses.map(
                (course) => (
                  <option
                    key={
                      course.courseId
                    }
                    value={
                      course.courseId
                    }
                  >
                    {
                      course.courseName
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={showLecturerModal}
        title={
          editingLecturer
            ? "Edit lecturer"
            : "Add lecturer"
        }
        subtitle="Maintain accurate staff information."
        onClose={() => {
          setShowLecturerModal(
            false
          );
          setEditingLecturer(null);
        }}
        wide
        footer={
          <>
            <button
              className="button button--ghost"
              onClick={() =>
                setShowLecturerModal(
                  false
                )
              }
            >
              Cancel
            </button>

            <button
              className="button button--primary"
              onClick={saveLecturer}
            >
              {editingLecturer
                ? "Save changes"
                : "Add lecturer"}
            </button>
          </>
        }
      >
        <div className="form-grid form-grid--two">
          <div className="field-group">
            <label>
              Staff number
            </label>

            <input
              className="field"
              value={
                newLecturer.staffNumber
              }
              onChange={(event) =>
                setNewLecturer({
                  ...newLecturer,
                  staffNumber:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>First name</label>

            <input
              className="field"
              value={
                newLecturer.name
              }
              onChange={(event) =>
                setNewLecturer({
                  ...newLecturer,
                  name:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>Surname</label>

            <input
              className="field"
              value={
                newLecturer.surname
              }
              onChange={(event) =>
                setNewLecturer({
                  ...newLecturer,
                  surname:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>Email</label>

            <input
              className="field"
              type="email"
              value={
                newLecturer.email
              }
              onChange={(event) =>
                setNewLecturer({
                  ...newLecturer,
                  email:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>
              Phone number
            </label>

            <input
              className="field"
              value={
                newLecturer.phoneNumber
              }
              onChange={(event) =>
                setNewLecturer({
                  ...newLecturer,
                  phoneNumber:
                    event.target.value,
                })
              }
            />
          </div>

          {!editingLecturer && (
            <div className="field-group">
              <label>Password</label>

              <input
                className="field"
                type="password"
                value={
                  newLecturer.password
                }
                onChange={(event) =>
                  setNewLecturer({
                    ...newLecturer,
                    password:
                      event.target.value,
                  })
                }
              />
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={showStudentModal}
        title={
          editingStudent
            ? "Edit student"
            : "Add student"
        }
        subtitle="Manage learner details and course enrolment."
        onClose={() => {
          setShowStudentModal(false);
          setEditingStudent(null);
        }}
        wide
        footer={
          <>
            <button
              className="button button--ghost"
              onClick={() =>
                setShowStudentModal(
                  false
                )
              }
            >
              Cancel
            </button>

            <button
              className="button button--primary"
              onClick={saveStudent}
            >
              {editingStudent
                ? "Save changes"
                : "Add student"}
            </button>
          </>
        }
      >
        <div className="form-grid form-grid--two">
          <div className="field-group">
            <label>
              Student number
            </label>

            <input
              className="field"
              value={
                newStudent.studentNumber
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  studentNumber:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>First name</label>

            <input
              className="field"
              value={
                newStudent.name
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  name:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>Surname</label>

            <input
              className="field"
              value={
                newStudent.surname
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  surname:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>Email</label>

            <input
              className="field"
              type="email"
              value={
                newStudent.email
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  email:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>Gender</label>

            <select
              className="field"
              value={
                newStudent.gender
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  gender:
                    event.target.value,
                })
              }
            >
              <option value="">
                Select gender
              </option>
              <option value="Male">
                Male
              </option>
              <option value="Female">
                Female
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="field-group">
            <label>
              Date of birth
            </label>

            <input
              className="field"
              type="date"
              value={
                newStudent.dateOfBirth
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  dateOfBirth:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group form-grid__full">
            <label>
              Home address
            </label>

            <input
              className="field"
              value={
                newStudent.homeAddress
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  homeAddress:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>
              Phone number
            </label>

            <input
              className="field"
              value={
                newStudent.phoneNumber
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  phoneNumber:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label>Course</label>

            <select
              className="field"
              value={
                newStudent.courseId
              }
              onChange={(event) =>
                setNewStudent({
                  ...newStudent,
                  courseId:
                    event.target.value,
                })
              }
            >
              <option value="">
                Select course
              </option>

              {courses.map(
                (course) => (
                  <option
                    key={
                      course.courseId
                    }
                    value={
                      course.courseId
                    }
                  >
                    {
                      course.courseName
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}