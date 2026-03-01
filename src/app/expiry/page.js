'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, XCircle, CheckCircle, Search } from 'lucide-react';

export default function Expiry() {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    useEffect(() => { fetch('/api/products').then(r => r.json()).then(setProducts) }, []);

    const today = new Date();
    const in30 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in90 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

    const expired = products.filter(p => new Date(p.expiryDate) < today);
    const expiring30 = products.filter(p => { const d = new Date(p.expiryDate); return d >= today && d <= in30; });
    const expiring90 = products.filter(p => { const d = new Date(p.expiryDate); return d > in30 && d <= in90; });
    const safe = products.filter(p => new Date(p.expiryDate) > in90);

    const groups = filter === 'Expired' ? [{ label: 'Expired', items: expired, color: 'red' }]
        : filter === '30 Days' ? [{ label: 'Expiring in 30 Days', items: expiring30, color: 'yellow' }]
            : filter === '90 Days' ? [{ label: 'Expiring in 90 Days', items: expiring90, color: 'blue' }]
                : [{ label: 'Expired', items: expired, color: 'red' }, { label: 'Expiring in 30 Days', items: expiring30, color: 'yellow' }, { label: 'Expiring in 90 Days', items: expiring90, color: 'blue' }, { label: 'Safe (90+ Days)', items: safe, color: 'green' }];

    return (
        <>
            <div className="stats">
                <div className="stat-card"><div className="ic red"><XCircle size={22} /></div><div><h3>Expired</h3><div className="val">{expired.length}</div></div></div>
                <div className="stat-card"><div className="ic yellow"><AlertTriangle size={22} /></div><div><h3>30 Days</h3><div className="val">{expiring30.length}</div></div></div>
                <div className="stat-card"><div className="ic blue"><Clock size={22} /></div><div><h3>90 Days</h3><div className="val">{expiring90.length}</div></div></div>
                <div className="stat-card"><div className="ic green"><CheckCircle size={22} /></div><div><h3>Safe</h3><div className="val">{safe.length}</div></div></div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['All', 'Expired', '30 Days', '90 Days'].map(f => <button key={f} className={`btn ${filter === f ? 'btn-p' : 'btn-o'}`} onClick={() => setFilter(f)}>{f}</button>)}
            </div>

            {groups.map(group => (
                <div className="tbl-wrap" key={group.label} style={{ marginBottom: 14 }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`badge ${group.color}`}>{group.items.length}</span> {group.label}
                    </h3>
                    {group.items.length > 0 ? (
                        <table className="tbl"><thead><tr><th>Product ID</th><th>Name</th><th>Batch</th><th>Qty</th><th>Expiry Date</th><th>Days Left</th></tr></thead>
                            <tbody>{group.items.map(p => {
                                const days = Math.ceil((new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24));
                                return <tr key={p.id}><td className="m">{p.productId}</td><td>{p.name}</td><td className="m">{p.batchNo}</td><td>{p.quantity}</td><td>{p.expiryDate}</td>
                                    <td><span className={`badge ${days < 0 ? 'red' : days <= 30 ? 'yellow' : days <= 90 ? 'blue' : 'green'}`}>{days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}</span></td></tr>;
                            })}</tbody>
                        </table>
                    ) : <p style={{ color: 'var(--light)', fontSize: '0.82rem', padding: 12 }}>No products in this category</p>}
                </div>
            ))}
        </>
    );
}
