import { Link } from "react-router";

export default function HomeHeader() {
  return (
    <div
      style={{
        backgroundColor: "gray",
        height: "4rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2rem",
        position: "sticky",
        top: "0",
        zIndex: "1",
      }}
    >
      <p>myverifi</p>
      <Link to="/login">Login</Link>
    </div>
  );
}
