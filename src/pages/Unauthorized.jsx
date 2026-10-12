import React from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Icon from "../components/Icon.jsx";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="system-page">
      <Navbar />

      <main className="system-page__content">
        <div className="system-card">
          <div className="system-card__icon">
            <Icon
              name="shield"
              size={34}
            />
          </div>

          <span className="section-kicker">
            Access restricted
          </span>

          <h1>
            This workspace isn't
            available to your account.
          </h1>

          <p>
            Your current Educore role
            does not have permission
            to open this page.
          </p>

          <div className="system-card__actions">
            <button
              className="button button--primary"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              Go to my dashboard
              <Icon
                name="arrow"
                size={18}
              />
            </button>

            <button
              className="button button--ghost"
              onClick={() =>
                navigate("/")
              }
            >
              Return home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}