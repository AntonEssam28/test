import { Outlet, NavLink } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-6 hidden lg:block">
          <h1 className="text-5xl font-bold text-blue-800">
            Route Posts
          </h1>

          <p className="text-gray-700 text-lg max-w-md">
            Connect with friends and the world around you on Route Posts.
          </p>

          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
            <p className="text-blue-700 text-sm font-bold tracking-widest">
              ABOUT ROUTE ACADEMY
            </p>

            <h3 className="text-xl font-bold mt-2">
              Egypt's Leading IT Training Center Since 2012
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-6 text-center">
              <div className="border rounded-lg p-3">
                <h4 className="font-bold text-blue-800">2012</h4>
                <p className="text-sm text-gray-500">Founded</p>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-bold text-blue-800">40K+</h4>
                <p className="text-sm text-gray-500">Graduates</p>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-bold text-blue-800">50+</h4>
                <p className="text-sm text-gray-500">Partners</p>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-bold text-blue-800">20</h4>
                <p className="text-sm text-gray-500">Diplomas</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                `w-1/2 text-center py-2 rounded-full font-semibold transition ${
                  isActive
                    ? "bg-white shadow text-blue-700"
                    : "text-gray-500"
                }`
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/auth/signup"
              className={({ isActive }) =>
                `w-1/2 text-center py-2 rounded-full font-semibold transition ${
                  isActive
                    ? "bg-white shadow text-blue-700"
                    : "text-gray-500"
                }`
              }
            >
              Register
            </NavLink>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}