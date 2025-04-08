import React from 'react';

function DashboardFooter() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} E-VET. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Help
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default DashboardFooter;