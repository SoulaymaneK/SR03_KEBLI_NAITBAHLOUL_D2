import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Authentication";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-gradient-to-r from-rose-100 via-pink-100 to-indigo-100 shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">

                {/* Logo Whispy */}
                <Link to="/userMenu" className="flex items-center space-x-2">
                    <img
                        src="logo.png"
                        alt="Whispy"
                        className="w-10 h-10 rounded-full shadow-md"
                    />
                    <span className="text-2xl font-bold text-rose-600 hover:text-rose-700 transition transform hover:scale-105 duration-200 ease-in-out hidden sm:inline">
                        Whispy
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex flex-wrap justify-center gap-3 text-sm font-medium">
                    <Link
                        to="/userMenu"
                        className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-white text-rose-600 border border-rose-200 shadow-sm transition transform hover:scale-105"
                    >
                        Home
                    </Link>
                    <Link
                        to="/accueil"
                        className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-white text-rose-600 border border-rose-200 shadow-sm transition transform hover:scale-105"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/myChatRooms"
                        className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-white text-rose-600 border border-rose-200 shadow-sm transition transform hover:scale-105"
                    >
                        MyChats
                    </Link>
                    <Link
                        to="/invitedChatrooms"
                        className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-white text-rose-600 border border-rose-200 shadow-sm transition transform hover:scale-105"
                    >
                        My Invitations
                    </Link>
                    <Link
                        to="/profile"
                        className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-white text-rose-600 border border-rose-200 shadow-sm transition transform hover:scale-105"
                    >
                        Profil
                    </Link>
                </nav>

                {/* Infos utilisateur + logout */}
                <div className="flex items-center gap-3">
                    {user && (
                        <span className="text-sm text-gray-700 hidden sm:inline">
                            {user.firstname} {user.lastname}
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-1.5 rounded-full bg-rose-400 hover:bg-rose-500 text-white text-sm shadow transition transform hover:scale-105"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
