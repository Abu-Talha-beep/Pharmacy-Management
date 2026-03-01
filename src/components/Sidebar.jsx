'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, ShoppingCart, DollarSign, TrendingUp, FileText, Settings as SettingsIcon, Pill, X } from 'lucide-react';
import { useSidebar } from '@/components/SidebarContext';

const menu = [
    {
        label: 'MAIN', items: [
            { path: '/dashboard', label: 'Overview', icon: LayoutGrid },
            { path: '/inventory', label: 'Inventory', icon: Package },
            { path: '/pos', label: 'POS / Billing', icon: ShoppingCart },
        ]
    },
    {
        label: 'MANAGEMENT', items: [
            { path: '/sales', label: 'Sales History', icon: DollarSign },
        ]
    },
    {
        label: 'SYSTEM', items: [
            { path: '/reports', label: 'Reports', icon: FileText },
            { path: '/settings', label: 'Settings', icon: SettingsIcon },
        ]
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isOpen, close, toggle } = useSidebar();

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={close}></div>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="sidebar-close-btn" onClick={close}><X size={20} /></button>
                <div className="logo" onClick={toggle} style={{ cursor: 'pointer' }}>
                    <div className="icon"><Pill size={18} /></div>
                    <span className="logo-text">Fasil Pharmacy</span>
                </div>
                <nav>
                    {menu.map(section => (
                        <div key={section.label} className="nav-section">
                            <div className="section-label">{section.label}</div>
                            <ul>
                                {section.items.map(item => (
                                    <li key={item.path}>
                                        <Link href={item.path} className={pathname === item.path || pathname?.startsWith(item.path + '/') ? 'active' : ''}>
                                            <item.icon size={18} />
                                            <span className="nav-label">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
