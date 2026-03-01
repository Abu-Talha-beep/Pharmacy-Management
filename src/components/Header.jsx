'use client';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useSidebar } from '@/components/SidebarContext';

const titles = {
    '/dashboard': ['Overview', 'Welcome back to Fasil Pharmacy dashboard'],
    '/inventory': ['Inventory', 'Manage your medicine stock'],
    '/pos': ['Point of Sale', 'Process sales and billing'],
    '/purchases': ['Purchases', 'Manage purchase orders'],
    '/sales': ['Sales', 'Track revenue and transactions'],
    '/customers': ['Customers', 'Manage customer profiles'],
    '/suppliers': ['Suppliers', 'Manage supplier relationships'],
    '/expiry': ['Expiry & Batch', 'Track expiry dates and batches'],
    '/prescriptions': ['Prescriptions', 'Manage prescription records'],
    '/audit': ['Audit Logs', 'Track all system activities'],
    '/reports': ['Reports', 'Analytics and insights'],
    '/settings': ['Settings', 'System configuration'],
    '/help': ['Help & Support', 'Get assistance'],
};

export default function Header() {
    const path = usePathname();
    const [title, sub] = titles[path] || ['Dashboard', ''];
    const { toggle } = useSidebar();

    return (
        <header className="header">
            <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
                <button className="menu-btn" onClick={toggle} aria-label="Toggle Menu">
                    <Menu size={20} />
                </button>
                <div>
                    <h1>{title}</h1>
                    <p>{sub}</p>
                </div>
            </div>
            <div className="right">
                <div className="search">
                    <Search size={15} />
                    <input type="text" placeholder="Search..." />
                </div>
                <button className="notif">
                    <Bell size={18} />
                    <span className="dot"></span>
                </button>
                <div className="profile">
                    <div className="avatar">JB</div>
                    <div>
                        <div className="name">James Bond</div>
                        <div className="role-tag">Admin</div>
                    </div>
                    <ChevronDown size={14} style={{ color: 'var(--light)' }} />
                </div>
            </div>
        </header>
    );
}
