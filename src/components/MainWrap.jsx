'use client';
import { useSidebar } from '@/components/SidebarContext';

export default function MainWrap({ children }) {
    const { collapsed } = useSidebar();
    return (
        <div className={`main-wrap ${collapsed ? 'collapsed-sidebar' : ''}`}>
            {children}
        </div>
    );
}
