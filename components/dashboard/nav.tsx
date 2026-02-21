export default function Nav() {
  return (
<nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gray-900/70 px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <span className="text-blue-400 text-2xl transition-transform duration-300 group-hover:scale-110">
          📍
        </span>
        <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
          FnB Map
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-10 items-center">
        {["Discover", "Categories", "Blog", "Support"].map((item) => (
          <a
            key={item}
            href="#"
            className="relative text-gray-300 font-medium transition-colors duration-300 hover:text-blue-400 group"
          >
            {item}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </div>

      {/* Button */}
      <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 hover:bg-blue-500 hover:scale-105 active:scale-95">
        Open FnB Map
      </button>

    </nav>
  );
}