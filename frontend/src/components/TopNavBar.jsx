import React from "react";

const TopNavBar = () => (
  <nav className="flex items-center justify-between h-14 px-4 bg-white border-b shadow-sm">
    {/* Left: Logo */}
    <div className="flex items-center space-x-2">
      <span className="font-bold text-xl">🔐 MyVault</span>
    </div>
    {/* Center: Search */}
    <div className="flex-1 flex justify-center">
      <input
        type="text"
        placeholder="Search..."
        className="w-80 px-3 py-1 rounded-full border focus:outline-none focus:ring"
      />
    </div>
    {/* Right: Profile, Settings, Theme */}
    <div className="flex items-center space-x-4">
      <button title="Theme" className="text-xl">🌗</button>
      <button title="Settings" className="text-xl">⚙️</button>
      <button title="Profile" className="text-xl">👤</button>
    </div>
  </nav>
);

export default TopNavBar; 