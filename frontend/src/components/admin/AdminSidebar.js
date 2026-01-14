import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 transform transition-transform z-30 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : ''}`
                }
                onClick={handleLinkClick}
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
                onClick={handleLinkClick}
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
                onClick={handleLinkClick}
              >
                Gérer les messages
              </NavLink>
            </li>
            {/* Add more admin links here later */}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
