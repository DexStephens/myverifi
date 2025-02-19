import { useNavigate } from "react-router";
import { useEffect } from "react";
import HomeHeader from "../components/HomeHeader";
import { useUser } from "../context/UserContext";
import { IssuerDashboard } from "../components/IssuerDashboard";
import { HolderDashboard } from "../components/HolderDashboard";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <HomeHeader showBackButton={false} />
      {user.issuer ? <IssuerDashboard /> : <HolderDashboard />}
    </>
  );
}
