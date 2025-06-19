import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Authentication";

const UserMenu = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-100 to-indigo-100 px-4 py-8 flex items-center justify-center">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-rose-200 rounded-3xl shadow-2xl p-6 space-y-8">

                {/* Header Utilisateur avec logo */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 text-white flex items-center justify-center font-bold text-xl shadow-inner">
                            {user?.firstname?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {user ? `Hello, ${user.firstname}` : "Welcome!"}
                            </h2>
                            {user && (
                                <p className="text-sm text-gray-600">
                                    {user.lastname} · <span className="italic">{user.email}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Logo Whispy à droite */}
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-300 shadow-md">
                        <img
                            src="logo.png"
                            alt="Whispy Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <div className="space-y-3">
                    <SectionTitle title="Navigation" />
                    <MenuButton to="/accueil" text="🏠 Dashboard" color="rose" />
                    <MenuButton to="/myChatrooms" text="💬 My Chatrooms" color="purple" />
                    <MenuButton to="/invitedChatrooms" text="📨 My Invitations" color="indigo" />
                    <MenuButton to="/profile" text="👤 Profil" color="pink" />
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-rose-100">
                    <SectionTitle title="Actions" />
                    <MenuButton to="/createChatroom" text="➕ Create Chatroom" color="pink" />
                    <MenuButton to="/editProfile" text="✏️ Modifier Profil" color="indigo" />
                </div>

                {/* Logout */}
                <div className="pt-4 border-t border-rose-100">
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105 duration-200 ease-in-out"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

const MenuButton = ({ to, text, color }) => {
    const colorClasses = {
        rose: "bg-rose-400 hover:bg-rose-500",
        pink: "bg-pink-400 hover:bg-pink-500",
        indigo: "bg-indigo-400 hover:bg-indigo-500",
        purple: "bg-purple-400 hover:bg-purple-500",
    };

    return (
        <Link
            to={to}
            className={`block w-full text-center py-2 text-white font-medium rounded-xl shadow-md transition transform hover:scale-105 duration-200 ease-in-out ${colorClasses[color]}`}
        >
            {text}
        </Link>
    );
};

const SectionTitle = ({ title }) => (
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</h3>
);

export default UserMenu;
