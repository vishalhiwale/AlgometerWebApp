import { useState } from 'react';
import { EyeIcon, EyeOffIcon, Stethoscope } from 'lucide-react';
import api from "../services/api";
import axios  from 'axios';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  // onLogin: (name: string) => void;
  switchToSignup: () => void;
}

export function Login({ 
  // onLogin,
  switchToSignup 
  }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);

    try{

      const { data } = await api.post("/auth/login", {
        email, password,
      });
      // console.log("Data: ",data);

      login(data.token, data.user);

    } catch( err ){

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Unexpected error");
      }

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="justify-between">
            <div>
                <h1 className="text-gray-600 mb-3 w-full">Doctor Portal Login</h1>
            </div>
            <div className="flex felx-cols items-center mb-2">
                <div className="bg-blue-600 p-4 rounded-full mb-4">
                    <Stethoscope className="w-8 h-8 text-white"/>
                </div>

                <h1 className="text-gray-900 mb-4 text-xl px-6">Welcome</h1>
            </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label> */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent"
              placeholder="Email"
              required
            />
          {/* </div> */}

          {/* <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label> */}
            <div className="relative flex items-center w-full border border-gray-300
                            rounded-lg focus-within:ring-2 focus-within:ring-blue-500 
                            focus-within:border-transparent">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg focus:outline-none"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

          {/* </div> */}

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Create Account Option*/}
          <div className='text-center mt-4'>
            <span className='text-gray-500'>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={switchToSignup}
              className='ml-2 text-blue-600 hover:underline'
            >
              Create Account
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
