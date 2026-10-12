import React from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getUserFromToken,
  isAuthenticated,
  logout,
} from "../services/auth";

import Icon from "./Icon.jsx";

function dashboardPath(role) {
  switch ((role || "").toLowerCase()) {
    case "admin":
      return "/dashboard/admin";

    case "lecturer":
      return "/dashboard/lecturer";

    case "student":
      return "/dashboard/student";

    default:
      return "/dashboard";
  }
}

export default function Navbar({
  landing = false,
}) {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = authenticated
    ? getUserFromToken()
    : null;

  const role = Array.isArray(user?.role)
    ? user.role[0]
    : user?.role;

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <header
      className={
        landing
          ? "public-navbar public-navbar--landing"
          : "public-navbar"
      }
    >
      <div className="public-navbar__inner">
        <Link
          to="/"
          className="brand"
        >
          <span className="brand__mark">
            E
          </span>

          <span className="brand__text">
            <strong>Educore</strong>
            <small>Learning Management System</small>
          </span>
        </Link>

        <nav className="public-navbar__links">
          <a href="/#platform">
            Platform
          </a>

          <a href="/#roles">
            For everyone
          </a>

          <a href="/#about">
            About
          </a>
        </nav>

        <div className="public-navbar__actions">
          {authenticated ? (
            <>
              <button
                className="button button--ghost button--small"
                onClick={() =>
                  navigate(
                    dashboardPath(role)
                  )
                }
              >
                Dashboard
              </button>

              <button
                className="button button--dark button--small"
                onClick={signOut}
              >
                <Icon
                  name="logout"
                  size={17}
                />
                Sign out
              </button>
            </>
          ) : (
            <button
              className="button button--dark button--small"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in
              <Icon
                name="arrow"
                size={17}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}