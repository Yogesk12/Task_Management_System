import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./login.module.css";
import { saveToken } from "../../utils/authStorage.js";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  getUserStart,
  getUserSuccess,
  getUserFailure,
} from "../../module/auth/authSlice.js";

import {
  loginUser,
  getCurrentUser,
} from "../../module/auth/authApi.js";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // --------------------------------------------------
  // Input change
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      errors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    return errors;
  };

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    dispatch(loginStart());

    try {
      // Login API
      const tokenResponse = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const token = tokenResponse.access_token;
      saveToken(token);
      dispatch(
        loginSuccess({
          token,
          user: null,
        })
      );

      // Get current user
      dispatch(getUserStart());

      const user = await getCurrentUser(token);

      dispatch(getUserSuccess(user));

      // Navigate after successful authentication
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Invalid email or password.";

      dispatch(loginFailure(message));
    }
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.backgroundShapeOne} />
      <div className={styles.backgroundShapeTwo} />

      <section className={styles.loginContainer}>
        {/* Brand */}

        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            ✓
          </div>

          <div>
            <h1>TaskFlow</h1>

            <p>
              Task Management System
            </p>
          </div>
        </div>

        {/* Login Card */}

        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <h2>Welcome back</h2>

            <p>
              Sign in to manage your projects and
              tasks.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div
              className={styles.errorMessage}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Form */}

          <form
            className={styles.loginForm}
            onSubmit={handleSubmit}
          >
            {/* Email */}

            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
              />

              {formErrors.email && (
                <span className={styles.fieldError}>
                  {formErrors.email}
                </span>
              )}
            </div>

            {/* Password */}

            <div className={styles.formGroup}>
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
              />

              {formErrors.password && (
                <span className={styles.fieldError}>
                  {formErrors.password}
                </span>
              )}
            </div>

            {/* Submit */}

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className={styles.spinner}
                  />

                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo information */}

          <div className={styles.securityNote}>
            <span className={styles.securityIcon}>
              🔒
            </span>

            <span>
              Your session is securely authenticated
              using JWT.
            </span>
          </div>

          <div className={styles.registerLink}>
            <span>Don't have an account?</span>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Footer */}

        <p className={styles.footer}>
          TaskFlow · Task Management System
        </p>
      </section>
    </main>
  );
}

export default Login;