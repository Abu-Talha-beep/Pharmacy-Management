'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useSidebar } from '@/components/SidebarContext';

const titles = {
    '/dashboard': ['Overview', 'Welcome back to Fasil Pharmacy dashboard'],
    '/inventory': ['Inventory', 'Manage your medicine stock'],
    '/pos': ['Point of Sale', 'Process sales and billing'],
    '/sales': ['Sales History', 'Track revenue and transactions'],
    '/reports': ['Reports', 'Analytics and insights'],
    '/settings': ['Settings', 'System configuration'],
};

export default function Header() {
    const path = usePathname();
    const [title, sub] = titles[path] || ['Dashboard', ''];
    const { toggleMobile, toggleCollapse } = useSidebar();

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

    const handleMenuClick = () => {
        // On mobile (<=768px) toggle mobile sidebar, on desktop toggle collapse
        if (window.innerWidth <= 768) {
            toggleMobile();
        } else {
            toggleCollapse();
        }
    };

    return (
        <header className="header">
            <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
                <button className="menu-btn" onClick={handleMenuClick} aria-label="Toggle Menu">
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
