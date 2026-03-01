'use client';
import { useState } from 'react';
import { BookOpen, MessageCircle, Mail, Phone, ChevronDown, FileText, Video } from 'lucide-react';

const helpCards = [
    { icon: BookOpen, title: 'Documentation', desc: 'Browse guides and tutorials', color: 'blue' },
    { icon: Video, title: 'Video Tutorials', desc: 'Step-by-step walkthroughs', color: 'purple' },
    { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with support team', color: 'green' },
    { icon: Mail, title: 'Email Support', desc: 'support@fasilpharmacy.com', color: 'yellow' },
    { icon: Phone, title: 'Phone Support', desc: '+1 (800) 555-PHRM', color: 'red' },
    { icon: FileText, title: 'Release Notes', desc: 'Latest updates', color: 'blue' },
];

const faqs = [
    { q: 'How do I add a new product?', a: 'Go to Inventory → click "Add Product" button → fill in the details → click Save. Stock status is automatically calculated based on quantity and minimum stock level.' },
    { q: 'How does the POS system work?', a: 'Navigate to POS/Billing → search or browse products → click to add to cart → adjust quantities → select payment method → click "Complete Sale". Stock is automatically deducted and the customer receives loyalty points.' },
    { q: 'How do I process a return?', a: 'Go to Sales → find the sale → click the Return icon. This will restore the stock levels automatically and mark the sale as Returned.' },
    { q: 'How do purchase orders update stock?', a: 'Create a purchase order in Purchases → when you click "Mark Received", the system automatically adds the quantities to your inventory.' },
    { q: 'What do the stock status indicators mean?', a: '"In Stock" = above minimum threshold. "Low Stock" = below minimum threshold but > 0. "Out of Stock" = zero quantity. The minimum threshold can be set per product.' },
    { q: 'How do I track expiring products?', a: 'Visit Expiry & Batch page to see all products grouped by expiry timeline — expired, within 30 days, within 90 days, and safe.' },
    { q: 'Where can I see audit logs?', a: 'Every create, update, delete, return, and receive action is tracked. Go to Audit Logs to see the complete activity history.' },
    { q: 'How do I manage user roles?', a: 'Go to Settings → User Management tab. You can add users with roles: Admin, Pharmacist, Cashier, or Store Manager.' },
];

export default function Help() {
    const [open, setOpen] = useState(null);
    return (
        <>
            <div className="help-grid">
                {helpCards.map((c, i) => (
                    <div className="help-card" key={i}>
                        <div className={`hi ic ${c.color}`}><c.icon size={22} /></div>
                        <h3>{c.title}</h3><p>{c.desc}</p>
                    </div>
                ))}
            </div>

            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>Frequently Asked Questions</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--light)', marginBottom: 14 }}>Find quick answers to common questions</p>

            <div>
                {faqs.map((faq, i) => (
                    <div className={`faq-item ${open === i ? 'open' : ''}`} key={i}>
                        <div className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                            <span>{faq.q}</span><ChevronDown size={15} />
                        </div>
                        <div className="faq-a">{faq.a}</div>
                    </div>
                ))}
            </div>

            <div className="section" style={{ textAlign: 'center', padding: '40px 24px', marginTop: 20 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 6 }}>Still need help?</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--light)', marginBottom: 16 }}>Our support team is available 24/7</p>
                <button className="btn btn-p" style={{ padding: '12px 32px' }}><MessageCircle size={15} /> Contact Support</button>
            </div>
        </>
    );
}
