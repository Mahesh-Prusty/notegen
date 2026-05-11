import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          NoteGen
        </Link>

        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;