'use client';
import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, AlertTriangle, Phone, Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const PAGE = 6;
const empty = { supplierId: '', name: '', contact: '', email: '', phone: '', address: '', totalOrders: 0, totalPaid: 0, outstanding: 0, status: 'Active' };

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const load = () => fetch('/api/suppliers').then(r => r.json()).then(setSuppliers);
    useEffect(() => { load() }, []);

    const filtered = suppliers.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.contact?.toLowerCase().includes(search.toLowerCase()));
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
    const paged = filtered.slice((page - 1) * PAGE, page * PAGE);
    const totalOutstanding = suppliers.reduce((s, sup) => s + (sup.outstanding || 0), 0);
    const totalPaid = suppliers.reduce((s, sup) => s + (sup.totalPaid || 0), 0);

    const handleSave = async () => {
        if (modal === 'add') await fetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        else await fetch('/api/suppliers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: form.id, ...form }) });
        setModal(null); setForm(empty); load();
    };
    const handleDel = async (id) => { if (!confirm('Delete?')) return; await fetch('/api/suppliers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); load(); };

    return (
        <>
            <div className="stats">
                <div className="stat-card"><div className="ic blue"><CreditCard size={22} /></div><div><h3>Total Suppliers</h3><div className="val">{suppliers.length}</div></div></div>
                <div className="stat-card"><div className="ic green"><DollarSign size={22} /></div><div><h3>Total Paid</h3><div className="val">RS {totalPaid.toLocaleString()}</div></div></div>
                <div className="stat-card"><div className="ic red"><AlertTriangle size={22} /></div><div><h3>Outstanding</h3><div className="val">RS {totalOutstanding.toLocaleString()}</div></div></div>
                <div className="stat-card"><div className="ic purple"><Phone size={22} /></div><div><h3>Active</h3><div className="val">{suppliers.filter(s => s.status === 'Active').length}</div></div></div>
            </div>
            <div className="tbl-wrap">
                <div className="tbl-bar">
                    <div className="left"><div className="search-box"><Search size={15} /><input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div></div>
                    <div className="right">
                        <button className="btn btn-p" onClick={() => { setForm({ ...empty, supplierId: 'SUP-' + String(suppliers.length + 1).padStart(3, '0') }); setModal('add') }}><Plus size={15} />Add Supplier</button>
                        <button className="btn btn-o"><Download size={15} />Export</button>
                    </div>
                </div>
                <table className="tbl"><thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Phone</th><th>Orders</th><th>Paid</th><th>Outstanding</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{paged.map(s => (
                        <tr key={s.id}><td className="m">{s.supplierId}</td><td>{s.name}</td><td>{s.contact}</td><td>{s.phone}</td>
                            <td>{s.totalOrders}</td><td style={{ fontWeight: 600 }}>RS {Number(s.totalPaid).toLocaleString()}</td>
                            <td style={{ color: s.outstanding > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>RS {Number(s.outstanding).toLocaleString()}</td>
                            <td><span className={`badge ${s.status === 'Active' ? 'green' : 'red'}`}>{s.status}</span></td>
                            <td><div className="acts"><button className="act" onClick={() => { setForm(s); setModal('edit') }}><Pencil size={15} /></button><button className="act" onClick={() => handleDel(s.id)}><Trash2 size={15} /></button></div></td>
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
                    <h2>{modal === 'add' ? 'Add Supplier' : 'Edit Supplier'}</h2>
                    <div className="form-grid">
                        <div className="fg"><label>Supplier ID</label><input value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} /></div>
                        <div className="fg"><label>Company Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="fg"><label>Contact Person</label><input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></div>
                        <div className="fg"><label>Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                        <div className="fg"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                        <div className="fg"><label>Address</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                        <div className="fg"><label>Outstanding (RS)</label><input type="number" value={form.outstanding} onChange={e => setForm({ ...form, outstanding: parseFloat(e.target.value) || 0 })} /></div>
                        <div className="fg"><label>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></div>
                    </div>
                    <div className="actions"><button className="btn btn-o" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-p" onClick={handleSave}>Save</button></div>
                </div></div>
            )}
        </>
    );
}
