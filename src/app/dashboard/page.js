'use client';
import { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, Users, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#EAB308', '#EF4444', '#8B5CF6', '#9CA3AF'];

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        fetch('/api/products').then(r => r.json()).then(setProducts);
        fetch('/api/sales').then(r => r.json()).then(setSales);
        fetch('/api/customers').then(r => r.json()).then(setCustomers);
    }, []);

    const totalProducts = products.length;
    const lowStock = products.filter(p => p.status === 'Low Stock').length;
    const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
    const totalRevenue = sales.filter(s => s.status !== 'Returned').reduce((s, sale) => s + (sale.total || 0), 0);
    const totalSales = sales.length;
    const totalCustomers = customers.length;

    // Category breakdown
    const cats = {};
    products.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
    const catData = Object.entries(cats).map(([name, value]) => ({ name, value }));

    // Monthly revenue (mock based on sales data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revData = months.map((m, i) => ({ month: m, revenue: 12000 + Math.floor(Math.random() * 20000), orders: 200 + Math.floor(Math.random() * 600) }));

    // Top products by frequency
    const prodFreq = {};
    sales.forEach(s => s.items?.forEach(i => { prodFreq[i.name] = (prodFreq[i.name] || 0) + i.qty; }));
    const topProducts = Object.entries(prodFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
        <>
            <div className="stats">
                <div className="stat-card"><div className="ic green"><DollarSign size={22} /></div><div><h3>Total Revenue</h3><div className="val">RS {totalRevenue.toFixed(2)}</div></div></div>
                <div className="stat-card"><div className="ic blue"><ShoppingCart size={22} /></div><div><h3>Total Sales</h3><div className="val">{totalSales}</div></div></div>
                <div className="stat-card"><div className="ic purple"><Package size={22} /></div><div><h3>Products</h3><div className="val">{totalProducts}</div></div></div>
                <div className="stat-card"><div className="ic yellow"><Users size={22} /></div><div><h3>Customers</h3><div className="val">{totalCustomers}</div></div></div>
            </div>

            <div className="stats c3" style={{ marginBottom: 20 }}>
                <div className="stat-card"><div className="ic green"><Package size={22} /></div><div><h3>In Stock</h3><div className="val">{totalProducts - lowStock - outOfStock}</div></div></div>
                <div className="stat-card"><div className="ic yellow"><AlertTriangle size={22} /></div><div><h3>Low Stock</h3><div className="val">{lowStock}</div></div></div>
                <div className="stat-card"><div className="ic red"><XCircle size={22} /></div><div><h3>Out of Stock</h3><div className="val">{outOfStock}</div></div></div>
            </div>

            <div className="charts-row">
                <div className="chart-card">
                    <h3>Revenue Overview</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={revData}>
                            <defs><linearGradient id="cR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }} />
                            <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} fill="url(#cR)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h3>Categories</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={catData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" paddingAngle={3}>
                                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="tbl-wrap">
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 14 }}>Top Selling Products</h3>
                <table className="tbl">
                    <thead><tr><th>#</th><th>Product</th><th>Units Sold</th></tr></thead>
                    <tbody>
                        {topProducts.map(([name, qty], i) => (
                            <tr key={i}><td className="m">{i + 1}</td><td>{name}</td><td style={{ fontWeight: 600 }}>{qty}</td></tr>
                        ))}
                        {topProducts.length === 0 && <tr><td colSpan={3} className="m" style={{ textAlign: 'center', padding: 20 }}>No sales data yet</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
}
