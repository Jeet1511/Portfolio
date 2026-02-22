import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicPortfolio from './pages/PublicPortfolio';
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/dashboard/Projects';
import EditProject from './pages/dashboard/EditProject';
import Settings from './pages/dashboard/Settings';
import Background from './pages/dashboard/Background';
import DashboardLayout from './components/DashboardLayout';
import NotFound from './pages/NotFound';

// Admin imports (completely separate)
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminManagement from './pages/admin/AdminManagement';
import IPManagement from './pages/admin/IPManagement';
import ServerManagement from './pages/admin/ServerManagement';
import ActivityLogs from './pages/admin/ActivityLogs';
import ContentModeration from './pages/admin/ContentModeration';
import SiteSettings from './pages/admin/SiteSettings';
import Analytics from './pages/admin/Analytics';
import SecurityCenter from './pages/admin/SecurityCenter';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function GuestRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

// Admin gate: show login if not authenticated, otherwise render children
function AdminGate({ children }) {
    const { isAdminAuthenticated, loading } = useAdminAuth();

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!isAdminAuthenticated) {
        return <AdminLogin />;
    }

    return children;
}

// Separate admin app - no Navbar, fully independent
function AdminApp() {
    return (
        <AdminAuthProvider>
            <AdminGate>
                <Routes>
                    <Route element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="admins" element={<AdminManagement />} />
                        <Route path="ip" element={<IPManagement />} />
                        <Route path="server" element={<ServerManagement />} />
                        <Route path="logs" element={<ActivityLogs />} />
                        <Route path="content" element={<ContentModeration />} />
                        <Route path="settings" element={<SiteSettings />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="security" element={<SecurityCenter />} />
                    </Route>
                </Routes>
            </AdminGate>
        </AdminAuthProvider>
    );
}

export default function App() {
    return (
        <Routes>
            {/* Admin panel - completely separate, no Navbar */}
            <Route path="/admin/*" element={<AdminApp />} />

            {/* Main site with Navbar */}
            <Route path="*" element={
                <>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route path="/login" element={
                            <GuestRoute><Login /></GuestRoute>
                        } />
                        <Route path="/signup" element={
                            <GuestRoute><Signup /></GuestRoute>
                        } />

                        {/* Dashboard Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <DashboardLayout type="user"><Dashboard /></DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/projects" element={
                            <ProtectedRoute>
                                <DashboardLayout type="user"><Projects /></DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/projects/new" element={
                            <ProtectedRoute>
                                <DashboardLayout type="user"><EditProject /></DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/projects/:id" element={
                            <ProtectedRoute>
                                <DashboardLayout type="user"><EditProject /></DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/background" element={
                            <ProtectedRoute>
                                <DashboardLayout type="user"><Background /></DashboardLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/settings" element={
                            <ProtectedRoute>
                                <DashboardLayout type="user"><Settings /></DashboardLayout>
                            </ProtectedRoute>
                        } />

                        {/* Public Portfolio - must be last */}
                        <Route path="/:username" element={<PublicPortfolio />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </>
            } />
        </Routes>
    );
}

