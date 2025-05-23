import { useState } from "react";
import { setAlert, AlertType, text, signIn } from "../../states";
import style from "./Auth.module.scss";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signIn(email, password);
      navigate("/");
      setAlert({
        type: AlertType.Success,
        message: text.value.auth.signIn.alert.success,
      });
    } catch (err) {
      if ((err as Error).message === "User is not confirmed.") {
        navigate("/sign-up/confirm?email=" + email);
      }
      setAlert({
        type: AlertType.Error,
        message: (err as Error).message,
      });
    }
  };

  return (
    <div className={style["form-container"]}>
      <form onSubmit={handleSubmit} className={style["form"]}>
        <h1>Welcome back</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
        <div>
          <p>
            Don't have an account?{" "}
            <a onClick={() => navigate("/sign-up")}>Sign up</a>
          </p>
          <p>
            Forgot your password?{" "}
            <a onClick={() => navigate("/forgot-password")}>Reset</a>
          </p>
        </div>
      </form>
    </div>
  );
}
