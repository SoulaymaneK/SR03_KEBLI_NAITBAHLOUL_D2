import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Authentication';

const PrivateRoute = ({ children, requireAdmin = false }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-lg text-gray-600">Verifying session...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !user.isAdmin) {
        return <Navigate to="/userMenu" replace />;
    }

    return children;
};

export default PrivateRoute;
