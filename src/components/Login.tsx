import { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import SignUp from "./SignUp";
import { ref, get } from "firebase/database";
import { db } from "../firebase";

interface LoginProps {
  onLogin: (name: string, uid: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');

  //   // Mock authentication - in production, this would connect to a backend
  //   if (email && password) {
  //     // Extract doctor name from email
  //     const name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  //      
  //   } else {
  //     setError('Please enter both email and password');
  //   }
  // };
  if (isSignup) {
  return <SignUp onBack={() => setIsSignup(false)} />;
}

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("LOGIN UID:", userCredential.user.uid);

    // const name =
    //   userCredential.user.email?.split("@")[0]
    //     .replace(".", " ")
    //     .replace(/\b\w/g, (l) => l.toUpperCase()) || "Doctor";

    // onLogin(name);
// inside handleSubmit after login success:
    const user = userCredential.user;

// fetch doctor data from database
    const snapshot = await get(ref(db, "doctors/" + user.uid));

    let name = "Doctor";

    if (snapshot.exists()) {
      const data = snapshot.val();
      name = data.name;
    }

    onLogin(name, user.uid);


  } catch (error: any) {
  console.log("Firebase error:", error.code);
  setError(error.message);
}
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-full mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 text-center">YourHealth</h1>
          <p className="text-gray-600 mt-2 text-center">Doctor Portal Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="doctor@hospital.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>

          {/* <div className="text-center text-sm text-gray-500 mt-4">
            Demo credentials: Use any email and password
          </div> */}
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
