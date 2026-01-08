// import React, { useState } from 'react';
// import { Eye, EyeOff, Edit2, Trash2, X, Shield } from 'lucide-react';

// const UserManagement: React.FC = () => {
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [showPasswordInModal, setShowPasswordInModal] = useState(false);
//   const [users, setUsers] = useState<Array<{
//     id: number;
//     name: string;
//     email: string;
//     role: string;
//     department: string;
//     status: string;
//     created: string;
//   }>>([]);
//   const [newUser, setNewUser] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: '',
//     department: '',
//     status: 'Active'
//   });

//   const handleAddUser = () => {
//     if (newUser.name && newUser.email && newUser.password && newUser.role && newUser.department) {
//       const user = {
//         id: users.length + 1,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//         department: newUser.department,
//         status: newUser.status,
//         created: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
//       };
//       setUsers([...users, user]);
//       setNewUser({ name: '', email: '', password: '', role: '', department: '', status: 'Active' });
//       setShowAddUserModal(false);
//     }
//   };

//   const deleteUser = (id: number) => {
//     setUsers(users.filter(u => u.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
//             <p className="text-gray-600 mt-1">Manage system users and permissions</p>
//           </div>
//           <button
//             onClick={() => setShowAddUserModal(true)}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
//           >
//             <span className="text-xl">+</span>
//             Add User
//           </button>
//         </div>

//         {/* User Table */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">User</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Role</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Department</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Created</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {users.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
//                     No users added yet. Click "Add User" to create your first user.
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                           {user.name.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <div className="font-semibold text-gray-800">{user.name}</div>
//                           <div className="text-sm text-gray-500">{user.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-700">{user.department}</td>
//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">{user.created}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                           <Edit2 className="w-4 h-4" />
//                         </button>
//                         <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
//                           <Shield className="w-4 h-4" />
//                         </button>
//                         <button 
//                           onClick={() => deleteUser(user.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add User Modal */}
//       {showAddUserModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
//               <h3 className="text-2xl font-bold text-gray-800">Add New User</h3>
//               <button
//                 onClick={() => setShowAddUserModal(false)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                 <input
//                   type="text"
//                   value={newUser.name}
//                   onChange={(e) => setNewUser({...newUser, name: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter full name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                 <input
//                   type="email"
//                   value={newUser.email}
//                   onChange={(e) => setNewUser({...newUser, email: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="user@company.com"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                 <div className="relative">
//                   <input
//                     type={showPasswordInModal ? "text" : "password"}
//                     value={newUser.password}
//                     onChange={(e) => setNewUser({...newUser, password: e.target.value})}
//                     className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPasswordInModal(!showPasswordInModal)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPasswordInModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//                 <select
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({...newUser, role: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select role</option>
//                   <option value="Admin">Admin</option>
//                   <option value="Employee">Employee</option>
//                   <option value="Supervisor">Supervisor</option>
//                   <option value="Plant Head">Plant Head</option>
//                   <option value="Manager">Manager</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                 <input
//                   type="text"
//                   value={newUser.department}
//                   onChange={(e) => setNewUser({...newUser, department: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter department"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                 <select
//                   value={newUser.status}
//                   onChange={(e) => setNewUser({...newUser, status: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={() => setShowAddUserModal(false)}
//                   className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddUser}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
//                 >
//                   Add User
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Edit2, Trash2, X, Shield } from 'lucide-react';
import { userAPI, roleAPI } from '../../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: number;
  role_name: string;
  role_code: string;
  department: string;
  is_active: boolean;
  created_at: string;
}

interface Role {
  id: number;
  code: string;
  name: string;
}

const UserManagement: React.FC = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    department: '',
    is_active: true
  });

  // Fetch users and roles on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await roleAPI.getAllRoles();
      setRoles(data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role || !newUser.department) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await userAPI.createUser({
        email: newUser.email,
        name: newUser.name,
        password: newUser.password,
        role: parseInt(newUser.role),
        department: newUser.department,
        is_active: newUser.is_active
      });
      
      // Refresh users list
      await fetchUsers();
      
      // Reset form and close modal
      setNewUser({ name: '', email: '', password: '', role: '', department: '', is_active: true });
      setShowAddUserModal(false);
      setError('');
    } catch (err: any) {
      console.error('Error adding user:', err);
      if (err.response?.data) {
        const errors = err.response.data;
        const errorMessages = Object.entries(errors)
          .map(([key, value]: [string, any]) => `${key}: ${value}`)
          .join(', ');
        setError(errorMessages);
      } else {
        setError('Failed to add user');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userAPI.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">Manage system users and permissions</p>
          </div>
          <button
            onClick={() => {
              setShowAddUserModal(true);
              setError('');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <span className="text-xl">+</span>
            Add User
          </button>
        </div>

        {/* Error Display */}
        {error && !showAddUserModal && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No users added yet. Click "Add User" to create your first user.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {user.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Shield className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Add New User</h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPasswordInModal ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordInModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newUser.is_active ? 'true' : 'false'}
                  onChange={(e) => setNewUser({...newUser, is_active: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setError('');
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;