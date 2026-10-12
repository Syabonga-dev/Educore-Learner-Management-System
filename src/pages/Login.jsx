import React, { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  login,
  setToken,
} from "../services/auth";

import Navbar from "../components/Navbar.jsx";

const LOGIN_IMAGE = "/images.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  async function submit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(
        email,
        password
      );

      if (!data?.token) {
        throw new Error(
          "No authentication token was returned."
        );
      }

      setToken(data.token);

      const role =
        data.authRole?.toLowerCase();

      if (role === "admin") {
        navigate(
          "/dashboard/admin",
          { replace: true }
        );
      } else if (role === "lecturer") {
        navigate(
          "/dashboard/lecturer",
          { replace: true }
        );
      } else if (role === "student") {
        navigate(
          "/dashboard/student",
          { replace: true }
        );
      } else {
        navigate(
          "/unauthorized",
          { replace: true }
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <Navbar />

      <main className="auth-page">
        <section
          className="auth-visual"
          style={{
            backgroundImage: `linear-gradient(
              rgba(22, 31, 27, 0.28),
              rgba(22, 31, 27, 0.78)
            ), url("${LOGIN_IMAGE}")`,
          }}
        >
          <div className="auth-visual__copy">
            <p className="hero-kicker">
              EDUCORE
            </p>

            <h1>
              Academic access in one place.
            </h1>

            <p>
              Sign in to manage courses,
              modules, academic tasks and
              student progress.
            </p>
          </div>
        </section>

        <section className="auth-form-side">
          <div className="auth-form-wrap">
            <Link
              to="/"
              className="auth-back-link"
            >
              ← Back to home
            </Link>

            <div className="auth-heading">
              <p className="section-kicker">
                ACCOUNT ACCESS
              </p>

              <h2>
                Sign in
              </h2>

              <p>
                Enter your Educore email
                address and password.
              </p>
            </div>

            {error && (
              <div className="alert alert--danger">
                <div>
                  <strong>
                    Sign in failed
                  </strong>

                  <span>
                    {error}
                  </span>
                </div>
              </div>
            )}

            <form
              className="auth-form"
              onSubmit={submit}
            >
              <div className="field-group">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  className="field"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="password-field">
                  <input
                    id="password"
                    className="field"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              <button
                className="button button--primary button--full"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}