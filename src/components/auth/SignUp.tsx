import { useState } from "react";
import { setAlert, AlertType, text, signUp } from "../../states";
import style from "./Auth.module.scss";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signUp(email, password);
      setAlert({
        type: AlertType.Success,
        message: text.value.auth.signUp.alert.success,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setAlert({
        type: AlertType.Error,
        message: (err as Error).message,
      });
    }
  };

  if (success) {
    return navigate("/sign-up/confirm?email=" + email);
  }

  return (
    <div className={style["form-container"]}>
      <form onSubmit={handleSubmit} className={style["form"]}>
        <h1>Sign Up</h1>
        <input
          type="email"
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
        <button type="submit">Sign Up</button>
        <div>
          <p>
            Already have an account?{" "}
            <a onClick={() => navigate("/sign-in")}>Sign In</a>
          </p>
        </div>
      </form>
    </div>
  );
};
