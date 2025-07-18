import React from "react";

const VaultPanel = () => (
  <section className="flex-1 flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl shadow-2xl m-8 max-w-2xl mx-auto">
    {/* Filters/Search */}
    <div className="p-6 border-b border-gray-700 flex items-center space-x-4 bg-gray-800 rounded-t-2xl">
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
        </span>
        <input
          type="text"
          placeholder="Search items..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <button className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-7 7V21l-2-2v-7.293l-7-7A1 1 0 013 4z" /></svg>
        Filter
      </button>
    </div>
    {/* Vault List / Items List Placeholder */}
    <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center bg-gray-900 rounded-b-2xl">
      <div className="flex flex-col items-center">
        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v.01M7.5 11.5a4.5 4.5 0 119 0c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5z" /></svg>
        <div className="text-gray-400 text-lg font-medium text-center">No items yet.<br/>Add or select a vault item to view details.</div>
      </div>
    </div>
  </section>
);

export default VaultPanel; 