import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { IssuerDashboard } from "../components/IssuerDashboard";
import { HolderDashboard } from "../components/HolderDashboard";

export default function Dashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) return <div>Loading...</div>; // Show a loading indicator

  if (!user) {
    return null;
  } else if (user.issuer) {
    return <IssuerDashboard />;
  } else {
    return <HolderDashboard />;
  }
}
