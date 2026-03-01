'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const [tab, setTab] = useState('store');
    const [store, setStore] = useState({ name: 'Fasil Pharmacy', email: 'admin@fasilpharmacy.com', phone: '+1 (800) 555-7476', address: '123 Medical Avenue, Healthcare City, HC 10001', taxRate: 18, currency: 'USD', timezone: 'America/New_York', lowStockThreshold: 50 });
    const [saved, setSaved] = useState(false);
    const [users, setUsers] = useState([]);
    const [userModal, setUserModal] = useState(null);
    const [userForm, setUserForm] = useState({ username: '', name: '', email: '', role: 'Pharmacist', password: '', status: 'Active' });
    const [notifs, setNotifs] = useState({ lowStock: true, newOrders: true, payments: true, expiry: true, reports: false });

    useEffect(() => { fetch('/api/users').then(r => r.json()).then(setUsers) }, []);

    const saveStore = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) };

    const saveUser = async () => {
        if (userModal === 'add') await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userForm) });
        else await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: userForm.id, ...userForm }) });
        setUserModal(null); setUserForm({ username: '', name: '', email: '', role: 'Pharmacist', password: '', status: 'Active' });
        fetch('/api/users').then(r => r.json()).then(setUsers);
    };
    const delUser = async (id) => { if (!confirm('Delete user?')) return; await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetch('/api/users').then(r => r.json()).then(setUsers) };

    const tabs = [{ id: 'store', label: 'Store Info' }, { id: 'users', label: 'User Management' }, { id: 'notifications', label: 'Notifications' }, { id: 'appearance', label: 'Appearance' }];

    return (
        <>
            <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
                {tabs.map(t => <button key={t.id} className={`btn ${tab === t.id ? 'btn-p' : 'btn-o'}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
            </div>

            {tab === 'store' && (
                <div className="section">
                    <h3>Store Information</h3>
                    <div className="form-grid">
                        <div className="fg"><label>Store Name</label><input value={store.name} onChange={e => setStore({ ...store, name: e.target.value })} /></div>
                        <div className="fg"><label>Email</label><input value={store.email} onChange={e => setStore({ ...store, email: e.target.value })} /></div>
                        <div className="fg"><label>Phone</label><input value={store.phone} onChange={e => setStore({ ...store, phone: e.target.value })} /></div>
                        <div className="fg"><label>Tax Rate (%)</label><input type="number" value={store.taxRate} onChange={e => setStore({ ...store, taxRate: parseFloat(e.target.value) || 0 })} /></div>
                        <div className="fg"><label>Currency</label><select value={store.currency} onChange={e => setStore({ ...store, currency: e.target.value })}><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="PKR">PKR (₨)</option></select></div>
                        <div className="fg"><label>Low Stock Threshold</label><input type="number" value={store.lowStockThreshold} onChange={e => setStore({ ...store, lowStockThreshold: parseInt(e.target.value) || 0 })} /></div>
                    </div>
                    <div className="fg" style={{ marginTop: 12 }}><label>Address</label><input value={store.address} onChange={e => setStore({ ...store, address: e.target.value })} /></div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
                        <button className="btn btn-p" onClick={saveStore}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
                    </div>
                </div>
            )}

            {tab === 'users' && (
                <div className="tbl-wrap">
                    <div className="tbl-bar"><div className="left"><h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>User Accounts</h3></div>
                        <div className="right"><button className="btn btn-p" onClick={() => setUserModal('add')}><Plus size={15} />Add User</button></div>
                    </div>
                    <table className="tbl"><thead><tr><th>Username</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{users.map(u => (
                            <tr key={u.id}><td>{u.username}</td><td>{u.name}</td><td className="m">{u.email}</td>
                                <td><span className={`badge ${u.role === 'Admin' ? 'red' : u.role === 'Pharmacist' ? 'green' : u.role === 'Cashier' ? 'blue' : 'purple'}`}>{u.role}</span></td>
                                <td><span className={`badge ${u.status === 'Active' ? 'green' : 'red'}`}>{u.status}</span></td>
                                <td><div className="acts"><button className="act" onClick={() => { setUserForm(u); setUserModal('edit') }}><Pencil size={15} /></button><button className="act" onClick={() => delUser(u.id)}><Trash2 size={15} /></button></div></td>
                            </tr>
                        ))}</tbody>
                    </table>
                    {(userModal === 'add' || userModal === 'edit') && (
                        <div className="modal-overlay" onClick={() => setUserModal(null)}><div className="modal" onClick={e => e.stopPropagation()}>
                            <h2>{userModal === 'add' ? 'Add User' : 'Edit User'}</h2>
                            <div className="form-grid">
                                <div className="fg"><label>Username</label><input value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} /></div>
                                <div className="fg"><label>Full Name</label><input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} /></div>
                                <div className="fg"><label>Email</label><input value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} /></div>
                                <div className="fg"><label>Role</label><select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}><option>Admin</option><option>Pharmacist</option><option>Cashier</option><option>Store Manager</option></select></div>
                                {userModal === 'add' && <div className="fg"><label>Password</label><input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} /></div>}
                                <div className="fg"><label>Status</label><select value={userForm.status} onChange={e => setUserForm({ ...userForm, status: e.target.value })}><option>Active</option><option>Inactive</option></select></div>
                            </div>
                            <div className="actions"><button className="btn btn-o" onClick={() => setUserModal(null)}>Cancel</button><button className="btn btn-p" onClick={saveUser}>Save</button></div>
                        </div></div>
                    )}
                </div>
            )}

            {tab === 'notifications' && (
                <div className="section">
                    <h3>Notification Preferences</h3>
                    {Object.entries({ lowStock: ['Low Stock Alerts', 'Get notified when products fall below threshold'], newOrders: ['New Order Alerts', 'Notifications for incoming orders'], payments: ['Payment Alerts', 'Alerts for payments'], expiry: ['Expiry Alerts', 'Warnings about expiring products'], reports: ['Weekly Reports', 'Receive weekly summary reports'] }).map(([key, [title, desc]]) => (
                        <div className="srow" key={key}><div className="info"><h4>{title}</h4><p>{desc}</p></div>
                            <div className={`toggle ${notifs[key] ? 'on' : ''}`} onClick={() => setNotifs({ ...notifs, [key]: !notifs[key] })} /></div>
                    ))}
                </div>
            )}

            {tab === 'appearance' && (
                <div className="section">
                    <h3>Appearance</h3>
                    <div className="srow"><div className="info"><h4>Dark Mode</h4><p>Switch to dark theme</p></div><div className={`toggle ${theme === 'dark' ? 'on' : ''}`} onClick={toggleTheme} /></div>
                </div>
            )}
        </>
    );
}
