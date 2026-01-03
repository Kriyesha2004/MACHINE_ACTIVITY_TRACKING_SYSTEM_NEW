import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');


  const handleAuth = async () => {
    setError('');



    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your name');
      return;
    }

    const endpoint = isLogin ? 'login' : 'register';

    const body: any = { email, password };
    if (!isLogin) body.name = name;

    try {
      const response = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      if (isLogin) {
        const data = await response.json();
        login(data.user, data.access_token);
        navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
      } else {
        // Auto login after register or ask to login
        setIsLogin(true);
        setError('Registration successful! Please sign in.');
        setPassword('');
      }

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MATRIX System</h1>
          <p className="text-gray-400">Maintenance Management System</p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{isLogin ? 'Sign In' : 'Sign Up'}</h2>

          {/* Role Selection */}


          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Name
              </label>
              <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-blue-500 transition-colors">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-transparent text-white outline-none w-full placeholder-gray-600"
                />
              </div>
            </div>
          )}

          {/* Email Input - Editable now */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email
            </label>
            <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-blue-500 transition-colors">
              <Mail size={20} className="text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-transparent text-white outline-none w-full placeholder-gray-600"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-blue-500 transition-colors">
              <Lock size={20} className="text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter password"
                className="bg-transparent text-white outline-none w-full placeholder-gray-600"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 flex items-center gap-3 ${error.includes('successful') ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-lg p-3`}>
              <AlertCircle size={20} className={error.includes('successful') ? 'text-green-400' : 'text-red-400 shrink-0'} />
              <p className={error.includes('successful') ? 'text-green-400' : 'text-red-400 text-sm'}>{error}</p>
            </div>
          )}

          {/* Auth Button */}
          <button
            onClick={handleAuth}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 mb-4"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          {/* Toggle Login/Signup */}
          <div className="text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          © 2024 MATRIX System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

