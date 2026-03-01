'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';


export default function ScannerModal({ onScan, onClose }) {
    const scannerRef = useRef(null);

    useEffect(() => {
        const { Html5Qrcode } = require('html5-qrcode');
        const scanner = new Html5Qrcode('barcode-reader');
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            (decodedText) => {
                onScan(decodedText);
            },
            () => { }
        ).catch(err => {
            console.error('Camera error:', err);
        });

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { }).finally(() => {
                    scannerRef.current.clear().catch(() => { });
                });
            }
        };
    }, [onScan]);

    return (
        <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Scan Barcode</h3>
                    <button onClick={onClose} style={{ color: 'var(--muted)' }}><X size={20} /></button>
                </div>
                <div id="barcode-reader" style={{ width: '100%', minHeight: 250, background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}></div>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--light)', marginTop: 12 }}>Position the barcode within the frame</p>
            </div>
        </div>
    );
}
