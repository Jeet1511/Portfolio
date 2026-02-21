import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicPortfolio from './pages/PublicPortfolio';
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/dashboard/Projects';
import EditProject from './pages/dashboard/EditProject';
import Settings from './pages/dashboard/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminSettings from './pages/admin/AdminSettings';
import DashboardLayout from './components/DashboardLayout';
import NotFound from './pages/NotFound';

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

function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
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

export default function App() {
    return (
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
                        <DashboardLayout type="user">
                            <Dashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/projects" element={
                    <ProtectedRoute>
                        <DashboardLayout type="user">
                            <Projects />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/projects/new" element={
                    <ProtectedRoute>
                        <DashboardLayout type="user">
                            <EditProject />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/projects/:id" element={
                    <ProtectedRoute>
                        <DashboardLayout type="user">
                            <EditProject />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/settings" element={
                    <ProtectedRoute>
                        <DashboardLayout type="user">
                            <Settings />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <DashboardLayout type="admin">
                            <AdminDashboard />
                        </DashboardLayout>
                    </AdminRoute>
                } />
                <Route path="/admin/users" element={
                    <AdminRoute>
                        <DashboardLayout type="admin">
                            <UserManagement />
                        </DashboardLayout>
                    </AdminRoute>
                } />
                <Route path="/admin/settings" element={
                    <AdminRoute>
                        <DashboardLayout type="admin">
                            <AdminSettings />
                        </DashboardLayout>
                    </AdminRoute>
                } />

                {/* Public Portfolio - must be last */}
                <Route path="/:username" element={<PublicPortfolio />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
