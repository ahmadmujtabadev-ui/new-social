// src/components/layouts/adminLayout.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Trophy,
  LogOut,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/admin/admin', icon: LayoutDashboard },
  { name: 'Vendors', href: '/admin/vendors', icon: Users },
  { name: 'Sponsors', href: '/admin/sponsors', icon: Trophy },
  { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
  { name: 'Participants', href: '/admin/part', icon: Trophy },
  { name: 'Logout', href: '#', icon: LogOut },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    console.log("AdminLayout token:", token);
    if (!token && router.pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [router.pathname, router]);

  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('adminToken');
    setShowLogoutModal(false);
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Users className="h-6 w-6 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-yellow-500 font-bold text-xl">Social Connections</span>
            <span className="text-gray-400 text-sm">Events</span>
          </div>
        </div>
      </header>

      {/* Page Title Section */}
      <div className="bg-black px-6 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
            <LayoutDashboard className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-yellow-500 font-bold text-2xl">Dashboard</h1>
            <p className="text-gray-400 text-sm">Event submissions overview</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black px-6 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation Bar - GOLDEN & BLACK THEME */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t-2 border-yellow-500/40 z-50 shadow-[0_-4px_20px_rgba(234,179,8,0.15)]">
        <div className="flex items-center justify-around px-2 py-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const isLogout = item.name === 'Logout';
            
            if (isLogout) {
              return (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-1 px-2 py-2 transition-all hover:scale-110 active:scale-95"
                >
                  <div className={`p-1.5 rounded-lg transition-all bg-yellow-500/10 hover:bg-yellow-500/20`}>
                    <Icon className="h-5 w-5 text-yellow-500/70 hover:text-yellow-500" />
                  </div>
                  <span className="text-[10px] font-medium text-yellow-500/70 hover:text-yellow-500">
                    {item.name}
                  </span>
                </button>
              );
            }
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-1 px-2 py-2 transition-all hover:scale-110 active:scale-95"
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  active 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30' 
                    : 'bg-yellow-500/10 hover:bg-yellow-500/20'
                }`}>
                  <Icon 
                    className={`h-5 w-5 ${
                      active ? 'text-black' : 'text-yellow-500/70'
                    }`} 
                  />
                </div>
                <span 
                  className={`text-[10px] font-medium ${
                    active ? 'text-yellow-500' : 'text-yellow-500/70'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-yellow-500/30">
            <h3 className="text-lg font-semibold text-yellow-500 mb-2">Confirm Logout</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 bg-black hover:bg-gray-900 rounded-lg transition border-2 border-yellow-500/20 hover:border-yellow-500/40"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 rounded-lg transition shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;