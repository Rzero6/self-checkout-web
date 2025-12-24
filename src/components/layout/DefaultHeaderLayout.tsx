import { Outlet } from "react-router-dom";
import { Header } from "./Header";

function HeaderLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default HeaderLayout;
