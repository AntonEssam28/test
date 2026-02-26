import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";

import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { tokenContext } from "../../../Context/tokenContext";
import Photo from '../../../../src/assets/images/route.png'

export default function NavbarComponent() {
  const { setToken, userData } = useContext(tokenContext);
  const navigate = useNavigate();

  function logoutSystem() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/auth/login");
  }

  return (
    <Navbar maxWidth="xl" className="border-b bg-white">
      {/* LEFT SIDE */}
      <NavbarBrand>
        <div className="flex items-center gap-2">
          <div className="w-[60px] text-white px-3 py-2 rounded-lg font-bold">
           <img src={Photo} alt="" />
          </div>
          <p className="font-bold text-2xl text-gray-800">
             ROUTE
          </p>
        </div>
      </NavbarBrand>

      {/* CENTER LINKS */}
      <NavbarContent justify="center" className="hidden md:flex">
        <div className="flex items-center gap-6 bg-gray-100 px-6 py-2 rounded-full">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 font-semibold ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            Feed
          </NavLink>

          <NavLink
            to="/profile/:id"
            className={({ isActive }) =>
              `flex items-center gap-2 font-semibold ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `flex items-center gap-2 font-semibold ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            Notifications
          </NavLink>

        </div>
      </NavbarContent>

      {/* RIGHT SIDE */}
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar
                isBordered
                size="sm"
                src={userData?.photo}
                name={userData?.name}
                color="primary"
              />
              <span className="hidden sm:block font-medium text-gray-700">
                {userData?.name}
              </span>
            </div>
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile">
              <Link to={`/profile/${userData?._id}`}>
                Profile
              </Link>
            </DropdownItem>

            <DropdownItem key="profile">
              <Link to={`/changePassword`}>
                Change Password
              </Link>
            </DropdownItem>

            
            <DropdownItem
              key="logout"
              color="danger"
              onClick={logoutSystem}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}