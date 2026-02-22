import Sidebar from './Sidebar';

export default function DashboardLayout({ children, type = 'user' }) {
    return (
        <div className="dashboard-layout">
            <Sidebar type={type} />
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}
