import { useState } from "react";
import { setAlert, AlertType } from "../../states";
import { CognitoService } from "../../services";
import { useNavigate } from "react-router-dom";
import style from "./Auth.module.scss";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await CognitoService.forgotPassword(email);
      setSuccess(true);
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
        <h2>Reset password</h2>
        <p>
          Check your email for the confirmation code to reset your password.
        </p>
      </div>
    );
  }

  return (
    <div className={style["form-container"]}>
      <form onSubmit={handleSubmit} className={style["form"]}>
        <h1>Forgot Password</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Reset password</button>
        <div>
          <p>
            Or try to <a onClick={() => navigate("/sign-in")}>Sign In</a>
          </p>
        </div>
      </form>
    </div>
  );
}
