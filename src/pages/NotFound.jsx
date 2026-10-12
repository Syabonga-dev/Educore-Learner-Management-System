import React from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Icon from "../components/Icon.jsx";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="system-page">
      <Navbar />

      <main className="system-page__content">
        <div className="system-card">
          <span className="error-number">
            404
          </span>

          <span className="section-kicker">
            Page not found
          </span>

          <h1>
            Looks like this page
            moved on without us.
          </h1>

          <p>
            The page you're looking
            for does not exist or is
            no longer available.
          </p>

          <button
            className="button button--primary"
            onClick={() =>
              navigate("/")
            }
          >
            Back to Educore
            <Icon
              name="arrow"
              size={18}
            />
          </button>
        </div>
      </main>
    </div>
  );
}