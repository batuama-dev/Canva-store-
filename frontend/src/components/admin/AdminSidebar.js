import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin</h2>
      <nav>
        <ul>
          <li>
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => 
                `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : ''}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/products"
              className={({ isActive }) => 
                `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : ''}`
              }
            >
              Gérer les produits
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/messages"
              className={({ isActive }) => 
                `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : ''}`
              }
            >
              Gérer les messages
            </NavLink>
          </li>
          {/* Add more admin links here later */}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
