'use client';
import { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, UserX, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Download, X, Award } from 'lucide-react';

const PAGE = 6;
const empty = { customerId: '', name: '', email: '', phone: '', address: '', totalOrders: 0, totalSpent: 0, creditBalance: 0, loyaltyPoints: 0, status: 'Active' };

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const load = () => fetch('/api/customers').then(r => r.json()).then(setCustomers);
    useEffect(() => { load() }, []);

    const filtered = customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
    const paged = filtered.slice((page - 1) * PAGE, page * PAGE);
    const active = customers.filter(c => c.status === 'Active').length;

    const handleSave = async () => {
        if (modal === 'add') await fetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        else await fetch('/api/customers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: form.id, ...form }) });
        setModal(null); setForm(empty); load();
    };
    const handleDel = async (id) => { if (!confirm('Delete?')) return; await fetch('/api/customers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); load(); };

    return (
        <>
            <div className="stats">
                <div className="stat-card"><div className="ic blue"><Users size={22} /></div><div><h3>Total</h3><div className="val">{customers.length}</div></div></div>
                <div className="stat-card"><div className="ic green"><UserCheck size={22} /></div><div><h3>Active</h3><div className="val">{active}</div></div></div>
                <div className="stat-card"><div className="ic red"><UserX size={22} /></div><div><h3>Inactive</h3><div className="val">{customers.length - active}</div></div></div>
                <div className="stat-card"><div className="ic purple"><Award size={22} /></div><div><h3>Loyalty Points</h3><div className="val">{customers.reduce((s, c) => s + (c.loyaltyPoints || 0), 0)}</div></div></div>
            </div>
            <div className="tbl-wrap">
                <div className="tbl-bar">
                    <div className="left"><div className="search-box"><Search size={15} /><input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div></div>
                    <div className="right">
                        <button className="btn btn-p" onClick={() => { setForm({ ...empty, customerId: 'C' + String(customers.length + 1).padStart(3, '0') }); setModal('add') }}><UserPlus size={15} />Add Customer</button>
                        <button className="btn btn-o"><Download size={15} />Export</button>
                    </div>
                </div>
                <table className="tbl"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Spent</th><th>Credit</th><th>Points</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{paged.map(c => (
                        <tr key={c.id}><td className="m">{c.customerId}</td><td>{c.name}</td><td className="m">{c.email}</td><td>{c.phone}</td>
                            <td>{c.totalOrders}</td><td style={{ fontWeight: 600 }}>${Number(c.totalSpent).toFixed(2)}</td><td>${Number(c.creditBalance).toFixed(2)}</td><td>{c.loyaltyPoints}</td>
                            <td><span className={`badge ${c.status === 'Active' ? 'green' : 'red'}`}>{c.status}</span></td>
                            <td><div className="acts">
                                <button className="act" onClick={() => { setForm(c); setModal('edit') }}><Pencil size={15} /></button>
                                <button className="act" onClick={() => handleDel(c.id)}><Trash2 size={15} /></button>
                            </div></td>
                        </tr>
                    ))}</tbody>
                </table>
                <div className="tbl-foot">
                    <span className="show">{Math.min((page - 1) * PAGE + 1, filtered.length)}-{Math.min(page * PAGE, filtered.length)} of {filtered.length}</span>
                    <div className="pages"><button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={15} /></button>{Array.from({ length: pages }, (_, i) => <button key={i + 1} className={page === i + 1 ? 'on' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={15} /></button></div>
                </div>
            </div>
            {(modal === 'add' || modal === 'edit') && (
                <div className="modal-overlay" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}>
                    <h2>{modal === 'add' ? 'Add Customer' : 'Edit Customer'}</h2>
                    <div className="form-grid">
                        <div className="fg"><label>Customer ID</label><input value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} /></div>
                        <div className="fg"><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="fg"><label>Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                        <div className="fg"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                        <div className="fg"><label>Address</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                        <div className="fg"><label>Credit Balance</label><input type="number" value={form.creditBalance} onChange={e => setForm({ ...form, creditBalance: parseFloat(e.target.value) || 0 })} /></div>
                        <div className="fg"><label>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></div>
                    </div>
                    <div className="actions"><button className="btn btn-o" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-p" onClick={handleSave}>Save</button></div>
                </div></div>
            )}
        </>
    );
}
