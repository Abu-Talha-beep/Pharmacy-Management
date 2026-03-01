'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SidebarContext = createContext({ isOpen: false, toggle: () => { }, close: () => { } });

export function useSidebar() {
    return useContext(SidebarContext);
}

export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggle = () => setIsOpen(p => !p);
    const close = () => setIsOpen(false);

    // Auto-close sidebar on route change (useful on mobile)
    useEffect(() => {
        if (pathname) {
            close();
        }
    }, [pathname]);

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, close }}>
            {children}
        </SidebarContext.Provider>
    );
}
