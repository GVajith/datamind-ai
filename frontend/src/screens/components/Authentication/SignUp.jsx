import { AlertCircle, Check } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getApiError, POSTAPI } from "../../../network/API";
import { authAPIRoutes } from "../../../network/Endpoints";
import { authenticate } from "../../store/actions";
import { Field, SubmitButton } from "./AuthForm";
import AuthShell from "./AuthShell";

const passwordRules = [
  ["10+ characters", (value) => value.length >= 10],
  ["Upper & lowercase", (value) => /[A-Z]/.test(value) && /[a-z]/.test(value)],
  ["Number & symbol", (value) => /\d/.test(value) && /[^A-Za-z0-9]/.test(value)],
];

export default function SignUp() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm_password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const updateField = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const mismatch = Boolean(form.confirm_password && form.password !== form.confirm_password);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.full_name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (mismatch || !passwordRules.every(([, check]) => check(form.password))) {
      setError(mismatch ? "Your passwords do not match yet." : "Please meet all three password requirements below.");
      return;
    }
    setBusy(true);
    try {
      const response = await POSTAPI(authAPIRoutes.register, { ...form, full_name: form.full_name.trim() });
      dispatch(authenticate(response.data.data));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell eyebrow="A FRESH START" title="Meet your next perspective." subtitle="Create a workspace. Bring a little curiosity. See what unfolds." footer={<>Already part of the story? <Link to="/sign-in">Sign in</Link></>}>
      <form onSubmit={submit} className="auth-form compact-form">
        {error && <div className="form-alert" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}
        <Field label="Full name" name="name" autoComplete="name" placeholder="Your full name" value={form.full_name} onChange={updateField("full_name")} minLength={2} maxLength={150} required />
        <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={updateField("email")} required />
        <Field label="Password" name="password" type="password" autoComplete="new-password" placeholder="Make it a strong one" value={form.password} onChange={updateField("password")} minLength={10} maxLength={128} required />
        <ul className="password-rules" aria-label="Password requirements">{passwordRules.map(([label, check]) => <li key={label} className={check(form.password) ? "rule-met" : ""}><Check size={12} />{label}</li>)}</ul>
        <Field label="Confirm password" name="confirm-password" type="password" autoComplete="new-password" placeholder="One more time" value={form.confirm_password} onChange={updateField("confirm_password")} minLength={10} maxLength={128} error={mismatch ? "Passwords don't match yet." : undefined} required />
        <SubmitButton busy={busy}>Create my workspace</SubmitButton>
        <p className="form-note">Free early access. No credit card required.</p>
      </form>
    </AuthShell>
  );
}
