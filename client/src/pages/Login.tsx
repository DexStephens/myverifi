import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate("/dashboard");
  };
  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="username" />
      <input type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
  );
}
