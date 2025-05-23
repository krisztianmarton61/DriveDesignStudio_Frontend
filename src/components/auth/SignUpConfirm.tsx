import { useEffect, useState } from "react";
import {
  setAlert,
  AlertType,
  text,
  confirmSignUp,
  resendConfirmationCode,
} from "../../states";
import style from "./Auth.module.scss";
import { useLocation, useNavigate } from "react-router-dom";

export function SignUpConfirm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (codeSent) {
      setAlert({
        type: AlertType.Success,
        message: text.value.auth.signUpResend.alert.success,
      });
      setCodeSent(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeSent]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await confirmSignUp(email, code);
      setAlert({
        type: AlertType.Success,
        message: text.value.auth.signUpConfirm.alert.success,
      });
      setSuccess(true);
    } catch (err) {
      setAlert({
        type: AlertType.Error,
        message: (err as Error).message,
      });
    }
  };

  const handleResendConfirmationCode = async () => {
    try {
      await resendConfirmationCode(email);
      setCodeSent(true);
    } catch (err) {
      setAlert({
        type: AlertType.Error,
        message: (err as Error).message,
      });
    }
  };

  if (success) {
    return (
      <div>
        <h2>Confirmation successful!</h2>
        <p>You can now sign in with your credentials.</p>
        <button type="button" onClick={() => navigate("/sign-in")}>
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className={style["form-container"]}>
      <h2>Confirm Sign Up</h2>
      <form onSubmit={handleSubmit} className={style["form"]}>
        <input
          disabled
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Confirmation code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Confirm</button>

        <div>
          <p>
            The confirmation code did not arrived?{" "}
            <a onClick={() => handleResendConfirmationCode()}>Resend</a>
          </p>
        </div>
      </form>
    </div>
  );
}
