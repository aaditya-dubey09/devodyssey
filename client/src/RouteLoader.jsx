import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function RouteLoader() {
    const location = useLocation();

    useEffect(() => {
        NProgress.start();
        const timer = setTimeout(() => {
            NProgress.done();
        }, 500);
        return () => clearTimeout(timer);
    }, [location]);

    return null;
}

export default RouteLoader