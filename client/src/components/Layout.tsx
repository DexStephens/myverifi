import { Outlet } from "react-router-dom";
import HomeHeader from "./HomeHeader";

const Layout = () => {
  return (
    <>
      <HomeHeader showBackButton={true} />
      <Outlet />
    </>
  );
};

export default Layout;
