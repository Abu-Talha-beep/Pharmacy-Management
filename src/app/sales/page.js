'use client';
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ShoppingCart, RotateCcw, Search, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PAGE = 6;
export default function Sales() {
    const [sales, setSales] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(1);
    const load = () => fetch('/api/sales').then(r => r.json()).then(setSales);
    useEffect(() => { load() }, []);

    const completed = sales.filter(s => s.status === 'Completed');
    const returned = sales.filter(s => s.status === 'Returned');
    const totalRev = completed.reduce((s, sale) => s + (sale.total || 0), 0);
    const totalProfit = completed.reduce((s, sale) => s + (sale.subtotal || 0) * 0.3, 0); // ~30% margin

    let filtered = sales.filter(s => (s.saleId?.toLowerCase().includes(search.toLowerCase()) || s.customer?.toLowerCase().includes(search.toLowerCase())) && (filter === 'All' || s.status === filter));
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
    const paged = filtered.slice((page - 1) * PAGE, page * PAGE);

    const handleReturn = async (sale) => {
        if (!confirm('Process return for this sale?')) return;
        await fetch('/api/sales', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: sale.id, status: 'Returned' }) });
        load();
    };

    const monthData = [
        { m: 'Jan', sales: 18400, profit: 5200 }, { m: 'Feb', sales: 22300, profit: 6800 }, { m: 'Mar', sales: 19800, profit: 5900 },
        { m: 'Apr', sales: 25600, profit: 8100 }, { m: 'May', sales: 29100, profit: 9500 }, { m: 'Jun', sales: 26700, profit: 8200 },
    ];

    return (
        <>
            <div className="stats">
                <div className="stat-card"><div className="ic green"><DollarSign size={22} /></div><div><h3>Total Revenue</h3><div className="val">RS {totalRev.toFixed(2)}</div></div></div>
                <div className="stat-card"><div className="ic blue"><TrendingUp size={22} /></div><div><h3>Profit (~30%)</h3><div className="val">RS {totalProfit.toFixed(2)}</div></div></div>
                <div className="stat-card"><div className="ic purple"><ShoppingCart size={22} /></div><div><h3>Total Sales</h3><div className="val">{sales.length}</div></div></div>
                <div className="stat-card"><div className="ic red"><RotateCcw size={22} /></div><div><h3>Returns</h3><div className="val">{returned.length}</div></div></div>
            </div>

            <div className="charts-row eq">
                <div className="chart-card">
                    <h3>Monthly Sales & Profit</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={monthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="m" tick={{ fontSize: 12, fill: '#6B7280' }} /><YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} /><Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="sales" fill="#22C55E" radius={[4, 4, 0, 0]} name="Sales" /><Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Profit" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h3>Daily Trend</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={[{ d: 'Mon', v: 4200 }, { d: 'Tue', v: 5100 }, { d: 'Wed', v: 3800 }, { d: 'Thu', v: 6200 }, { d: 'Fri', v: 7100 }, { d: 'Sat', v: 5600 }, { d: 'Sun', v: 3200 }]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="d" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} /><Line type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="tbl-wrap">
                <div className="tbl-bar">
                    <div className="left">
                        <div className="search-box"><Search size={15} /><input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div>
                        {['All', 'Completed', 'Returned'].map(s => <button key={s} className={`btn ${filter === s ? 'btn-p' : 'btn-o'}`} onClick={() => { setFilter(s); setPage(1) }}>{s}</button>)}
                    </div>
                    <div className="right"><button className="btn btn-o"><Download size={15} />Export</button></div>
                </div>
                <table className="tbl"><thead><tr><th>Sale ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>{paged.map(s => (
                        <tr key={s.id}>
                            <td className="m">{s.saleId}</td><td>{s.customer}</td>
                            <td>
                                <ul style={{ margin: 0, paddingLeft: 12, fontSize: '0.8rem', color: 'var(--muted)' }}>
                                    {s.items?.map((item, idx) => (
                                        <li key={idx}>{item.name} <span style={{ fontWeight: 600 }}>x{item.qty}</span></li>
                                    ))}
                                </ul>
                            </td>
                            <td style={{ fontWeight: 600 }}>RS {Number(s.total).toFixed(2)}</td><td>{s.paymentMethod}</td><td>{s.date}</td>
                            <td><span className={`badge ${s.status === 'Completed' ? 'green' : 'red'}`}>{s.status}</span></td>
                            <td><div className="acts">{s.status === 'Completed' && <button className="act" title="Return" onClick={() => handleReturn(s)}><RotateCcw size={15} /></button>}</div></td>
                        </tr>
                    ))}</tbody>
                </table>
                <div className="tbl-foot">
                    <span className="show">Showing {Math.min((page - 1) * PAGE + 1, filtered.length)}-{Math.min(page * PAGE, filtered.length)} of {filtered.length}</span>
                    <div className="pages"><button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={15} /></button>{Array.from({ length: pages }, (_, i) => <button key={i + 1} className={page === i + 1 ? 'on' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={15} /></button></div>
                </div>
            </div >
        </>
    );
}
