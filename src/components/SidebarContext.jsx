'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SidebarContext = createContext({
    mobileOpen: false,
    collapsed: false,
    toggleMobile: () => { },
    closeMobile: () => { },
    toggleCollapse: () => { },
});

export function useSidebar() {
    return useContext(SidebarContext);
}

export function SidebarProvider({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const toggleMobile = () => setMobileOpen(p => !p);
    const closeMobile = () => setMobileOpen(false);
    const toggleCollapse = () => setCollapsed(p => !p);

    // Auto-close mobile sidebar on route change
    useEffect(() => {
        if (pathname) {
            closeMobile();
        }
    }, [pathname]);

    return (
        <SidebarContext.Provider value={{ mobileOpen, collapsed, toggleMobile, closeMobile, toggleCollapse }}>
            {children}
        </SidebarContext.Provider>
    );
}
