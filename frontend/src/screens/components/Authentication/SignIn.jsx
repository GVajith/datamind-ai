import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getApiError, POSTAPI } from "../../../network/API";
import { authAPIRoutes } from "../../../network/Endpoints";
import { authenticate } from "../../store/actions";
import { Field, SubmitButton } from "./AuthForm";
import AuthShell from "./AuthShell";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await POSTAPI(authAPIRoutes.login, form);
      dispatch(authenticate(response.data.data));
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell eyebrow="WELCOME BACK" title="A little closer to clarity." subtitle="Sign in and pick up where your curiosity left off." footer={<>New around here? <Link to="/sign-up">Create an account</Link></>}>
      <form onSubmit={submit} className="auth-form">
        {error && <div className="form-alert" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}
        <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <div className="form-meta"><span>Welcome to your workspace.</span><Link to="/forgot-password">Forgot password?</Link></div>
        <SubmitButton busy={busy}>Sign in to DataMind</SubmitButton>
      </form>
    </AuthShell>
  );
}
