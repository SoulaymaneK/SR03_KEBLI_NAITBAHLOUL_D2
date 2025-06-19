import React from "react";
import { useAuth } from "./Authentication";
import Header from "./Header";
import { Link } from "react-router-dom";

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-rose-600 bg-rose-50 font-medium">
                Please log in to view your profile.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-indigo-100">
            <Header />
            <div className="max-w-xl mx-auto mt-12 px-6 py-10 bg-white rounded-3xl shadow-xl border border-rose-100">
                <h1 className="text-3xl font-bold text-center text-rose-600 mb-6">👤 My Profile</h1>

                <div className="flex flex-col items-center space-y-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
                        <img
                            src={`http://localhost:8080${user.avatarUrl}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Informations */}
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {user.firstname} {user.lastname}
                        </h2>
                        <p className="text-gray-600 italic">{user.email}</p>
                        {user.isAdmin && (
                            <span className="text-sm font-medium bg-rose-100 text-rose-700 px-3 py-1 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <Link
                        to="/editProfile"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full shadow transition transform hover:scale-105 duration-200 ease-in-out"
                    >
                        Edit Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
