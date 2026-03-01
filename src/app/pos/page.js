'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Minus, Plus, ShoppingCart, CreditCard, Banknote, Smartphone, Printer, ScanLine } from 'lucide-react';
import dynamic from 'next/dynamic';

const ScannerModal = dynamic(() => import('@/components/ScannerModal'), { ssr: false });

export default function POS() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [payMethod, setPayMethod] = useState('Cash');
    const [receipt, setReceipt] = useState(null);
    const [scanning, setScanning] = useState(false);
    const receiptRef = useRef();

    useEffect(() => {
        fetch('/api/products').then(r => r.json()).then(setProducts);
    }, []);

    const available = products.filter(p => p.quantity > 0 && (p.name?.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search)));

    // sellMode: 'pack' or 'tablet'
    const addToCart = (product, sellMode = 'pack') => {
        const unitsPerPack = product.unitsPerPack || 1;
        const unitPrice = sellMode === 'tablet'
            ? Number((product.price / unitsPerPack).toFixed(2))
            : Number(product.price);
        // Max stock: in pack mode = packs, in tablet mode = packs * unitsPerPack
        const maxQty = sellMode === 'tablet' ? product.quantity * unitsPerPack : product.quantity;
        const cartKey = product.id + '-' + sellMode;

        setCart(prev => {
            const existing = prev.find(c => c.cartKey === cartKey);
            if (existing) {
                if (existing.qty >= maxQty) return prev;
                return prev.map(c => c.cartKey === cartKey ? { ...c, qty: c.qty + 1 } : c);
            }
            return [...prev, {
                cartKey,
                id: product.id,
                name: product.name,
                price: unitPrice,
                qty: 1,
                maxQty,
                sellMode,
                unitsPerPack
            }];
        });
    };

    const handleScan = useCallback((decodedText) => {
        const product = products.find(p => p.barcode === decodedText && p.quantity > 0);
        if (product) {
            addToCart(product, 'pack');
            setScanning(false);
        } else {
            const partial = products.find(p => p.barcode?.includes(decodedText) && p.quantity > 0);
            if (partial) {
                addToCart(partial, 'pack');
                setScanning(false);
            } else {
                alert('Product not found for barcode: ' + decodedText);
                setScanning(false);
            }
        }
    }, [products, addToCart]);

    const updateQty = (cartKey, delta) => {
        setCart(prev => prev.map(c => {
            if (c.cartKey !== cartKey) return c;
            const newQty = c.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > c.maxQty) return c;
            return { ...c, qty: newQty };
        }).filter(Boolean));
    };

    const removeFromCart = (cartKey) => setCart(prev => prev.filter(c => c.cartKey !== cartKey));

    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const total = Math.max(0, subtotal - discount);

    const checkout = async () => {
        if (cart.length === 0) return alert('Cart is empty!');
        const saleData = {
            saleId: 'SAL-' + Date.now().toString(36).toUpperCase(),
            customer: 'Walk-in',
            customerId: null,
            items: cart.map(c => ({
                name: c.name,
                qty: c.qty,
                price: c.price,
                sellMode: c.sellMode,
                unitsPerPack: c.unitsPerPack
            })),
            subtotal: Number(subtotal.toFixed(2)),
            discount,
            total: Number(total.toFixed(2)),
            paymentMethod: payMethod,
            date: new Date().toISOString().split('T')[0],
            status: 'Completed'
        };
        await fetch('/api/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(saleData) });
        setReceipt(saleData);
        setCart([]); setDiscount(0);
        fetch('/api/products').then(r => r.json()).then(setProducts);
    };

    const printReceipt = () => {
        const printContent = receiptRef.current?.innerHTML;
        const w = window.open('', '', 'width=350,height=600');
        w.document.write(`<html><head><title>Receipt</title><style>body{font-family:monospace;font-size:12px;padding:20px;max-width:300px;margin:0 auto}h2{font-size:16px;text-align:center;margin:0}.r-header{text-align:center;border-bottom:1px dashed #000;padding-bottom:8px;margin-bottom:8px}.r-items{border-bottom:1px dashed #000;padding-bottom:8px;margin-bottom:8px}.r-item{display:flex;justify-content:space-between;padding:2px 0}.r-totals .r-item{font-weight:bold}.r-footer{text-align:center;margin-top:12px;font-size:11px}</style></head><body>${printContent}</body></html>`);
        w.document.close(); w.print(); w.close();
    };

    return (
        <div className="pos-layout">
            {/* Product Selection */}
            <div className="pos-products">
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <div className="search-box" style={{ flex: 1 }}>
                        <Search size={15} />
                        <input placeholder="Search products or scan barcode..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <button className="btn btn-p" onClick={() => setScanning(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                        <ScanLine size={16} /> Scan
                    </button>
                </div>
                <div className="pos-grid">
                    {available.map(p => {
                        const upp = p.unitsPerPack || 1;
                        const tabletPrice = (p.price / upp).toFixed(2);
                        return (
                            <div className="pos-item" key={p.id} style={{ cursor: 'default' }}>
                                <div className="pname">{p.name}</div>
                                <div className="pprice">RS {Number(p.price).toFixed(2)} <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>/pack</span></div>
                                {upp > 1 && <div style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 600 }}>RS {tabletPrice} /tablet ({upp} units)</div>}
                                <div className="pstock">Stock: {p.quantity} packs</div>
                                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                                    <button className="btn btn-p" style={{ flex: 1, fontSize: '0.72rem', padding: '5px 8px', justifyContent: 'center' }} onClick={() => addToCart(p, 'pack')}>
                                        + Pack
                                    </button>
                                    {upp > 1 && (
                                        <button className="btn btn-o" style={{ flex: 1, fontSize: '0.72rem', padding: '5px 8px', justifyContent: 'center', borderColor: 'var(--green)', color: 'var(--green)' }} onClick={() => addToCart(p, 'tablet')}>
                                            + Tablet
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {available.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--light)' }}>No products found</div>}
                </div>
            </div>

            {/* Cart */}
            <div className="pos-cart">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><ShoppingCart size={18} /> Cart ({cart.length})</h3>

                <div className="cart-items">
                    {cart.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--light)', fontSize: '0.82rem' }}>Add products to cart</div>}
                    {cart.map(item => (
                        <div className="cart-item" key={item.cartKey}>
                            <div className="ci-info">
                                <div className="ci-name">
                                    {item.name}
                                    <span style={{
                                        marginLeft: 6,
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        padding: '1px 6px',
                                        borderRadius: 4,
                                        background: item.sellMode === 'tablet' ? 'var(--green-bg, #dcfce7)' : 'var(--blue-bg, #dbeafe)',
                                        color: item.sellMode === 'tablet' ? 'var(--green, #16a34a)' : 'var(--blue, #2563eb)',
                                        textTransform: 'uppercase'
                                    }}>
                                        {item.sellMode}
                                    </span>
                                </div>
                                <div className="ci-price">RS {Number(item.price).toFixed(2)} × {item.qty} = RS {(item.price * item.qty).toFixed(2)}</div>
                            </div>
                            <div className="ci-qty">
                                <button onClick={() => updateQty(item.cartKey, -1)}><Minus size={12} /></button>
                                <span>{item.qty}</span>
                                <button onClick={() => updateQty(item.cartKey, 1)}><Plus size={12} /></button>
                                <button onClick={() => removeFromCart(item.cartKey)} style={{ color: 'var(--red)', background: 'var(--red-bg)' }}><X size={12} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="row"><span className="label">Subtotal</span><span>RS {subtotal.toFixed(2)}</span></div>
                    <div className="row">
                        <span className="label">Discount</span>
                        <input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} style={{ width: 70, textAlign: 'right', padding: '2px 6px', border: '1px solid var(--border)', borderRadius: 4 }} />
                    </div>
                    <div className="row total"><span>Total</span><span>RS {total.toFixed(2)}</span></div>
                </div>

                <div className="payment-modes">
                    {[{ label: 'Cash', icon: Banknote }, { label: 'Credit Card', icon: CreditCard }, { label: 'Online', icon: Smartphone }].map(m => (
                        <button key={m.label} className={payMethod === m.label ? 'selected' : ''} onClick={() => setPayMethod(m.label)}>
                            <m.icon size={14} style={{ marginRight: 4 }} />{m.label}
                        </button>
                    ))}
                </div>

                <button className="btn btn-p" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8, fontSize: '0.9rem' }} onClick={checkout}>
                    Complete Sale — RS {total.toFixed(2)}
                </button>
            </div>

            {/* Receipt Modal */}
            {receipt && (
                <div className="modal-overlay" onClick={() => setReceipt(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div ref={receiptRef} className="receipt">
                            <div className="r-header">
                                <h2>Faisal Pharmacy</h2>
                                <p>Main Pindi Purbia Road, Allah wala Chowk</p>
                                <p>Tel: +923000171722</p>
                                <p style={{ marginTop: 6 }}>Date: {receipt.date} | {receipt.saleId}</p>
                                <p>Customer: {receipt.customer}</p>
                            </div>
                            <div className="r-items">
                                {receipt.items.map((item, i) => (
                                    <div className="r-item" key={i}>
                                        <span>{item.name} x{item.qty} {item.sellMode === 'tablet' ? '(tablets)' : '(packs)'}</span>
                                        <span>RS {(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="r-totals">
                                <div className="r-item"><span>Subtotal</span><span>RS {receipt.subtotal.toFixed(2)}</span></div>
                                {receipt.discount > 0 && <div className="r-item"><span>Discount</span><span>-RS {receipt.discount.toFixed(2)}</span></div>}
                                <div className="r-item" style={{ fontWeight: 'bold', fontSize: 14, borderTop: '1px dashed #000', paddingTop: 4, marginTop: 4 }}><span>TOTAL</span><span>RS {receipt.total.toFixed(2)}</span></div>
                                <div className="r-item"><span>Payment</span><span>{receipt.paymentMethod}</span></div>
                            </div>
                            <div className="r-footer">
                                <p>Thank you for your purchase!</p>
                                <p>www.fasilpharmacy.com</p>
                            </div>
                        </div>
                        <div className="actions">
                            <button className="btn btn-o" onClick={() => setReceipt(null)}>Close</button>
                            <button className="btn btn-p" onClick={printReceipt}><Printer size={15} />Print Receipt</button>
                        </div>
                    </div>
                </div>
            )}

            {scanning && <ScannerModal onScan={handleScan} onClose={() => setScanning(false)} />}
        </div>
    );
}
