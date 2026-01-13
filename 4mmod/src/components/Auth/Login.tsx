// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';

// interface LoginPageProps {
//   onLogin: (email: string, password: string) => boolean;
// }

// const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginData, setLoginData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (loginData.email && loginData.password) {
//       const success = onLogin(loginData.email, loginData.password);
//       if (success) {
//         navigate('/');
//       } else {
//         setError('Invalid credentials. Please try again.');
//       }
//     } else {
//       setError('Please fill in all fields.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
//       {/* Left Side */}
//       <div className="flex-1 flex items-center justify-center p-12">
//         <div className="max-w-xl">
//           <div className="flex items-center gap-3 mb-8">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <Shield className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">NL Technologies Pvt. Ltd.</h1>
//             </div>
//           </div>
          
//           <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             4M Change Management
//           </h2>
//           <p className="text-gray-600 text-lg">
//             Streamline your change processes with our comprehensive 4M solution for Man, Machine, Material, and Method management.
//           </p>
          
//           <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
//             <img 
//               src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" 
//               alt="Management"
//               className="w-full h-64 object-cover rounded-xl"
//             />
//           </div>
          
//           <p className="mt-8 text-sm text-gray-500">NL Technologies Pvt Ltd</p>
//         </div>
//       </div>

//       {/* Right Side - Login */}
//       <div className="flex-1 flex items-center justify-center p-12">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-gradient-to-r from-blue-600 to-purple-600">
//             <div className="flex justify-center mb-6">
//               <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
//                 <Shield className="w-8 h-8 text-white" />
//               </div>
//             </div>
            
//             <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome</h2>
//             <p className="text-center text-gray-600 mb-8">Sign in to your account</p>
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}
            
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="email"
//                     value={loginData.email}
//                     onChange={(e) => {
//                       setLoginData({...loginData, email: e.target.value});
//                       setError('');
//                     }}
//                     onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//                     className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="you@company.com"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={loginData.password}
//                     onChange={(e) => {
//                       setLoginData({...loginData, password: e.target.value});
//                       setError('');
//                     }}
//                     onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//                     className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>
              
//               <button
//                 onClick={handleLogin}
//                 className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
//               >
//                 Sign In
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
// ====================================================================================================
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
// import { authAPI } from '../../services/api';

// const LoginPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginData, setLoginData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     if (!loginData.email || !loginData.password) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await authAPI.login(loginData.email, loginData.password);
      
//       // Store tokens and user info
//       localStorage.setItem('access_token', response.access);
//       localStorage.setItem('refresh_token', response.refresh);
//       localStorage.setItem('user', JSON.stringify({
//         id: response.user_id,
//         name: response.name,
//         email: response.email,
//         role: response.role,
//         role_name: response.role_name,
//         department: response.department,
//       }));

//       // Navigate to dashboard
//       navigate('/');
//     } catch (err: any) {
//       console.error('Login error:', err);
//       if (err.response?.status === 401) {
//         setError('Invalid email or password.');
//       } else if (err.response?.data?.detail) {
//         setError(err.response.data.detail);
//       } else {
//         setError('Login failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
//       {/* Left Side */}
//       <div className="flex-1 flex items-center justify-center p-12">
//         <div className="max-w-xl">
//           <div className="flex items-center gap-3 mb-8">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <Shield className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">NL Technologies Pvt. Ltd.</h1>
//             </div>
//           </div>
          
//           <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             4M Change Management
//           </h2>
//           <p className="text-gray-600 text-lg">
//             Streamline your change processes with our comprehensive 4M solution for Man, Machine, Material, and Method management.
//           </p>
          
//           <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
//             <img 
//               src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" 
//               alt="Management"
//               className="w-full h-64 object-cover rounded-xl"
//             />
//           </div>
          
//           <p className="mt-8 text-sm text-gray-500">NL Technologies Pvt Ltd</p>
//         </div>
//       </div>

//       {/* Right Side - Login */}
//       <div className="flex-1 flex items-center justify-center p-12">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-gradient-to-r from-blue-600 to-purple-600">
//             <div className="flex justify-center mb-6">
//               <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
//                 <Shield className="w-8 h-8 text-white" />
//               </div>
//             </div>
            
//             <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome</h2>
//             <p className="text-center text-gray-600 mb-8">Sign in to your account</p>
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}
            
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="email"
//                     value={loginData.email}
//                     onChange={(e) => {
//                       setLoginData({...loginData, email: e.target.value});
//                       setError('');
//                     }}
//                     onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//                     className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="you@company.com"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={loginData.password}
//                     onChange={(e) => {
//                       setLoginData({...loginData, password: e.target.value});
//                       setError('');
//                     }}
//                     onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//                     className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter your password"
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>
              
//               <button
//                 onClick={handleLogin}
//                 disabled={loading}
//                 className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// src/components/Auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(loginData.email, loginData.password);
      
      // Use the login function from AuthContext
      login(
        {
          id: response.user_id,
          name: response.name,
          email: response.email,
          role: response.role,
          role_name: response.role_name,
          department: response.department,
          is_superuser: response.is_superuser,
        },
        {
          access: response.access,
          refresh: response.refresh,
        }
      );

      // Navigate to dashboard
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Left Side */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">NL Technologies Pvt. Ltd.</h1>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            4M Change Management
          </h2>
          <p className="text-gray-600 text-lg">
            Streamline your change processes with our comprehensive 4M solution for Man, Machine, Material, and Method management.
          </p>
          
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" 
              alt="Management"
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
          
          <p className="mt-8 text-sm text-gray-500">NL Technologies Pvt Ltd</p>
        </div>
      </div>

      {/* Right Side - Login */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome</h2>
            <p className="text-center text-gray-600 mb-8">Sign in to your account</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => {
                      setLoginData({...loginData, email: e.target.value});
                      setError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({...loginData, password: e.target.value});
                      setError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;