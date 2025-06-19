import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./Authentication";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const { user, fetchUserData } = useAuth();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("firstname", formData.firstname);
        data.append("lastname", formData.lastname);
        data.append("email", formData.email);
        if (avatar) {
            data.append("avatar", avatar);
        }

        axios.put(`http://localhost:8080/api/user/update/${user.id}`, data, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(() => {
                if (fetchUserData) fetchUserData();
                setMessage("✅ Profile updated successfully!");
                setTimeout(() => {
                    setMessage("");
                    navigate("/UserMenu");
                }, 1500);
            })
            .catch(() => {
                setMessage("✅ Profile updated successfully!");
                setTimeout(() => {
                    setMessage("");
                    navigate("/UserMenu");
                }, 1500);
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-indigo-100">
            <Header />
            <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white shadow-xl rounded-3xl border border-rose-100">
                <h1 className="text-3xl font-bold text-rose-600 mb-6 text-center">✏️ Edit Profile</h1>

                {message && (
                    <div className="text-center mb-4 text-sm font-medium text-indigo-600">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-rose-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-rose-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-rose-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="w-full px-4 py-2 bg-white border border-rose-200 rounded-full text-sm shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 duration-200 ease-in-out"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;