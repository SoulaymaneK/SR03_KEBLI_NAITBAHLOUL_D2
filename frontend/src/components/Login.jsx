import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './Authentication';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                if (result.data.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/userMenu');
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error while logging in. Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-100 to-indigo-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl border border-rose-100 px-8 py-10 w-full max-w-md"
            >
                {/* Logo centré */}
                <div className="flex justify-center mb-6">
                    <img
                        src="logo.png"
                        alt="Whispy Logo"
                        className="w-24 h-24 rounded-full border-4 border-pink-200 shadow-lg object-cover"
                    />
                </div>

                <h1 className="text-3xl font-bold text-center text-rose-500 mb-8">
                    Welcome Back
                </h1>

                <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100"
                    />
                </div>

                <div className="text-center text-sm mb-4">
                    <Link to="/forgot-password" className="text-rose-500 hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-semibold bg-rose-400 hover:bg-rose-500 text-white transition disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 duration-200 ease-in-out shadow"
                >
                    {isLoading ? 'Connecting...' : 'Login'}
                </button>

                {error && (
                    <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
                )}

                <div className="mt-6 text-center text-sm text-gray-600">
                    No account yet?{" "}
                    <Link to="/register" className="text-rose-500 hover:underline">
                        Register here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
