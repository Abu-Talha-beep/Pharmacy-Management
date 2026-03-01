'use client';
import { useEffect } from 'react';
export function SeedInit() {
    useEffect(() => { fetch('/api/seed').catch(() => { }); }, []);
    return null;
}
