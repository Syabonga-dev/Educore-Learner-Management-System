import React from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Icon from "../components/Icon.jsx";

const HERO_IMAGE = "/OIP.webp";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div
        className="landing-hero"
        style={{
          backgroundImage: `linear-gradient(
            90deg,
            rgba(7, 20, 39, 0.94) 0%,
            rgba(7, 20, 39, 0.82) 42%,
            rgba(7, 20, 39, 0.34) 74%,
            rgba(7, 20, 39, 0.16) 100%
          ), url("${HERO_IMAGE}")`,
        }}
      >
        <Navbar landing />

        <div className="landing-hero__content page-container">
          <div className="landing-hero__copy">
            <span className="hero-kicker">
              One connected learning space
            </span>

            <h1>
              Learn.
              <br />
              Teach.
              <br />
              <span>Move forward.</span>
            </h1>

            <p>
              Educore brings students,
              lecturers and academic
              administration into one
              simple learning management
              experience.
            </p>

            <div className="hero-actions">
              <button
                className="button button--primary button--large"
                onClick={() =>
                  navigate("/login")
                }
              >
                Access Educore

                <Icon
                  name="arrow"
                  size={19}
                />
              </button>

              <a
                href="#platform"
                className="button button--glass button--large"
              >
                Explore platform
              </a>
            </div>
          </div>

          <div className="hero-floating-card">
            <div className="hero-floating-card__icon">
              <Icon
                name="course"
                size={25}
              />
            </div>

            <div>
              <strong>
                Everything in one place
              </strong>

              <span>
                Courses, modules, tasks
                and progress.
              </span>
            </div>
          </div>
        </div>

        <div className="landing-hero__bottom page-container">
          <div>
            <strong>
              Built for learning
            </strong>
            <span>
              Focused. Clear. Connected.
            </span>
          </div>

          <div className="hero-scroll">
            <span>Discover more</span>
            <span className="hero-scroll__line" />
          </div>
        </div>
      </div>

      <section
        id="platform"
        className="landing-section landing-section--intro"
      >
        <div className="page-container">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">
              Built around the academic
              journey
            </span>

            <h2>
              One platform.
              <br />
              Less friction.
            </h2>

            <p>
              Educore keeps the important
              parts of learning visible,
              organised and easy to act
              on.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-card__number">
                01
              </div>

              <div className="feature-card__icon">
                <Icon
                  name="course"
                  size={28}
                />
              </div>

              <h3>
                Structured learning
              </h3>

              <p>
                Courses and modules stay
                organised so learners
                always know where they
                are.
              </p>
            </article>

            <article className="feature-card feature-card--dark">
              <div className="feature-card__number">
                02
              </div>

              <div className="feature-card__icon">
                <Icon
                  name="task"
                  size={28}
                />
              </div>

              <h3>
                Clear task progress
              </h3>

              <p>
                Students can see what is
                due and move work from
                not started to complete.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card__number">
                03
              </div>

              <div className="feature-card__icon">
                <Icon
                  name="users"
                  size={28}
                />
              </div>

              <h3>
                Connected roles
              </h3>

              <p>
                Admins, lecturers and
                students each get the
                tools relevant to their
                work.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="roles"
        className="landing-section landing-section--roles"
      >
        <div className="page-container roles-layout">
          <div className="roles-copy">
            <span className="section-kicker">
              Designed for everyone
            </span>

            <h2>
              Different roles.
              <br />
              One shared system.
            </h2>

            <p>
              Educore adapts to the
              responsibilities of every
              person in the learning
              environment.
            </p>

            <button
              className="button button--dark"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in to your workspace
              <Icon
                name="arrow"
                size={18}
              />
            </button>
          </div>

          <div className="role-list">
            <article className="role-row">
              <span className="role-row__index">
                01
              </span>

              <div>
                <h3>
                  Administrators
                </h3>
                <p>
                  Manage courses,
                  lecturers, students
                  and module structures.
                </p>
              </div>

              <Icon
                name="arrow"
                size={22}
              />
            </article>

            <article className="role-row">
              <span className="role-row__index">
                02
              </span>

              <div>
                <h3>
                  Lecturers
                </h3>
                <p>
                  View assigned courses,
                  work with modules and
                  create tasks.
                </p>
              </div>

              <Icon
                name="arrow"
                size={22}
              />
            </article>

            <article className="role-row">
              <span className="role-row__index">
                03
              </span>

              <div>
                <h3>
                  Students
                </h3>
                <p>
                  Track tasks, deadlines
                  and learning progress
                  from one dashboard.
                </p>
              </div>

              <Icon
                name="arrow"
                size={22}
              />
            </article>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="landing-cta"
      >
        <div className="page-container landing-cta__inner">
          <div>
            <span className="section-kicker section-kicker--light">
              Your learning space
            </span>

            <h2>
              Ready when you are.
            </h2>
          </div>

          <button
            className="button button--light button--large"
            onClick={() =>
              navigate("/login")
            }
          >
            Continue to Educore
            <Icon
              name="arrow"
              size={19}
            />
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
              <strong>Educore</strong>
              <small>
                Learning Management
                System
              </small>
            </span>
          </div>

          <p>
            Learning made clearer.
          </p>

          <span>
            © 2026 Educore
          </span>
        </div>
      </footer>
    </div>
  );
}