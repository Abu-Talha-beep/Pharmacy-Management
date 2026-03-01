// Transform MongoDB _id to id for frontend compatibility
export function toJSON(doc) {
    if (!doc) return null;
    if (Array.isArray(doc)) return doc.map(d => toJSON(d));
    const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
    if (obj._id) {
        obj.id = obj._id.toString();
        delete obj._id;
    }
    if (obj.__v !== undefined) delete obj.__v;
    return obj;
}
