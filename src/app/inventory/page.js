'use client';
import { useState, useEffect } from 'react';
import { Package, AlertTriangle, XCircle, Search, Plus, Filter, Download, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X, ScanLine, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const ScannerModal = dynamic(() => import('@/components/ScannerModal'), { ssr: false });

const PAGE = 8;
const emptyProduct = { productId: '', name: '', category: 'Pain Relievers', batchNo: '', quantity: 0, price: 0, costPrice: 0, supplier: '', expiryDate: '', barcode: '', minStock: 50 };
const categories = ['Pain Relievers', 'Antibiotics', 'Allergy', 'Cardiovascular', 'Diabetes Care', 'Respiratory', 'Vitamins', 'Others'];

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null); // 'add' | 'edit' | 'view'
    const [form, setForm] = useState(emptyProduct);
    const [viewItem, setViewItem] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [loadingScan, setLoadingScan] = useState(false);

    const load = () => fetch('/api/products').then(r => r.json()).then(setProducts);
    useEffect(() => { load(); }, []);

    let filtered = products.filter(p =>
        (p.name?.toLowerCase().includes(search.toLowerCase()) || p.productId?.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search)) &&
        (filterCat === 'All' || p.category === filterCat) &&
        (filterStatus === 'All' || p.status === filterStatus)
    );
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / PAGE));
    const paged = filtered.slice((page - 1) * PAGE, page * PAGE);

    const inStock = products.filter(p => p.status === 'In Stock').length;
    const lowStock = products.filter(p => p.status === 'Low Stock').length;
    const outOfStock = products.filter(p => p.status === 'Out of Stock').length;

    const handleSave = async () => {
        if (modal === 'add') {
            await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        } else {
            await fetch('/api/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: form.id, ...form }) });
        }
        setModal(null); setForm(emptyProduct); load();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        load();
    };

    const handleScan = async (barcode) => {
        setScanning(false);
        setLoadingScan(true);
        try {
            // Use OpenFoodFacts API as a free public fallback
            const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await res.json();

            let name = '';
            if (data.status === 1 && data.product) {
                name = data.product.product_name || data.product.generic_name || '';
            }

            setForm({
                ...emptyProduct,
                productId: 'MED-' + String(products.length + 1).padStart(3, '0'),
                barcode: barcode,
                name: name
            });
            setModal('add');
        } catch (err) {
            console.error('API lookup failed:', err);
            // Fallback: still open modal with just the barcode
            setForm({
                ...emptyProduct,
                productId: 'MED-' + String(products.length + 1).padStart(3, '0'),
                barcode: barcode
            });
            setModal('add');
        } finally {
            setLoadingScan(false);
        }
    };

    const badge = s => s === 'In Stock' ? 'green' : s === 'Low Stock' ? 'yellow' : 'red';

    return (
        <>
            <div className="stats c3">
                <div className="stat-card"><div className="ic green"><Package size={22} /></div><div><h3>In Stock</h3><div className="val">{inStock}</div></div></div>
                <div className="stat-card"><div className="ic yellow"><AlertTriangle size={22} /></div><div><h3>Low Stock</h3><div className="val">{lowStock}</div></div></div>
                <div className="stat-card"><div className="ic red"><XCircle size={22} /></div><div><h3>Out of Stock</h3><div className="val">{outOfStock}</div></div></div>
            </div>

            <div className="tbl-wrap">
                <div className="tbl-bar">
                    <div className="left">
                        <div className="search-box"><Search size={15} /><input placeholder="Search by name, ID, or barcode..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div>
                        <select className="btn btn-o" value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1) }}>
                            <option value="All">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select className="btn btn-o" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
                            <option value="All">All Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                    <div className="right">
                        <button className="btn btn-p" onClick={() => setScanning(true)} disabled={loadingScan}>
                            {loadingScan ? <Loader2 size={15} className="spin" /> : <ScanLine size={15} />}
                            {loadingScan ? 'Looking up...' : 'Scan to Add'}
                        </button>
                        <button className="btn btn-o" onClick={() => { setForm({ ...emptyProduct, productId: 'MED-' + String(products.length + 1).padStart(3, '0') }); setModal('add') }}><Plus size={15} />Add Product</button>
                        <button className="btn btn-o"><Download size={15} />Export</button>
                    </div>
                </div>

                <table className="tbl">
                    <thead><tr><th>ID</th><th>Product Name</th><th>Category</th><th>Batch</th><th>Qty</th><th>Price</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {paged.map(p => (
                            <tr key={p.id}>
                                <td className="m">{p.productId}</td>
                                <td>{p.name}</td>
                                <td className="m">{p.category}</td>
                                <td className="m">{p.batchNo}</td>
                                <td>{p.quantity}</td>
                                <td>${Number(p.price).toFixed(2)}</td>
                                <td>{p.expiryDate}</td>
                                <td><span className={`badge ${badge(p.status)}`}>{p.status}</span></td>
                                <td>
                                    <div className="acts">
                                        <button className="act" title="View" onClick={() => { setViewItem(p); setModal('view') }}><Eye size={15} /></button>
                                        <button className="act" title="Edit" onClick={() => { setForm(p); setModal('edit') }}><Pencil size={15} /></button>
                                        <button className="act" title="Delete" onClick={() => handleDelete(p.id)}><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="tbl-foot">
                    <span className="show">Showing {Math.min((page - 1) * PAGE + 1, total)}-{Math.min(page * PAGE, total)} of {total}</span>
                    <div className="pages">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={15} /></button>
                        {Array.from({ length: pages }, (_, i) => <button key={i + 1} className={page === i + 1 ? 'on' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>)}
                        <button disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={15} /></button>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {modal === 'view' && viewItem && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Product Details</h2>
                        <div className="form-grid">
                            {Object.entries({ ID: viewItem.productId, Name: viewItem.name, Category: viewItem.category, Batch: viewItem.batchNo, Quantity: viewItem.quantity, Price: '$' + Number(viewItem.price).toFixed(2), 'Cost Price': '$' + Number(viewItem.costPrice).toFixed(2), Supplier: viewItem.supplier, Expiry: viewItem.expiryDate, Barcode: viewItem.barcode, Status: viewItem.status, 'Min Stock': viewItem.minStock }).map(([k, v]) => (
                                <div className="fg" key={k}><label>{k}</label><input readOnly value={v} /></div>
                            ))}
                        </div>
                        <div className="actions"><button className="btn btn-o" onClick={() => setModal(null)}>Close</button></div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {(modal === 'add' || modal === 'edit') && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{modal === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
                        <div className="form-grid">
                            <div className="fg"><label>Product ID</label><input value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} /></div>
                            <div className="fg"><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="fg"><label>Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                            <div className="fg"><label>Batch No</label><input value={form.batchNo} onChange={e => setForm({ ...form, batchNo: e.target.value })} /></div>
                            <div className="fg"><label>Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} /></div>
                            <div className="fg"><label>Selling Price</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} /></div>
                            <div className="fg"><label>Cost Price</label><input type="number" step="0.01" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: parseFloat(e.target.value) || 0 })} /></div>
                            <div className="fg"><label>Supplier</label><input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} /></div>
                            <div className="fg"><label>Expiry Date</label><input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} /></div>
                            <div className="fg"><label>Barcode</label><input value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} /></div>
                            <div className="fg"><label>Min Stock Level</label><input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: parseInt(e.target.value) || 0 })} /></div>
                        </div>
                        <div className="actions">
                            <button className="btn btn-o" onClick={() => setModal(null)}>Cancel</button>
                            <button className="btn btn-p" onClick={handleSave}>{modal === 'add' ? 'Add Product' : 'Save Changes'}</button>
                        </div>
                    </div>
                </div>
            )}

            {scanning && <ScannerModal onScan={handleScan} onClose={() => setScanning(false)} />}
        </>
    );
}
