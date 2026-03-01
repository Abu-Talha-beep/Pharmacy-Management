import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
    return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection) {
    ensureDir();
    const fp = getFilePath(collection);
    if (!fs.existsSync(fp)) {
        fs.writeFileSync(fp, '[]', 'utf-8');
        return [];
    }
    return JSON.parse(fs.readFileSync(fp, 'utf-8'));
}

function writeCollection(collection, data) {
    ensureDir();
    fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2), 'utf-8');
}

// Generic CRUD
export function getAll(collection) {
    return readCollection(collection);
}

export function getById(collection, id) {
    return readCollection(collection).find(item => item.id === id) || null;
}

export function create(collection, data) {
    const items = readCollection(collection);
    const newItem = { id: uuidv4(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    items.push(newItem);
    writeCollection(collection, items);
    return newItem;
}

export function update(collection, id, data) {
    const items = readCollection(collection);
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    writeCollection(collection, items);
    return items[idx];
}

export function remove(collection, id) {
    const items = readCollection(collection);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    writeCollection(collection, filtered);
    return true;
}

export function query(collection, filterFn) {
    return readCollection(collection).filter(filterFn);
}

// Audit logging
export function logAudit(action, entity, entityId, details, user = 'Admin') {
    const log = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        user,
        action,
        entity,
        entityId,
        details
    };
    const logs = readCollection('audit_logs');
    logs.unshift(log);
    if (logs.length > 1000) logs.length = 1000; // Keep last 1000
    writeCollection('audit_logs', logs);
    return log;
}

export function generateId(prefix = '') {
    const num = Math.floor(Math.random() * 9000) + 1000;
    return prefix ? `${prefix}-${num}` : uuidv4();
}
