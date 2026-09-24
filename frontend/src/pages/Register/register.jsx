import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./register.module.css";

import { registerUser } from "../../module/auth/authApi.js";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  const validateForm = () => {
    const errors = {};

    // Full name validation
    if (!formData.full_name.trim()) {
      errors.full_name = "Full name is required.";
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name =
        "Full name must contain at least 2 characters.";
    } else if (formData.full_name.trim().length > 100) {
      errors.full_name =
        "Full name cannot exceed 100 characters.";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      errors.email = "Enter a valid email address.";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password =
        "Password must contain at least 8 characters.";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword =
        "Passwords do not match.";
    }

    return errors;
  };

  // --------------------------------------------------
  // Register
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setFormData({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setFormErrors({});

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.registerPage}>
      <div className={styles.backgroundShapeOne} />
      <div className={styles.backgroundShapeTwo} />

      <section className={styles.registerContainer}>

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

        {/* Register Card */}

        <div className={styles.registerCard}>

          <div className={styles.cardHeader}>
            <h2>Create your account</h2>

            <p>
              Create an account to start managing
              your projects and tasks.
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

          {/* Success */}

          {success && (
            <div
              className={styles.successMessage}
              role="status"
            >
              {success}
            </div>
          )}

          {/* Form */}

          <form
            className={styles.registerForm}
            onSubmit={handleSubmit}
          >

            {/* Full Name */}

            <div className={styles.formGroup}>
              <label htmlFor="register-full-name">
                Full name
              </label>

              <input
                id="register-full-name"
                name="full_name"
                type="text"
                autoComplete="name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
              />

              {formErrors.full_name && (
                <span className={styles.fieldError}>
                  {formErrors.full_name}
                </span>
              )}
            </div>

            {/* Email */}

            <div className={styles.formGroup}>
              <label htmlFor="register-email">
                Email address
              </label>

              <input
                id="register-email"
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
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                disabled={loading}
              />

              {formErrors.password && (
                <span className={styles.fieldError}>
                  {formErrors.password}
                </span>
              )}
            </div>

            {/* Confirm Password */}

            <div className={styles.formGroup}>
              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                disabled={loading}
              />

              {formErrors.confirmPassword && (
                <span className={styles.fieldError}>
                  {formErrors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit */}

            <button
              type="submit"
              className={styles.registerButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className={styles.spinner}
                  />

                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>

          </form>

          {/* Login link */}

          <div className={styles.loginLink}>
            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
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

export default Register;