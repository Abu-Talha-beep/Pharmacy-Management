'use client';
import { useState, useEffect } from 'react';
import { DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#EAB308', '#EF4444', '#8B5CF6', '#9CA3AF'];

export default function Reports() {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    useEffect(() => {
        fetch('/api/products').then(r => r.json()).then(setProducts);
        fetch('/api/sales').then(r => r.json()).then(setSales);
    }, []);

    // Stock Valuation
    const stockValue = products.reduce((s, p) => s + p.quantity * (p.costPrice || 0), 0);
    const retailValue = products.reduce((s, p) => s + p.quantity * (p.price || 0), 0);
    const potentialProfit = retailValue - stockValue;

    // Near expiry
    const today = new Date();
    const nearExpiry = products.filter(p => { const d = new Date(p.expiryDate); const diff = (d - today) / (1000 * 60 * 60 * 24); return diff >= 0 && diff <= 90; });
    const expired = products.filter(p => new Date(p.expiryDate) < today);

    // Sales stats
    const completedSales = sales.filter(s => s.status === 'Completed');
    const totalRev = completedSales.reduce((s, sale) => s + (sale.total || 0), 0);

    // Category stock value
    const catVal = {};
    products.forEach(p => { const cat = p.category || 'Other'; catVal[cat] = (catVal[cat] || 0) + p.quantity * (p.costPrice || 0); });
    const catData = Object.entries(catVal).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value: Math.round(value) }));

    // Profit margin by product
    const profitData = products.filter(p => p.price && p.costPrice).slice(0, 10).map(p => ({ name: p.name.substring(0, 15), margin: Math.round(((p.price - p.costPrice) / p.price) * 100), revenue: p.price, cost: p.costPrice }));

    // Low stock
    const lowStock = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock');

    return (
        <>
            <div className="stats">
                <div className="stat-card"><div className="ic green"><DollarSign size={22} /></div><div><h3>Stock Value (Cost)</h3><div className="val">RS {stockValue.toFixed(2)}</div></div></div>
                <div className="stat-card"><div className="ic blue"><DollarSign size={22} /></div><div><h3>Retail Value</h3><div className="val">RS {retailValue.toFixed(2)}</div></div></div>
                <div className="stat-card"><div className="ic purple"><TrendingUp size={22} /></div><div><h3>Potential Profit</h3><div className="val">RS {potentialProfit.toFixed(2)}</div></div></div>
                <div className="stat-card"><div className="ic yellow"><AlertTriangle size={22} /></div><div><h3>At-Risk Items</h3><div className="val">{nearExpiry.length + expired.length}</div></div></div>
            </div>

            <div className="charts-row eq">
                <div className="chart-card">
                    <h3>Stock Value by Category</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart><Pie data={catData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" paddingAngle={3}>
                            {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie><Tooltip formatter={(v) => `RS ${v.toLocaleString()}`} contentStyle={{ borderRadius: 8, fontSize: 13 }} /><Legend wrapperStyle={{ fontSize: 12 }} /></PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h3>Profit Margin by Product (%)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={profitData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis type="number" tick={{ fontSize: 12 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} /><Bar dataKey="margin" fill="#22C55E" radius={[0, 4, 4, 0]} name="Margin %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="tbl-wrap">
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 12 }}>Low Stock Report</h3>
                    <table className="tbl"><thead><tr><th>Product</th><th>Stock</th><th>Min</th><th>Status</th></tr></thead>
                        <tbody>{lowStock.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.quantity}</td><td>{p.minStock}</td><td><span className={`badge ${p.status === 'Out of Stock' ? 'red' : 'yellow'}`}>{p.status}</span></td></tr>)}</tbody>
                    </table>
                </div>
                <div className="tbl-wrap">
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 12 }}>Expired Products</h3>
                    <table className="tbl"><thead><tr><th>Product</th><th>Batch</th><th>Expiry</th><th>Qty</th></tr></thead>
                        <tbody>{expired.map(p => <tr key={p.id}><td>{p.name}</td><td className="m">{p.batchNo}</td><td><span className="badge red">{p.expiryDate}</span></td><td>{p.quantity}</td></tr>)}
                            {expired.length === 0 && <tr><td colSpan={4} className="m" style={{ textAlign: 'center', padding: 16 }}>No expired products</td></tr>}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
