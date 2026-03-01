'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, ShoppingCart, DollarSign, Users, CreditCard, TrendingUp, Truck, AlertTriangle, FileText, HelpCircle, Settings as SettingsIcon, Pill, ClipboardList, Shield, X } from 'lucide-react';
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
            { path: '/purchases', label: 'Purchases', icon: Truck },
            { path: '/sales', label: 'Sales', icon: DollarSign },
            { path: '/customers', label: 'Customers', icon: Users },
            { path: '/suppliers', label: 'Suppliers', icon: CreditCard },
        ]
    },
    {
        label: 'COMPLIANCE', items: [
            { path: '/expiry', label: 'Expiry & Batch', icon: AlertTriangle },
            { path: '/prescriptions', label: 'Prescriptions', icon: ClipboardList },
            { path: '/audit', label: 'Audit Logs', icon: Shield },
        ]
    },
    {
        label: 'SYSTEM', items: [
            { path: '/reports', label: 'Reports', icon: FileText },
            { path: '/settings', label: 'Settings', icon: SettingsIcon },
            { path: '/help', label: 'Help & Support', icon: HelpCircle },
        ]
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isOpen, close } = useSidebar();

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={close}></div>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="sidebar-close-btn" onClick={close}><X size={20} /></button>
                <div className="logo">
                    <div className="icon"><Pill size={18} /></div>
                    <span>Fasil Pharmacy</span>
                </div>
                <nav>
                    {menu.map(section => (
                        <div key={section.label}>
                            <div className="section-label">{section.label}</div>
                            <ul>
                                {section.items.map(item => (
                                    <li key={item.path}>
                                        <Link href={item.path} className={pathname === item.path || pathname?.startsWith(item.path + '/') ? 'active' : ''}>
                                            <item.icon size={18} />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
                <div className="bottom">
                    <div className="upgrade">
                        <h4>Upgrade Pro</h4>
                        <p>Advanced analytics & multi-location support</p>
                        <span className="btn-up">Upgrade Now</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
