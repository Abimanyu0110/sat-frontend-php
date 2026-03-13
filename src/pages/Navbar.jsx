// icons
import { RiMenu4Fill } from "react-icons/ri";

// Hooks
import useAdmin from "../../Hooks/useAdmin";

const Navbar = ({ setSidebarOpen }) => {
  const { admin } = useAdmin();

  return (
    <header className="
      sticky top-0 z-30 h-14 w-full bg-white
      flex items-center justify-between
      px-5 lg:pl-60 shadow
    ">
      <h1 className="font-semibold text-gray-500">
        Welcome back{" "}
        <span className="text-sky-700 font-bold">
          {admin.userName}
        </span>
      </h1>

      {/* Menu Button (sm/md only) */}
      <button
        className="block lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <RiMenu4Fill size={22} />
      </button>
    </header>
  );
};

export default Navbar;
