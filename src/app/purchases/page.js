'use client';
import { useState, useEffect } from 'react';
import { Truck, CheckCircle, Clock, DollarSign, Plus, Search, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';

const PAGE = 5;
export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ supplier: '', items: [{ name: '', qty: 0, costPrice: 0 }], paymentStatus: 'Unpaid', paidAmount: 0 });
    const [viewItem, setViewItem] = useState(null);

    const load = () => { fetch('/api/purchases').then(r => r.json()).then(setPurchases); fetch('/api/products').then(r => r.json()).then(setProducts); fetch('/api/suppliers').then(r => r.json()).then(setSuppliers); };
    useEffect(() => { load() }, []);

    const filtered = purchases.filter(p => p.purchaseId?.toLowerCase().includes(search.toLowerCase()) || p.supplier?.toLowerCase().includes(search.toLowerCase()));
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
    const paged = filtered.slice((page - 1) * PAGE, page * PAGE);

    const totalSpent = purchases.reduce((s, p) => s + (p.total || 0), 0);
    const pending = purchases.filter(p => p.status === 'Pending').length;
    const received = purchases.filter(p => p.status === 'Received').length;

    const addItem = () => setForm({ ...form, items: [...form.items, { name: '', qty: 0, costPrice: 0 }] });
    const updateItem = (i, field, val) => { const items = [...form.items]; items[i] = { ...items[i], [field]: val }; setForm({ ...form, items }); };
    const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

    const handleSave = async () => {
        const total = form.items.reduce((s, i) => s + i.qty * i.costPrice, 0);
        const data = { ...form, purchaseId: 'PO-' + Date.now().toString(36).toUpperCase(), total, status: 'Pending', date: new Date().toISOString().split('T')[0] };
        await fetch('/api/purchases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setModal(null); setForm({ supplier: '', items: [{ name: '', qty: 0, costPrice: 0 }], paymentStatus: 'Unpaid', paidAmount: 0 }); load();
    };

    const markReceived = async (purchase) => {
        if (!confirm('Mark as received? This will update stock levels.')) return;
        await fetch('/api/purchases', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: purchase.id, status: 'Received' }) });
        load();
    };

    const badge = s => s === 'Received' ? 'green' : s === 'Pending' ? 'yellow' : 'red';
    const payBadge = s => s === 'Paid' ? 'green' : s === 'Partial' ? 'yellow' : 'red';

    return (
        <>
            <div className="stats">
                <div className="stat-card"><div className="ic blue"><Truck size={22} /></div><div><h3>Total Orders</h3><div className="val">{purchases.length}</div></div></div>
                <div className="stat-card"><div className="ic green"><CheckCircle size={22} /></div><div><h3>Received</h3><div className="val">{received}</div></div></div>
                <div className="stat-card"><div className="ic yellow"><Clock size={22} /></div><div><h3>Pending</h3><div className="val">{pending}</div></div></div>
                <div className="stat-card"><div className="ic purple"><DollarSign size={22} /></div><div><h3>Total Spent</h3><div className="val">${totalSpent.toLocaleString()}</div></div></div>
            </div>
            <div className="tbl-wrap">
                <div className="tbl-bar">
                    <div className="left"><div className="search-box"><Search size={15} /><input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div></div>
                    <div className="right"><button className="btn btn-p" onClick={() => setModal('add')}><Plus size={15} />New Purchase</button></div>
                </div>
                <table className="tbl"><thead><tr><th>PO ID</th><th>Supplier</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead>
                    <tbody>{paged.map(p => (
                        <tr key={p.id}><td className="m">{p.purchaseId}</td><td>{p.supplier}</td><td>{p.items?.length}</td>
                            <td style={{ fontWeight: 600 }}>${Number(p.total).toLocaleString()}</td><td>{p.date}</td>
                            <td><span className={`badge ${badge(p.status)}`}>{p.status}</span></td>
                            <td><span className={`badge ${payBadge(p.paymentStatus)}`}>{p.paymentStatus}</span></td>
                            <td><div className="acts">
                                <button className="act" title="View" onClick={() => { setViewItem(p); setModal('view') }}><Eye size={15} /></button>
                                {p.status === 'Pending' && <button className="act" title="Mark Received" onClick={() => markReceived(p)}><CheckCircle size={15} /></button>}
                            </div></td>
                        </tr>
                    ))}</tbody>
                </table>
                <div className="tbl-foot">
                    <span className="show">{Math.min((page - 1) * PAGE + 1, filtered.length)}-{Math.min(page * PAGE, filtered.length)} of {filtered.length}</span>
                    <div className="pages"><button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={15} /></button>{Array.from({ length: pages }, (_, i) => <button key={i + 1} className={page === i + 1 ? 'on' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={15} /></button></div>
                </div>
            </div>

            {modal === 'add' && (
                <div className="modal-overlay" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}>
                    <h2>New Purchase Order</h2>
                    <div className="fg" style={{ marginBottom: 12 }}><label>Supplier</label><select value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                        <option value="">Select supplier...</option>{suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select></div>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>Items</h4>
                    {form.items.map((item, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                            <select value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.82rem' }}>
                                <option value="">Product...</option>{products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                            <input type="number" placeholder="Qty" value={item.qty || ''} onChange={e => updateItem(i, 'qty', parseInt(e.target.value) || 0)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 6 }} />
                            <input type="number" placeholder="Cost" value={item.costPrice || ''} onChange={e => updateItem(i, 'costPrice', parseFloat(e.target.value) || 0)} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 6 }} step="0.01" />
                            <button onClick={() => removeItem(i)} style={{ color: 'var(--red)', padding: '8px' }}><X size={14} /></button>
                        </div>
                    ))}
                    <button className="btn btn-o" onClick={addItem} style={{ marginBottom: 12 }}><Plus size={14} />Add Item</button>
                    <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '0.9rem', marginBottom: 12 }}>Total: ${form.items.reduce((s, i) => s + i.qty * i.costPrice, 0).toFixed(2)}</div>
                    <div className="actions"><button className="btn btn-o" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-p" onClick={handleSave}>Create Order</button></div>
                </div></div>
            )}

            {modal === 'view' && viewItem && (
                <div className="modal-overlay" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}>
                    <h2>Purchase Order: {viewItem.purchaseId}</h2>
                    <div className="form-grid"><div className="fg"><label>Supplier</label><input readOnly value={viewItem.supplier} /></div><div className="fg"><label>Date</label><input readOnly value={viewItem.date} /></div><div className="fg"><label>Status</label><input readOnly value={viewItem.status} /></div><div className="fg"><label>Payment</label><input readOnly value={viewItem.paymentStatus} /></div></div>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 600, margin: '12px 0 8px' }}>Items</h4>
                    <table className="tbl"><thead><tr><th>Product</th><th>Qty</th><th>Cost</th><th>Subtotal</th></tr></thead>
                        <tbody>{viewItem.items?.map((item, i) => <tr key={i}><td>{item.name}</td><td>{item.qty}</td><td>${Number(item.costPrice).toFixed(2)}</td><td style={{ fontWeight: 600 }}>${(item.qty * item.costPrice).toFixed(2)}</td></tr>)}</tbody>
                    </table>
                    <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', marginTop: 12 }}>Total: ${Number(viewItem.total).toLocaleString()}</div>
                    <div className="actions"><button className="btn btn-o" onClick={() => setModal(null)}>Close</button></div>
                </div></div>
            )}
        </>
    );
}
