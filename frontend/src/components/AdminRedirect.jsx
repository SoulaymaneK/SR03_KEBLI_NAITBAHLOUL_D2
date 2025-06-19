import { useEffect } from 'react';

const AdminRedirect = () => {
    useEffect(() => {
        window.location.href = 'http://localhost:8080/admin';
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-indigo-100">
            <div className="text-center">
                <p className="text-lg text-rose-600 font-medium animate-pulse">
                    Redirecting to Admin...
                </p>
            </div>
        </div>
    );
};

export default AdminRedirect;
