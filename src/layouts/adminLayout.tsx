// src/components/layouts/adminLayout.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Trophy,
  LogOut,
  Menu,
  X,
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
  // { name: 'Booths', href: '/admin/booths', icon: Store },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  //   const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    console.log("AdminLayout token:", token);
    // ✅ don’t redirect if already on login page
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
    // dispatch(logout());
    localStorage.removeItem('adminToken');
    setShowLogoutModal(false);
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col bg-gray-900 border-r border-gray-800">
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-xl">SC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">Social</span>
              <span className="text-yellow-400 text-xs -mt-1">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                      ? 'bg-yellow-400 text-gray-900'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-gray-900' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-6 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col w-full md:ml-64">
        {/* Mobile Menu Button */}
        <div className="sticky top-0 z-20 bg-white px-4 py-3 md:hidden border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {NAV_ITEMS.find(item => isActive(item.href))?.name || 'Admin Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-gray-900 text-sm font-bold">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div> */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />

          <aside className="relative w-72 bg-gray-900 h-full overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-800">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold">SC</span>
                </div>
                <span className="text-white font-bold">Admin Panel</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4">
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                          ? 'bg-yellow-400 text-gray-900'
                          : 'text-gray-300 hover:bg-gray-800'
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-gray-800 mt-6 pt-6 space-y-2">
          

                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
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