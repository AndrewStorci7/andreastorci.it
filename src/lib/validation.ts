import DOMPurify from 'isomorphic-dompurify';
import { Project } from '@ctypes';

const MAX_SIZE_FOR_SLICE = 10000

/**
 * Valida e sanitizza una stringa
 */
export function sanitizeString(input: unknown): string {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }

    return input
        .trim()
        .replace(/[<>]/g, '')
        .slice(0, MAX_SIZE_FOR_SLICE);
}

/**
 * Sanitizza HTML (usa DOMPurify)
 */
export function sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: [],
    });
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida URL
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);

        // Solo HTTP/HTTPS
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return false;
        }

        // Blocca localhost e IP privati
        const hostname = parsed.hostname.toLowerCase();
        if (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
        ) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export function validateProject(data: unknown): Project {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid project data');
    }

    const project = data as Record<string, unknown>;

    // Valida campi obbligatori
    if (typeof project.name !== 'string' || !project.name.trim()) {
        throw new Error('Project name is required');
    }

    if (typeof project.type !== 'string' || !project.type.trim()) {
        throw new Error('Project type is required');
    }

    if (!Array.isArray(project.role) || project.role.length === 0) {
        throw new Error('Project role is required');
    }

    if (typeof project.description !== 'string' || !project.description.trim()) {
        throw new Error('Project description is required');
    }

    if (!Array.isArray(project.technologies)) {
        throw new Error('Project technologies must be an array');
    }

    // Sanitizza stringhe
    const validated: Project = {
        name: sanitizeString(project.name).slice(0, 100),
        type: sanitizeString(project.type).slice(0, 50),
        role: project.role
            .filter((r): r is string => typeof r === 'string')
            .map((r) => sanitizeString(r).slice(0, 50)),
        description: sanitizeString(project.description),
        technologies: project.technologies
            .filter((t): t is string => typeof t === 'string')
            .map((t) => sanitizeString(t).slice(0, 30)),
    };

    // Valida campi opzionali
    if (project.link && typeof project.link === 'string') {
        if (!isValidUrl(project.link)) {
            throw new Error('Invalid project link URL');
        }
        validated.link = project.link;
    }

    if (project.image && typeof project.image === 'string') {
        if (!isValidUrl(project.image)) {
            throw new Error('Invalid project image URL');
        }
        validated.image = project.image;
    }

    if (project.sku && typeof project.sku === 'string') {
        validated.sku = sanitizeString(project.sku).slice(0, 50);
    }

    return validated;
}

/**
 * Previene NoSQL injection validando tipi
 */
export function ensureString(value: unknown, fieldName: string): string {
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} must be a string`);
    }
    return value;
}

export function ensureNumber(value: unknown, fieldName: string): number {
    if (typeof value !== 'number' || isNaN(value)) {
        throw new Error(`${fieldName} must be a number`);
    }
    return value;
}

export function ensurePositiveInteger(value: unknown, fieldName: string): number {
    const num = ensureNumber(value, fieldName);
    if (!Number.isInteger(num) || num < 0) {
        throw new Error(`${fieldName} must be a positive integer`);
    }
    return num;
}