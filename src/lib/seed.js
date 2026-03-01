import { getAll, create } from './db';

export function seedIfEmpty() {
    // Products
    if (getAll('products').length === 0) {
        const products = [
            { productId: 'MED-001', name: 'Paracetamol 500mg', category: 'Pain Relievers', batchNo: 'B2024-001', quantity: 500, price: 5.00, costPrice: 3.20, supplier: 'PharmaCorp', expiryDate: '2026-03-15', barcode: '8901234567890', status: 'In Stock', minStock: 50 },
            { productId: 'MED-002', name: 'Amoxicillin 250mg', category: 'Antibiotics', batchNo: 'B2024-002', quantity: 49, price: 7.90, costPrice: 5.10, supplier: 'MediSupply', expiryDate: '2025-12-18', barcode: '8901234567891', status: 'Low Stock', minStock: 50 },
            { productId: 'MED-003', name: 'Ibuprofen 400mg', category: 'Pain Relievers', batchNo: 'B2024-003', quantity: 0, price: 4.50, costPrice: 2.80, supplier: 'PharmaCorp', expiryDate: '2025-11-01', barcode: '8901234567892', status: 'Out of Stock', minStock: 50 },
            { productId: 'MED-004', name: 'Cetirizine 10mg', category: 'Allergy', batchNo: 'B2024-004', quantity: 180, price: 3.50, costPrice: 2.00, supplier: 'HealthFirst', expiryDate: '2026-09-30', barcode: '8901234567893', status: 'In Stock', minStock: 50 },
            { productId: 'MED-005', name: 'Metformin 500mg', category: 'Diabetes Care', batchNo: 'B2024-005', quantity: 220, price: 6.20, costPrice: 4.00, supplier: 'DiaCare Ltd', expiryDate: '2026-06-22', barcode: '8901234567894', status: 'In Stock', minStock: 50 },
            { productId: 'MED-006', name: 'Omeprazole 20mg', category: 'Cardiovascular', batchNo: 'B2024-006', quantity: 35, price: 8.75, costPrice: 5.50, supplier: 'MediSupply', expiryDate: '2025-08-10', barcode: '8901234567895', status: 'Low Stock', minStock: 50 },
            { productId: 'MED-007', name: 'Aspirin 100mg', category: 'Pain Relievers', batchNo: 'B2024-007', quantity: 0, price: 2.30, costPrice: 1.20, supplier: 'PharmaCorp', expiryDate: '2025-02-05', barcode: '8901234567896', status: 'Out of Stock', minStock: 50 },
            { productId: 'MED-008', name: 'Loratadine 10mg', category: 'Allergy', batchNo: 'B2024-008', quantity: 150, price: 4.00, costPrice: 2.50, supplier: 'HealthFirst', expiryDate: '2027-01-28', barcode: '8901234567897', status: 'In Stock', minStock: 50 },
            { productId: 'MED-009', name: 'Atorvastatin 20mg', category: 'Cardiovascular', batchNo: 'B2024-009', quantity: 90, price: 12.50, costPrice: 8.00, supplier: 'CardioMed', expiryDate: '2026-07-14', barcode: '8901234567898', status: 'In Stock', minStock: 50 },
            { productId: 'MED-010', name: 'Azithromycin 500mg', category: 'Antibiotics', batchNo: 'B2024-010', quantity: 18, price: 15.00, costPrice: 10.00, supplier: 'MediSupply', expiryDate: '2025-04-03', barcode: '8901234567899', status: 'Low Stock', minStock: 50 },
            { productId: 'MED-011', name: 'Diclofenac 50mg', category: 'Pain Relievers', batchNo: 'B2024-011', quantity: 0, price: 3.80, costPrice: 2.20, supplier: 'PharmaCorp', expiryDate: '2025-09-19', barcode: '8901234567900', status: 'Out of Stock', minStock: 50 },
            { productId: 'MED-012', name: 'Salbutamol Inhaler', category: 'Respiratory', batchNo: 'B2024-012', quantity: 64, price: 22.00, costPrice: 15.00, supplier: 'RespiCare', expiryDate: '2026-12-25', barcode: '8901234567901', status: 'In Stock', minStock: 20 },
            { productId: 'MED-013', name: 'Vitamin D3 1000IU', category: 'Vitamins', batchNo: 'B2024-013', quantity: 300, price: 8.00, costPrice: 4.50, supplier: 'VitaHealth', expiryDate: '2027-06-15', barcode: '8901234567902', status: 'In Stock', minStock: 50 },
            { productId: 'MED-014', name: 'Insulin Glargine', category: 'Diabetes Care', batchNo: 'B2024-014', quantity: 25, price: 45.00, costPrice: 32.00, supplier: 'DiaCare Ltd', expiryDate: '2025-10-20', barcode: '8901234567903', status: 'Low Stock', minStock: 30 },
            { productId: 'MED-015', name: 'Amlodipine 5mg', category: 'Cardiovascular', batchNo: 'B2024-015', quantity: 200, price: 6.50, costPrice: 3.80, supplier: 'CardioMed', expiryDate: '2027-03-01', barcode: '8901234567904', status: 'In Stock', minStock: 50 },
        ];
        products.forEach(p => create('products', p));
    }

    // Customers
    if (getAll('customers').length === 0) {
        const customers = [
            { customerId: 'C001', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555-0101', address: '123 Oak St', totalOrders: 24, totalSpent: 1240, creditBalance: 0, loyaltyPoints: 240, status: 'Active' },
            { customerId: 'C002', name: 'Mike Peters', email: 'mike@email.com', phone: '+1 555-0102', address: '456 Pine Ave', totalOrders: 18, totalSpent: 890, creditBalance: 50, loyaltyPoints: 180, status: 'Active' },
            { customerId: 'C003', name: 'Emily Davis', email: 'emily@email.com', phone: '+1 555-0103', address: '789 Elm Dr', totalOrders: 32, totalSpent: 2100, creditBalance: 0, loyaltyPoints: 420, status: 'Active' },
            { customerId: 'C004', name: 'James Wilson', email: 'james@email.com', phone: '+1 555-0104', address: '321 Maple Ln', totalOrders: 5, totalSpent: 180, creditBalance: 25, loyaltyPoints: 36, status: 'Inactive' },
            { customerId: 'C005', name: 'Anna Lee', email: 'anna@email.com', phone: '+1 555-0105', address: '654 Birch Rd', totalOrders: 41, totalSpent: 3500, creditBalance: 0, loyaltyPoints: 700, status: 'Active' },
            { customerId: 'C006', name: 'Robert Brown', email: 'robert@email.com', phone: '+1 555-0106', address: '987 Cedar Ct', totalOrders: 12, totalSpent: 640, creditBalance: 0, loyaltyPoints: 128, status: 'Active' },
        ];
        customers.forEach(c => create('customers', c));
    }

    // Suppliers
    if (getAll('suppliers').length === 0) {
        const suppliers = [
            { supplierId: 'SUP-001', name: 'PharmaCorp Inc.', contact: 'John Smith', email: 'john@pharmacorp.com', phone: '+1 555-1001', address: '100 Pharma Blvd', totalOrders: 45, totalPaid: 52000, outstanding: 3200, status: 'Active' },
            { supplierId: 'SUP-002', name: 'MediSupply Co.', contact: 'Jane Doe', email: 'jane@medisupply.com', phone: '+1 555-1002', address: '200 Med Way', totalOrders: 32, totalPaid: 38000, outstanding: 1500, status: 'Active' },
            { supplierId: 'SUP-003', name: 'HealthFirst Ltd.', contact: 'Bob Wilson', email: 'bob@healthfirst.com', phone: '+1 555-1003', address: '300 Health Rd', totalOrders: 20, totalPaid: 22000, outstanding: 0, status: 'Active' },
            { supplierId: 'SUP-004', name: 'DiaCare Ltd.', contact: 'Lisa Chen', email: 'lisa@diacare.com', phone: '+1 555-1004', address: '400 Care St', totalOrders: 15, totalPaid: 18000, outstanding: 800, status: 'Active' },
            { supplierId: 'SUP-005', name: 'CardioMed Corp.', contact: 'Tom Evans', email: 'tom@cardiomed.com', phone: '+1 555-1005', address: '500 Heart Ave', totalOrders: 10, totalPaid: 15000, outstanding: 2000, status: 'Active' },
            { supplierId: 'SUP-006', name: 'RespiCare Inc.', contact: 'Amy Taylor', email: 'amy@respicare.com', phone: '+1 555-1006', address: '600 Lung Ln', totalOrders: 8, totalPaid: 9000, outstanding: 0, status: 'Inactive' },
        ];
        suppliers.forEach(s => create('suppliers', s));
    }

    // Sales
    if (getAll('sales').length === 0) {
        const sales = [
            { saleId: 'SAL-001', customer: 'Sarah Johnson', items: [{ name: 'Paracetamol 500mg', qty: 2, price: 5.00 }, { name: 'Cetirizine 10mg', qty: 1, price: 3.50 }], subtotal: 13.50, tax: 2.43, discount: 0, total: 15.93, paymentMethod: 'Credit Card', date: '2026-02-28', status: 'Completed' },
            { saleId: 'SAL-002', customer: 'Mike Peters', items: [{ name: 'Salbutamol Inhaler', qty: 1, price: 22.00 }], subtotal: 22.00, tax: 3.96, discount: 2.00, total: 23.96, paymentMethod: 'Cash', date: '2026-02-28', status: 'Completed' },
            { saleId: 'SAL-003', customer: 'Emily Davis', items: [{ name: 'Metformin 500mg', qty: 3, price: 6.20 }, { name: 'Atorvastatin 20mg', qty: 1, price: 12.50 }], subtotal: 31.10, tax: 5.60, discount: 0, total: 36.70, paymentMethod: 'Credit Card', date: '2026-02-27', status: 'Completed' },
            { saleId: 'SAL-004', customer: 'James Wilson', items: [{ name: 'Amoxicillin 250mg', qty: 2, price: 7.90 }], subtotal: 15.80, tax: 2.84, discount: 0, total: 18.64, paymentMethod: 'Cash', date: '2026-02-27', status: 'Returned' },
            { saleId: 'SAL-005', customer: 'Anna Lee', items: [{ name: 'Vitamin D3 1000IU', qty: 2, price: 8.00 }, { name: 'Loratadine 10mg', qty: 1, price: 4.00 }, { name: 'Paracetamol 500mg', qty: 3, price: 5.00 }], subtotal: 35.00, tax: 6.30, discount: 3.00, total: 38.30, paymentMethod: 'Debit Card', date: '2026-02-26', status: 'Completed' },
        ];
        sales.forEach(s => create('sales', s));
    }

    // Purchases
    if (getAll('purchases').length === 0) {
        const purchases = [
            { purchaseId: 'PO-001', supplier: 'PharmaCorp Inc.', items: [{ name: 'Paracetamol 500mg', qty: 500, costPrice: 3.20 }, { name: 'Aspirin 100mg', qty: 200, costPrice: 1.20 }], total: 1840, date: '2026-02-20', status: 'Received', paidAmount: 1840, paymentStatus: 'Paid' },
            { purchaseId: 'PO-002', supplier: 'MediSupply Co.', items: [{ name: 'Amoxicillin 250mg', qty: 100, costPrice: 5.10 }, { name: 'Azithromycin 500mg', qty: 50, costPrice: 10.00 }], total: 1010, date: '2026-02-22', status: 'Received', paidAmount: 500, paymentStatus: 'Partial' },
            { purchaseId: 'PO-003', supplier: 'DiaCare Ltd.', items: [{ name: 'Metformin 500mg', qty: 300, costPrice: 4.00 }], total: 1200, date: '2026-02-25', status: 'Pending', paidAmount: 0, paymentStatus: 'Unpaid' },
        ];
        purchases.forEach(p => create('purchases', p));
    }

    // Users
    if (getAll('users').length === 0) {
        const users = [
            { username: 'admin', password: 'admin123', name: 'James Bond', role: 'Admin', email: 'admin@fasilpharmacy.com', status: 'Active' },
            { username: 'pharmacist', password: 'pharma123', name: 'Sarah Miller', role: 'Pharmacist', email: 'sarah@fasilpharmacy.com', status: 'Active' },
            { username: 'cashier', password: 'cash123', name: 'Tom Clark', role: 'Cashier', email: 'tom@fasilpharmacy.com', status: 'Active' },
            { username: 'manager', password: 'manager123', name: 'Lisa White', role: 'Store Manager', email: 'lisa@fasilpharmacy.com', status: 'Active' },
        ];
        users.forEach(u => create('users', u));
    }

    // Prescriptions
    if (getAll('prescriptions').length === 0) {
        const prescriptions = [
            { prescriptionId: 'RX-001', customer: 'Sarah Johnson', doctor: 'Dr. Smith', hospital: 'City Hospital', date: '2026-02-28', medicines: ['Paracetamol 500mg', 'Cetirizine 10mg'], notes: 'Take after meals', linkedSale: 'SAL-001' },
            { prescriptionId: 'RX-002', customer: 'Emily Davis', doctor: 'Dr. Patel', hospital: 'Metro Clinic', date: '2026-02-27', medicines: ['Metformin 500mg', 'Atorvastatin 20mg'], notes: 'Morning and evening', linkedSale: 'SAL-003' },
        ];
        prescriptions.forEach(p => create('prescriptions', p));
    }
}
