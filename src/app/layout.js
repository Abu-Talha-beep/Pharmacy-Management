import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { SeedInit } from '@/components/SeedInit';
import ThemeProvider from '@/components/ThemeProvider';
import { SidebarProvider } from '@/components/SidebarContext';

export const metadata = {
  title: 'Fasil Pharmacy — Pharmacy Management System',
  description: 'Complete pharmacy management system with inventory, POS, sales, and reporting.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <SeedInit />
            <div className="app">
              <Sidebar />
              <div className="main-wrap">
                <Header />
                <main className="main">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
