import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  login,
  setToken,
} from "../services/auth";

import Icon from "../components/Icon.jsx";

const LOGIN_IMAGE = "/OIP.webp";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

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
      } else if (
        role === "lecturer"
      ) {
        navigate(
          "/dashboard/lecturer",
          { replace: true }
        );
      } else if (
        role === "student"
      ) {
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
    <div className="auth-page">
      <section
        className="auth-visual"
        style={{
          backgroundImage: `linear-gradient(
            180deg,
            rgba(8, 23, 44, 0.24),
            rgba(8, 23, 44, 0.88)
          ), url("${LOGIN_IMAGE}")`,
        }}
      >
        <Link
          to="/"
          className="brand brand--light"
        >
          <span className="brand__mark">
            E
          </span>

          <span className="brand__text">
            <strong>Educore</strong>
            <small>
              Learning Management System
            </small>
          </span>
        </Link>

        <div className="auth-visual__copy">
          <span className="hero-kicker">
            Welcome back
          </span>

          <h1>
            Your learning space,
            ready when you are.
          </h1>

          <p>
            Continue to your personalised
            Educore workspace.
          </p>
        </div>

        <span className="auth-visual__footer">
          Learn. Teach. Move forward.
        </span>
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
            <span className="section-kicker">
              Secure access
            </span>

            <h2>Sign in</h2>

            <p>
              Enter your Educore account
              details to continue.
            </p>
          </div>

          {error && (
            <div className="alert alert--danger">
              <div>
                <strong>
                  Sign in unsuccessful
                </strong>

                <span>{error}</span>
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
                autoComplete="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="password">
                  Password
                </label>
              </div>

              <div className="password-field">
                <input
                  id="password"
                  className="field"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
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
              className="button button--primary button--full button--large"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in"}

              {!loading && (
                <Icon
                  name="arrow"
                  size={18}
                />
              )}
            </button>
          </form>

          <div className="auth-security-note">
            <Icon
              name="shield"
              size={18}
            />

            <span>
              Your account is protected
              through secure role-based
              access.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}