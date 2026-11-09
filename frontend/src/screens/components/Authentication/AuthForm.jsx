import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

import Loader from "../../common/Loader/Loader";

export function Field({ label, error, hint, type = "text", ...props }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const password = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="field-input-wrap">
        <input {...props} id={id} type={password && visible ? "text" : type} className={`field-input ${password ? "password-input" : ""}`} aria-invalid={Boolean(error)} aria-describedby={describedBy} />
        {password && <button type="button" onClick={() => setVisible(!visible)} className="password-toggle" aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
      </div>
      {error && <span id={`${id}-error`} className="field-error">{error}</span>}
      {!error && hint && <span id={`${id}-hint`} className="field-hint">{hint}</span>}
    </div>
  );
}

export function SubmitButton({ busy, children }) {
  return <button type="submit" disabled={busy} className="button button-teal form-submit">{busy ? <Loader label="Please wait..." /> : <>{children}<ArrowRight size={17} /></>}</button>;
}
