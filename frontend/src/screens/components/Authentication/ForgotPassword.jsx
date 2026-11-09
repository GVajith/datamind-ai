import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { getApiError, POSTAPI } from "../../../network/API";
import { authAPIRoutes } from "../../../network/Endpoints";
import { Field, SubmitButton } from "./AuthForm";
import AuthShell from "./AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await POSTAPI(authAPIRoutes.forgotPassword, { email });
      setSubmitted(true);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell eyebrow="LET’S GET YOU BACK IN" title="A fresh start for your password." subtitle="Enter the email you use for DataMind to request a password reset." footer={<Link to="/sign-in">Back to sign in</Link>}>
      {submitted ? (
        <div className="recovery-success" role="status">
          <CheckCircle2 size={30} /><h3>Request received.</h3>
          <p>Email delivery is not connected in this preview. Contact your workspace administrator to complete the reset.</p>
          <button className="text-link" onClick={() => setSubmitted(false)}>Use a different email</button>
        </div>
      ) : (
        <form onSubmit={submit} className="auth-form">
          {error && <div className="form-alert" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}
          <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <SubmitButton busy={busy}>Request a password reset</SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
