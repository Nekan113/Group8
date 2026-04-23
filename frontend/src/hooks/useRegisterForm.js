import { useMemo, useState } from "react";
import { getPasswordChecks, validateEmail, validatePassword, validateUsername } from "../utils/validators";

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
};

export function useRegisterForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const passwordChecks = useMemo(() => getPasswordChecks(form.password), [form.password]);

  const errors = useMemo(() => {
    const passwordValidation = validatePassword(form.password);

    return {
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      password: !form.password ? "Password is required." : passwordValidation.message,
      confirmPassword:
        !form.confirmPassword
          ? "Confirm Password is required."
          : form.password !== form.confirmPassword
            ? "Passwords do not match."
            : "",
      country: form.country ? "" : "Please select a country.",
    };
  }, [form]);

  const hasErrors = Object.values(errors).some(Boolean);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit() {
    setSubmitted(true);
    return !hasErrors;
  }

  return {
    form,
    errors,
    submitted,
    hasErrors,
    passwordChecks,
    updateField,
    submit,
  };
}