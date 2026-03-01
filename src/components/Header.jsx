'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, Menu } from 'lucide-react';
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
    const { toggle, isOpen } = useSidebar();

    // Fetch notifications (Low stock / Expiry alerts)
    const [alerts, setAlerts] = useState(0);
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                const lowStockCount = data.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
                setAlerts(lowStockCount);
            })
            .catch(() => { });
    }, []);

    return (
        <header className={`header ${isOpen ? '' : 'collapsed-sidebar'}`}>
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
                <button className="notif" title={`${alerts} Alerts`}>
                    <Bell size={18} />
                    {alerts > 0 && <span className="alert-badge">{alerts}</span>}
                </button>
                <div className="profile">
                    <div className="avatar">MR</div>
                    <div>
                        <div className="name">Mudassir Rasool</div>
                        <div className="role-tag">Admin</div>
                    </div>
                    <ChevronDown size={14} style={{ color: 'var(--light)' }} />
                </div>
            </div>
        </header>
    );
}
