import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleImageChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const form = new FormData();
            form.append("firstname", formData.firstname);
            form.append("lastname", formData.lastname);
            form.append("email", formData.email);
            form.append("password", formData.password);
            if (avatar) {
                form.append("avatar", avatar);
            }

            await axios.post("http://localhost:8080/api/user/register", form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setSuccess('Account successfully registered!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Email address already exists!');
            } else {
                setError("Registration error. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-100 to-indigo-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl border border-rose-100 px-8 py-10 w-full max-w-md space-y-6"
            >
                {/* Logo */}
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
                    <img
                        src="logo.png"
                        alt="Whispy Logo"
                        className="w-full h-full object-cover"
                    />
                </div>

                <h1 className="text-3xl font-bold text-center text-rose-500">
                    Create your account
                </h1>

                {['firstname', 'lastname', 'email', 'password'].map((field, idx) => (
                    <div key={idx}>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {field}
                        </label>
                        <input
                            id={field}
                            type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            placeholder={`Your ${field}`}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                    </div>
                ))}

                <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                        Avatar (optional)
                    </label>
                    <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-semibold bg-rose-400 hover:bg-rose-500 text-white transition disabled:bg-gray-400 transform hover:scale-105 duration-200 ease-in-out"
                >
                    Register
                </button>

                {error && <p className="text-red-600 text-center font-medium">{error}</p>}
                {success && <p className="text-green-600 text-center font-medium">{success}</p>}

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-rose-500 hover:underline">
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
