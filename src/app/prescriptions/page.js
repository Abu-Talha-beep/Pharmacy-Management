'use client';
import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Search, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE = 5;
const empty = { prescriptionId: '', customer: '', doctor: '', hospital: '', date: '', medicines: [], notes: '', linkedSale: '' };

export default function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(empty);
    const [viewItem, setViewItem] = useState(null);
    const [medInput, setMedInput] = useState('');
    const load = () => fetch('/api/prescriptions').then(r => r.json()).then(setPrescriptions);
    useEffect(() => { load() }, []);

    const filtered = prescriptions.filter(p => p.customer?.toLowerCase().includes(search.toLowerCase()) || p.prescriptionId?.toLowerCase().includes(search.toLowerCase()) || p.doctor?.toLowerCase().includes(search.toLowerCase()));
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
    const paged = filtered.slice((page - 1) * PAGE, page * PAGE);

    const addMed = () => { if (medInput.trim()) { setForm({ ...form, medicines: [...form.medicines, medInput.trim()] }); setMedInput('') } };
    const removeMed = (i) => setForm({ ...form, medicines: form.medicines.filter((_, idx) => idx !== i) });

    const handleSave = async () => {
        const data = { ...form, prescriptionId: 'RX-' + Date.now().toString(36).toUpperCase(), date: new Date().toISOString().split('T')[0] };
        await fetch('/api/prescriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setModal(null); setForm(empty); load();
    };
    const handleDel = async (id) => { if (!confirm('Delete?')) return; await fetch('/api/prescriptions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); load(); };

    return (
        <>
            <div className="stats c3">
                <div className="stat-card"><div className="ic blue"><ClipboardList size={22} /></div><div><h3>Total Prescriptions</h3><div className="val">{prescriptions.length}</div></div></div>
                <div className="stat-card"><div className="ic green"><ClipboardList size={22} /></div><div><h3>This Month</h3><div className="val">{prescriptions.filter(p => { const d = new Date(p.date); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }).length}</div></div></div>
                <div className="stat-card"><div className="ic purple"><ClipboardList size={22} /></div><div><h3>Linked to Sales</h3><div className="val">{prescriptions.filter(p => p.linkedSale).length}</div></div></div>
            </div>
            <div className="tbl-wrap">
                <div className="tbl-bar">
                    <div className="left"><div className="search-box"><Search size={15} /><input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div></div>
                    <div className="right"><button className="btn btn-p" onClick={() => setModal('add')}><Plus size={15} />Add Prescription</button></div>
                </div>
                <table className="tbl"><thead><tr><th>Rx ID</th><th>Customer</th><th>Doctor</th><th>Hospital</th><th>Date</th><th>Medicines</th><th>Sale Link</th><th>Actions</th></tr></thead>
                    <tbody>{paged.map(p => (
                        <tr key={p.id}><td className="m">{p.prescriptionId}</td><td>{p.customer}</td><td>{p.doctor}</td><td>{p.hospital}</td><td>{p.date}</td>
                            <td>{p.medicines?.length || 0} items</td><td>{p.linkedSale ? <span className="badge green">{p.linkedSale}</span> : <span className="badge yellow">Unlinked</span>}</td>
                            <td><div className="acts"><button className="act" onClick={() => { setViewItem(p); setModal('view') }}><Eye size={15} /></button><button className="act" onClick={() => handleDel(p.id)}><Trash2 size={15} /></button></div></td>
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
                    <h2>Add Prescription</h2>
                    <div className="form-grid">
                        <div className="fg"><label>Customer</label><input value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} /></div>
                        <div className="fg"><label>Doctor</label><input value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} /></div>
                        <div className="fg"><label>Hospital/Clinic</label><input value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} /></div>
                        <div className="fg"><label>Link to Sale ID</label><input value={form.linkedSale} onChange={e => setForm({ ...form, linkedSale: e.target.value })} placeholder="e.g. SAL-001" /></div>
                    </div>
                    <div className="fg" style={{ marginTop: 12 }}><label>Medicines</label>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><input value={medInput} onChange={e => setMedInput(e.target.value)} placeholder="Medicine name..." style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6 }} onKeyDown={e => e.key === 'Enter' && addMed()} /><button className="btn btn-p" onClick={addMed}>Add</button></div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{form.medicines.map((m, i) => <span key={i} className="badge blue" style={{ cursor: 'pointer' }} onClick={() => removeMed(i)}>{m} ×</span>)}</div>
                    </div>
                    <div className="fg" style={{ marginTop: 12 }}><label>Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, minHeight: 60 }} placeholder="Dosage instructions..." /></div>
                    <div className="actions"><button className="btn btn-o" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-p" onClick={handleSave}>Save</button></div>
                </div></div>
            )}

            {modal === 'view' && viewItem && (
                <div className="modal-overlay" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}>
                    <h2>Prescription: {viewItem.prescriptionId}</h2>
                    <div className="form-grid"><div className="fg"><label>Customer</label><input readOnly value={viewItem.customer} /></div><div className="fg"><label>Doctor</label><input readOnly value={viewItem.doctor} /></div><div className="fg"><label>Hospital</label><input readOnly value={viewItem.hospital} /></div><div className="fg"><label>Date</label><input readOnly value={viewItem.date} /></div></div>
                    <div style={{ marginTop: 12 }}><label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--muted)' }}>Medicines</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{viewItem.medicines?.map((m, i) => <span key={i} className="badge blue">{m}</span>)}</div></div>
                    {viewItem.notes && <div style={{ marginTop: 12 }}><label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--muted)' }}>Notes</label><p style={{ fontSize: '0.82rem', marginTop: 4 }}>{viewItem.notes}</p></div>}
                    <div className="actions"><button className="btn btn-o" onClick={() => setModal(null)}>Close</button></div>
                </div></div>
            )}
        </>
    );
}
