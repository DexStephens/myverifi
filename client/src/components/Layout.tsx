import { Outlet } from "react-router-dom";
import HomeHeader from "./HomeHeader";

const Layout = () => {
  return (
    <>
      <HomeHeader />
      <Outlet />
    </>
  );
};

export default Layout;
