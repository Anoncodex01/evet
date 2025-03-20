import React from 'react';

function AdminFooter() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} E-VET Admin Panel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter