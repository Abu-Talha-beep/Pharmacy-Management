'use client';
import { useState, useEffect } from 'react';
import { Shield, Search, Plus, Pencil, Trash2, RotateCcw, Eye } from 'lucide-react';

export default function Audit() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    useEffect(() => { fetch('/api/audit').then(r => r.json()).then(setLogs) }, []);

    const filtered = logs.filter(l =>
        (l.details?.toLowerCase().includes(search.toLowerCase()) || l.entity?.toLowerCase().includes(search.toLowerCase())) &&
        (filter === 'All' || l.action === filter)
    );

    const iconMap = { CREATE: 'green', UPDATE: 'blue', DELETE: 'red', RETURN: 'yellow', RECEIVE: 'purple' };
    const actionIcons = { CREATE: <Plus size={14} />, UPDATE: <Pencil size={14} />, DELETE: <Trash2 size={14} />, RETURN: <RotateCcw size={14} />, RECEIVE: <Eye size={14} /> };

    const formatTime = (ts) => { const d = new Date(ts); return d.toLocaleDateString() + ' ' + d.toLocaleTimeString() };

    return (
        <>
            <div className="stats">
                <div className="stat-card"><div className="ic blue"><Shield size={22} /></div><div><h3>Total Logs</h3><div className="val">{logs.length}</div></div></div>
                <div className="stat-card"><div className="ic green"><Plus size={22} /></div><div><h3>Creates</h3><div className="val">{logs.filter(l => l.action === 'CREATE').length}</div></div></div>
                <div className="stat-card"><div className="ic yellow"><Pencil size={22} /></div><div><h3>Updates</h3><div className="val">{logs.filter(l => l.action === 'UPDATE').length}</div></div></div>
                <div className="stat-card"><div className="ic red"><Trash2 size={22} /></div><div><h3>Deletes</h3><div className="val">{logs.filter(l => l.action === 'DELETE').length}</div></div></div>
            </div>

            <div className="tbl-wrap">
                <div className="tbl-bar">
                    <div className="left">
                        <div className="search-box"><Search size={15} /><input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                        {['All', 'CREATE', 'UPDATE', 'DELETE', 'RETURN'].map(a => <button key={a} className={`btn ${filter === a ? 'btn-p' : 'btn-o'}`} onClick={() => setFilter(a)}>{a === 'All' ? 'All' : a}</button>)}
                    </div>
                </div>

                <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                    {filtered.length === 0 && <p style={{ color: 'var(--light)', textAlign: 'center', padding: 30 }}>No audit logs yet. Perform some actions to see them here.</p>}
                    {filtered.map(log => (
                        <div className="log-entry" key={log.id}>
                            <div className="log-icon" style={{ background: `var(--${iconMap[log.action] || 'blue'}-bg)`, color: `var(--${iconMap[log.action] || 'blue'})` }}>
                                {actionIcons[log.action] || <Shield size={14} />}
                            </div>
                            <div className="log-info">
                                <div className="log-action"><span className={`badge ${iconMap[log.action] || 'blue'}`} style={{ marginRight: 6 }}>{log.action}</span>{log.entity}</div>
                                <div className="log-detail">{log.details}</div>
                            </div>
                            <div className="log-time">{formatTime(log.timestamp)}<br /><span style={{ fontSize: '0.68rem' }}>by {log.user}</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
