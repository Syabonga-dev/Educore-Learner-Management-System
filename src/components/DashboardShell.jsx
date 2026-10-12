import React, {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getUserFromToken,
  logout,
} from "../services/auth";

import Icon from "./Icon.jsx";

function initials(email) {
  if (!email) {
    return "EU";
  }

  return email
    .split("@")[0]
    .split(/[._-]/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardShell({
  title,
  eyebrow,
  children,
  navigation = [],
  actions,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromToken();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const role = Array.isArray(user?.role)
    ? user.role[0]
    : user?.role;

  function signOut() {
    logout();
    navigate("/login");
  }

  function handleNavigation(item) {
    if (item.href?.startsWith("#")) {
      const target =
        document.querySelector(
          item.href
        );

      target?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setSidebarOpen(false);
      return;
    }

    if (item.path) {
      navigate(item.path);
      setSidebarOpen(false);
    }
  }

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <button
          className="dashboard-overlay"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "dashboard-sidebar--open"
            : ""
        }`}
      >
        <div className="dashboard-sidebar__brand">
          <button
            className="brand brand--sidebar"
            onClick={() =>
              navigate("/")
            }
          >
            <span className="brand__mark">
              E
            </span>

            <span className="brand__text">
              <strong>Educore</strong>
              <small>LMS</small>
            </span>
          </button>

          <button
            className="dashboard-sidebar__close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Icon
              name="close"
              size={20}
            />
          </button>
        </div>

        <div className="dashboard-sidebar__role">
          <span>
            {role || "User"}
          </span>
          workspace
        </div>

        <nav className="dashboard-nav">
          {navigation.map((item) => {
            const active =
              item.path &&
              location.pathname ===
                item.path;

            return (
              <button
                key={
                  item.label
                }
                className={`dashboard-nav__item ${
                  active
                    ? "dashboard-nav__item--active"
                    : ""
                }`}
                onClick={() =>
                  handleNavigation(
                    item
                  )
                }
              >
                <Icon
                  name={
                    item.icon ||
                    "dashboard"
                  }
                  size={19}
                />

                <span>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="dashboard-sidebar__bottom">
          <div className="sidebar-user">
            <div className="avatar avatar--small">
              {initials(
                user?.email
              )}
            </div>

            <div className="sidebar-user__details">
              <strong>
                {role || "User"}
              </strong>

              <span>
                {user?.email}
              </span>
            </div>
          </div>

          <button
            className="dashboard-signout"
            onClick={signOut}
          >
            <Icon
              name="logout"
              size={18}
            />
            Sign out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <button
              className="mobile-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Icon
                name="menu"
                size={22}
              />
            </button>

            <div>
              {eyebrow && (
                <span className="page-eyebrow">
                  {eyebrow}
                </span>
              )}

              <h1>{title}</h1>
            </div>
          </div>

          <div className="dashboard-topbar__actions">
            {actions}

            <div className="topbar-profile">
              <div className="avatar">
                {initials(
                  user?.email
                )}
              </div>

              <div className="topbar-profile__text">
                <strong>
                  {role || "User"}
                </strong>
                <span>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}