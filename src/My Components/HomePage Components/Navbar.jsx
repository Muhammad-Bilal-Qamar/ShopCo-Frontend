// import React from "react";

// const Navbar = () => {
//   return (
//     <nav className="bg-white shadow-sm border-b border-gray-100 font-['Integral_CF']">
//       <div className="flex items-center justify-between gap-4 max-w-[1240px] h-16 mx-auto px-4 md:px-6">
//         <div className="flex items-center gap-10">
//           <div className="text-3xl font-black tracking-tight">SHOP.CO</div>

//           <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700">
//             <select
//               id="fruit-select"
//               className="bg-transparent cursor-pointer outline-none font-medium"
//             >
//               <option value="">Shop</option>
//             </select>
//             <a href="#" className="hover:text-black transition-colors">
//               On Sale
//             </a>
//             <a href="#" className="hover:text-black transition-colors">
//               New Arrivals
//             </a>
//             <a href="#" className="hover:text-black transition-colors">
//               Brands
//             </a>
//           </div>
//         </div>

//         <div className="flex-1 max-w-[600px] mx-4">
//           <div className="relative flex items-center">
//             <svg
//               className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search for products..."
//               className="w-full bg-gray-100 text-gray-800 pl-12 pr-4 py-2.5 rounded-full text-sm outline-none focus:bg-gray-200/70 transition-all"
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="p-1 hover:opacity-70 transition-opacity">
//             <img src="src/assets/Cart.svg" alt="Cart" className="w-6 h-6" />
//           </button>
//           <button className="p-1 hover:opacity-70 transition-opacity">
//             <img
//               src="src/assets/Profile.svg"
//               alt="Profile"
//               className="w-6 h-6"
//             />
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Authentication/useAuth.js";
import { getUserAvatarSource, getUserInitials } from "../../utils/auth.js";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };
  const avatarSource = getUserAvatarSource(user);
  const initials = getUserInitials(user);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 font-['Integral_CF']">
      <div className="flex items-center justify-between gap-4 max-w-310 h-16 mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 md:gap-10">
          <button
            className="p-1 block md:hidden hover:opacity-70 transition-opacity"
            aria-label="Open Menu"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link
            to="/"
            className="text-2xl md:text-3xl font-black tracking-tight"
          >
            SHOP.CO
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700">
            <select
              id="fruit-select"
              className="bg-transparent cursor-pointer outline-none font-medium"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) navigate(`/category/${e.target.value}`);
              }}
            >
              <option value="">Shop</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="party">Party</option>
              <option value="gym">Gym</option>
            </select>
            <a
              href="#"
              className="hover:text-black transition-colors whitespace-nowrap"
            >
              On Sale
            </a>
            <a
              href="#"
              className="hover:text-black transition-colors whitespace-nowrap"
            >
              New Arrivals
            </a>
            <a
              href="#"
              className="hover:text-black transition-colors whitespace-nowrap"
            >
              Brands
            </a>
          </div>
        </div>

        <div className="hidden sm:block flex-1 max-w-150 mx-4">
          <div className="relative flex items-center">
            <svg
              className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-gray-100 text-gray-800 pl-12 pr-4 py-2.5 rounded-full text-sm outline-none focus:bg-gray-200/70 transition-all"
            />
          </div>
        </div>

        <div className="relative flex items-center gap-3 md:gap-4">
          {isAdmin && (
            <>
              <Link
                to="/admin/products"
                className="hidden rounded-full border border-black bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/90 md:inline-flex"
              >
                Admin
              </Link>
              <Link
                to="/admin/dashboard/chats"
                aria-label="Open support chats"
                title="Support Chats"
                className="p-1 hover:opacity-70 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </Link>
            </>
          )}

          <Link to="/cart" className="p-1 hover:opacity-70 transition-opacity">
            <img src="/src/assets/Cart.svg" alt="Cart" className="w-6 h-6" />
          </Link>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white text-black transition hover:bg-gray-100"
              aria-label="Open account menu"
            >
              {avatarSource ? (
                <img
                  src={avatarSource}
                  alt={user?.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold uppercase text-black/70">
                  {initials}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-3xl border border-gray-200 bg-white p-2 shadow-lg z-50">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full rounded-3xl px-4 py-2 text-left text-sm text-black transition hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/admin/products");
                        }}
                        className="mt-1 w-full rounded-3xl px-4 py-2 text-left text-sm text-black transition hover:bg-gray-100"
                      >
                        Product Management
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/admin/dashboard/chats");
                        }}
                        className="mt-1 w-full rounded-3xl px-4 py-2 text-left text-sm text-black transition hover:bg-gray-100"
                      >
                        Support Chats
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="mt-1 w-full rounded-3xl px-4 py-2 text-left text-sm text-black transition hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/login");
                      }}
                      className="w-full rounded-3xl px-4 py-2 text-left text-sm text-black transition hover:bg-gray-100"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/signup");
                      }}
                      className="mt-1 w-full rounded-3xl px-4 py-2 text-left text-sm text-black transition hover:bg-gray-100"
                    >
                      Signup
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className="bg-[#F8F8FF] border-t border-b border-gray-200 text-sm text-black">
          <div className="mx-auto flex max-w-310 items-center justify-between px-4 py-3 md:px-6">
            <span className="font-semibold">Admin</span>
            <span className="text-black/70">
              This bar is visible only for admin users.
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
