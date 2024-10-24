// 관리자 권한 라우터

import { useEffect, useState } from "react";
import { GetIsUserAdmin } from "../user/GetIsUserAdmin";
import { Outlet } from "react-router"
import NotFound from "../../pages/etc/NotFound";
import Loading from "../etc/Loading";

const AdminRoute = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    
    useEffect(() => {
        GetIsUserAdmin(setIsAdmin);
    }, []);

    return(
        <>
        {isAdmin === null ? <Loading /> : isAdmin === true ?
            <Outlet />
            :
            <NotFound />    
        }
        </>
    );
}

export default AdminRoute;