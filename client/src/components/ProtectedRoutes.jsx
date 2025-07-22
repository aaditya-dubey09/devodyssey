import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector(
        (state) => state.authReducer
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) navigate('/login')
    }, [isAuthenticated, loading, navigate]);

    return children;
};

export default ProtectedRoute;
