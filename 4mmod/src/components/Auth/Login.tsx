// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';

// // interface LoginPageProps {
// //   onLogin: (email: string, password: string) => boolean;
// // }

// // const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loginData, setLoginData] = useState({ email: '', password: '' });
// //   const [error, setError] = useState('');
// //   const navigate = useNavigate();

// //   const handleLogin = () => {
// //     if (loginData.email && loginData.password) {
// //       const success = onLogin(loginData.email, loginData.password);
// //       if (success) {
// //         navigate('/');
// //       } else {
// //         setError('Invalid credentials. Please try again.');
// //       }
// //     } else {
// //       setError('Please fill in all fields.');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
// //       {/* Left Side */}
// //       <div className="flex-1 flex items-center justify-center p-12">
// //         <div className="max-w-xl">
// //           <div className="flex items-center gap-3 mb-8">
// //             <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
// //               <Shield className="w-6 h-6 text-white" />
// //             </div>
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-800">NL Technologies Pvt. Ltd.</h1>
// //             </div>
// //           </div>
          
// //           <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //             4M Change Management
// //           </h2>
// //           <p className="text-gray-600 text-lg">
// //             Streamline your change processes with our comprehensive 4M solution for Man, Machine, Material, and Method management.
// //           </p>
          
// //           <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
// //             <img 
// //               src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" 
// //               alt="Management"
// //               className="w-full h-64 object-cover rounded-xl"
// //             />
// //           </div>
          
// //           <p className="mt-8 text-sm text-gray-500">NL Technologies Pvt Ltd</p>
// //         </div>
// //       </div>

// //       {/* Right Side - Login */}
// //       <div className="flex-1 flex items-center justify-center p-12">
// //         <div className="w-full max-w-md">
// //           <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-gradient-to-r from-blue-600 to-purple-600">
// //             <div className="flex justify-center mb-6">
// //               <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
// //                 <Shield className="w-8 h-8 text-white" />
// //               </div>
// //             </div>
            
// //             <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome</h2>
// //             <p className="text-center text-gray-600 mb-8">Sign in to your account</p>
            
// //             {error && (
// //               <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
// //                 {error}
// //               </div>
// //             )}
            
// //             <div className="space-y-6">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type="email"
// //                     value={loginData.email}
// //                     onChange={(e) => {
// //                       setLoginData({...loginData, email: e.target.value});
// //                       setError('');
// //                     }}
// //                     onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
// //                     className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     placeholder="you@company.com"
// //                   />
// //                 </div>
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type={showPassword ? "text" : "password"}
// //                     value={loginData.password}
// //                     onChange={(e) => {
// //                       setLoginData({...loginData, password: e.target.value});
// //                       setError('');
// //                     }}
// //                     onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
// //                     className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     placeholder="Enter your password"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                   >
// //                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                   </button>
// //                 </div>
// //               </div>
              
// //               <button
// //                 onClick={handleLogin}
// //                 className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
// //               >
// //                 Sign In
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginPage;
// // ====================================================================================================
// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
// // import { authAPI } from '../../services/api';

// // const LoginPage: React.FC = () => {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loginData, setLoginData] = useState({ email: '', password: '' });
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const handleLogin = async () => {
// //     if (!loginData.email || !loginData.password) {
// //       setError('Please fill in all fields.');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await authAPI.login(loginData.email, loginData.password);
      
// //       // Store tokens and user info
// //       localStorage.setItem('access_token', response.access);
// //       localStorage.setItem('refresh_token', response.refresh);
// //       localStorage.setItem('user', JSON.stringify({
// //         id: response.user_id,
// //         name: response.name,
// //         email: response.email,
// //         role: response.role,
// //         role_name: response.role_name,
// //         department: response.department,
// //       }));

// //       // Navigate to dashboard
// //       navigate('/');
// //     } catch (err: any) {
// //       console.error('Login error:', err);
// //       if (err.response?.status === 401) {
// //         setError('Invalid email or password.');
// //       } else if (err.response?.data?.detail) {
// //         setError(err.response.data.detail);
// //       } else {
// //         setError('Login failed. Please try again.');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
// //       {/* Left Side */}
// //       <div className="flex-1 flex items-center justify-center p-12">
// //         <div className="max-w-xl">
// //           <div className="flex items-center gap-3 mb-8">
// //             <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
// //               <Shield className="w-6 h-6 text-white" />
// //             </div>
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-800">NL Technologies Pvt. Ltd.</h1>
// //             </div>
// //           </div>
          
// //           <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //             4M Change Management
// //           </h2>
// //           <p className="text-gray-600 text-lg">
// //             Streamline your change processes with our comprehensive 4M solution for Man, Machine, Material, and Method management.
// //           </p>
          
// //           <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
// //             <img 
// //               src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" 
// //               alt="Management"
// //               className="w-full h-64 object-cover rounded-xl"
// //             />
// //           </div>
          
// //           <p className="mt-8 text-sm text-gray-500">NL Technologies Pvt Ltd</p>
// //         </div>
// //       </div>

// //       {/* Right Side - Login */}
// //       <div className="flex-1 flex items-center justify-center p-12">
// //         <div className="w-full max-w-md">
// //           <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-gradient-to-r from-blue-600 to-purple-600">
// //             <div className="flex justify-center mb-6">
// //               <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
// //                 <Shield className="w-8 h-8 text-white" />
// //               </div>
// //             </div>
            
// //             <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome</h2>
// //             <p className="text-center text-gray-600 mb-8">Sign in to your account</p>
            
// //             {error && (
// //               <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
// //                 {error}
// //               </div>
// //             )}
            
// //             <div className="space-y-6">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type="email"
// //                     value={loginData.email}
// //                     onChange={(e) => {
// //                       setLoginData({...loginData, email: e.target.value});
// //                       setError('');
// //                     }}
// //                     onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
// //                     className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     placeholder="you@company.com"
// //                     disabled={loading}
// //                   />
// //                 </div>
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type={showPassword ? "text" : "password"}
// //                     value={loginData.password}
// //                     onChange={(e) => {
// //                       setLoginData({...loginData, password: e.target.value});
// //                       setError('');
// //                     }}
// //                     onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
// //                     className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     placeholder="Enter your password"
// //                     disabled={loading}
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                   >
// //                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                   </button>
// //                 </div>
// //               </div>
              
// //               <button
// //                 onClick={handleLogin}
// //                 disabled={loading}
// //                 className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 {loading ? 'Signing in...' : 'Sign In'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginPage;

// // src/components/Auth/Login.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
// import { authAPI } from '../../services/api';
// import { useAuth } from '../../contexts/AuthContext';

// const LoginPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginData, setLoginData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleLogin = async () => {
//     if (!loginData.email || !loginData.password) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await authAPI.login(loginData.email, loginData.password);
      
//       // Use the login function from AuthContext
//       login(
//         {
//           id: response.user_id,
//           name: response.name,
//           email: response.email,
//           role: response.role,
//           role_name: response.role_name,
//           role_code: response.role_code,
//           department: response.department,
//           is_superuser: response.is_superuser,
//         },
//         {
//           access: response.access,
//           refresh: response.refresh,
//         }
//       );

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
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'; // removed Shield if not needed
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import companyLogo from '../../assets/logo.png';

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

      login(
        {
          id: response.user_id,
          name: response.name,
          email: response.email,
          role: response.role,
          role_name: response.role_name,
          role_code: response.role_code,
          department: response.department,
          is_superuser: response.is_superuser,
        },
        {
          access: response.access,
          refresh: response.refresh,
        }
      );

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
    <div 
      className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex"
    >
      {/* Left Side - Branding + Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:p-8 xl:p-12 bg-gradient-to-br from-blue-600/5 to-purple-600/5">
        <div className="max-w-2xl w-full space-y-8 xl:space-y-10">
          <div className="text-center">
            <h1 className="text-4xl xl:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              4M Change Management
            </h1>
            <p className="mt-3 text-lg xl:text-xl text-gray-700 font-medium">
              NL Technologies Pvt. Ltd.
            </p>
            <p className="mt-5 text-gray-600 text-base xl:text-lg max-w-lg mx-auto leading-relaxed">
              Streamline your change processes with our comprehensive 4M solution for
              <span className="font-semibold text-blue-700"> Man, Machine, Material, and Method</span>.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop"
              alt="4M Change Management Illustration"
              className="w-full h-[380px] xl:h-[480px] object-cover"
            />
          </div>

          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} NL Technologies Pvt Ltd
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border-t-4 border-gradient-to-r from-blue-600 to-purple-600">

            {/* === Company Logo at the top of login card === */}
           {/* === Company Logo at the top of login card === */}
{/* <div className="flex justify-center mb-6">
  <div className="w-30 h-30 sm:w-32 sm:h-32 bg-white rounded-xl shadow-md p- border border-gray-200 flex items-center justify-center">
    <img
      src={companyLogo}
      alt="NL Technologies Logo"
      className="max-w-full max-h-full object-contain"
    />
  </div>
</div> */}

<div className="flex justify-center mb-6">
  <img
    src={companyLogo}
    alt="NL Technologies Logo"
    className="h-10 sm:h-15 md:h-15 w-auto object-contain"  // height controls size, width auto
  />
</div>

            {/* Mobile branding text (optional - can remove if logo is enough) */}
            <div className="lg:hidden text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">4M Change Management</h2>
              <p className="text-gray-600 text-sm mt-1">NL Technologies</p>
            </div>

            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome </h2>
            <p className="text-center text-gray-600 mb-8">Sign in to continue</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => {
                      setLoginData({ ...loginData, email: e.target.value });
                      setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full pl-12 pr-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="you@company.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({ ...loginData, password: e.target.value });
                      setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full pl-12 pr-14 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;