import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Icon from "../components/Icon.jsx";

const HERO_IMAGE = "/images.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <section
        className="landing-hero"
        style={{
          backgroundImage: `linear-gradient(
            90deg,
            rgba(20, 29, 25, 0.88) 0%,
            rgba(20, 29, 25, 0.70) 48%,
            rgba(20, 29, 25, 0.22) 100%
          ), url("${HERO_IMAGE}")`,
        }}
      >
        <Navbar landing />

        <div className="page-container landing-hero__content">
          <div className="landing-hero__copy">
            <p className="hero-kicker">
              EDUCORE LEARNING MANAGEMENT SYSTEM
            </p>

            <h1>
              Learning and teaching,
              organised in one place.
            </h1>

            <p className="landing-hero__description">
              Educore helps students, lecturers and administrators
              manage courses, modules and academic tasks from one
              system.
            </p>

            <div className="hero-actions">
              <button
                className="button button--primary button--large"
                onClick={() => navigate("/login")}
              >
                Sign in
                <Icon name="arrow" size={18} />
              </button>

              <a
                href="#about"
                className="button button--hero-secondary button--large"
              >
                About Educore
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="landing-section landing-section--intro"
      >
        <div className="page-container">
          <div className="section-heading">
            <p className="section-kicker">
              ABOUT THE PLATFORM
            </p>

            <h2>
              A simple system for academic management.
            </h2>

            <p>
              Educore provides separate workspaces for administrators,
              lecturers and students while keeping course information
              in one central system.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <Icon name="course" size={25} />

              <h3>
                Course management
              </h3>

              <p>
                Administrators can create courses, add modules and
                assign lecturers.
              </p>
            </article>

            <article className="feature-card">
              <Icon name="task" size={25} />

              <h3>
                Academic tasks
              </h3>

              <p>
                Lecturers can create tasks for students enrolled in
                their assigned courses.
              </p>
            </article>

            <article className="feature-card">
              <Icon name="student" size={25} />

              <h3>
                Student progress
              </h3>

              <p>
                Students can view their work and update the progress
                of each task.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="roles"
        className="landing-section landing-section--roles"
      >
        <div className="page-container">
          <div className="section-heading">
            <p className="section-kicker">
              USER ROLES
            </p>

            <h2>
              Each user sees the tools they need.
            </h2>
          </div>

          <div className="role-grid">
            <article className="role-card">
              <span className="role-card__label">
                ADMIN
              </span>

              <h3>
                Administrator
              </h3>

              <p>
                Manage students, lecturers, courses and modules.
              </p>
            </article>

            <article className="role-card">
              <span className="role-card__label">
                LECTURER
              </span>

              <h3>
                Lecturer
              </h3>

              <p>
                View assigned courses and create academic tasks.
              </p>
            </article>

            <article className="role-card">
              <span className="role-card__label">
                STUDENT
              </span>

              <h3>
                Student
              </h3>

              <p>
                View assigned tasks and record task progress.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-access">
        <div className="page-container landing-access__inner">
          <div>
            <p className="section-kicker">
              EDUCORE ACCESS
            </p>

            <h2>
              Sign in to continue.
            </h2>

            <p>
              Use the account issued for your Educore role.
            </p>
          </div>

          <button
            className="button button--light button--large"
            onClick={() => navigate("/login")}
          >
            Go to login
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="page-container landing-footer__inner">
          <div className="brand brand--footer">
            <span className="brand__mark">
              E
            </span>

            <span className="brand__text">
              <strong>
                Educore
              </strong>

              <small>
                Learning Management System
              </small>
            </span>
          </div>

          <p>
            © 2026 Educore
          </p>
        </div>
      </footer>
    </div>
  );
}