import { useEffect, useState } from "react";
import { GetIsUserAdmin } from "../user/GetIsUserAdmin";
import { Outlet, useNavigate } from "react-router"
import NotFound from "../../pages/etc/NotFound";

const AdminRoute = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        GetIsUserAdmin(setIsAdmin);
    }, []);

    return(
        <>
        {isAdmin === true ?
            <Outlet />
            :
            <NotFound />    
        }
        </>
    );
}

export default AdminRoute;