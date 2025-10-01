import type { Request } from 'express';

export function getIp(req: Request): string | null {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        const ips = forwarded.split(',').map(ip => ip.trim());
        return ips[0];
    }

    let ip = req.socket.remoteAddress;

    if (ip === '::1') {
        ip = '127.0.0.1';
    }

    if (ip && ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }

    return ip || null;
}
