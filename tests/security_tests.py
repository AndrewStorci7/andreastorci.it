#!/usr/bin/env python3
"""
Security Testing Automation Script
Per andreastorci.it

UTILIZZO:
    python security_tests.py --url http://localhost:3000 --all
    python security_tests.py --url http://localhost:3000 --test xss
    python security_tests.py --url http://localhost:3000 --test sql-injection,auth

REQUIREMENTS:
    pip install requests colorama
"""

import requests
import json
import time
import argparse
from typing import List, Dict, Any, Tuple
from colorama import init, Fore, Back, Style
import sys

# Inizializza colorama
init(autoreset=True)

class SecurityTester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.results = {
            'passed': [],
            'failed': [],
            'warnings': []
        }
    
    def print_header(self, text: str):
        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"{Fore.CYAN}{text.center(60)}")
        print(f"{Fore.CYAN}{'='*60}\n")
    
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

    # ===== SQL/NoSQL INJECTION TESTS =====
    def test_nosql_injection(self):
        self.print_header("NoSQL INJECTION TESTS")
        
        payloads = [
            {"username": {"$ne": None}, "password": {"$ne": None}},
            {"username": {"$regex": ".*"}, "password": "test"},
            {"username": {"$gt": ""}, "password": {"$gt": ""}},
            {"username": "admin' || '1'=='1", "password": "anything"},
        ]
        
        for i, payload in enumerate(payloads, 1):
            self.print_test(f"NoSQL Injection #{i}: {json.dumps(payload)}")
            try:
                response = self.session.post(
                    f"{self.base_url}/api/auth/login",
                    json=payload,
                    timeout=5
                )
                
                if response.status_code == 200 and 'token' in response.json():
                    self.print_failure(f"VULNERABLE! Login succeeded with payload: {payload}")
                elif response.status_code in [400, 401, 403]:
                    self.print_success("Protected: Request rejected with proper error code")
                else:
                    self.print_warning(f"Unexpected response: {response.status_code}")
                    
            except Exception as e:
                self.print_warning(f"Test error: {str(e)}")

    # ===== XSS TESTS =====
    def test_xss(self):
        self.print_header("CROSS-SITE SCRIPTING (XSS) TESTS")
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>",
            "javascript:alert('XSS')",
            "<iframe src='javascript:alert(\"XSS\")'></iframe>",
            "';alert('XSS');//",
            "<body onload=alert('XSS')>",
            "<input onfocus=alert('XSS') autofocus>",
        ]
        
        # Test nel form progetti
        for i, payload in enumerate(xss_payloads, 1):
            self.print_test(f"XSS Payload #{i}: {payload[:50]}...")
            
            try:
                # Simula aggiunta progetto con XSS
                project_data = {
                    "dataIt": {
                        "name": payload,
                        "description": f"Test XSS {payload}",
                        "type": "Web App",
                        "role": ["Developer"],
                        "technologies": ["React"],
                        "link": "https://test.com",
                        "sku": "test"
                    },
                    "dataEs": {},
                    "dataEn": {},
                    "updateProp": "projects"
                }
                
                response = self.session.post(
                    f"{self.base_url}/api/update",
                    json=project_data,
                    timeout=5
                )
                
                if response.status_code == 200:
                    self.print_warning("Data accepted - Manual verification needed for XSS execution")
                elif response.status_code in [400, 401, 403]:
                    self.print_success("Protected: Request rejected")
                else:
                    self.print_info(f"Response: {response.status_code}")
                    
            except Exception as e:
                self.print_warning(f"Test error: {str(e)}")

    # ===== AUTHENTICATION TESTS =====
    def test_authentication(self):
        self.print_header("AUTHENTICATION & AUTHORIZATION TESTS")
        
        # Test 1: Accesso senza autenticazione
        self.print_test("Test 1: Unauthorized API access")
        protected_endpoints = [
            ('/api/update', 'POST'),
            ('/api/delete', 'POST'),
            ('/api/translate', 'POST'),
        ]
        
        for endpoint, method in protected_endpoints:
            try:
                if method == 'POST':
                    response = self.session.post(
                        f"{self.base_url}{endpoint}",
                        json={"test": "data"},
                        timeout=5
                    )
                else:
                    response = self.session.get(
                        f"{self.base_url}{endpoint}",
                        timeout=5
                    )
                
                if response.status_code in [401, 403]:
                    self.print_success(f"{endpoint} is protected")
                elif response.status_code == 200:
                    self.print_failure(f"VULNERABLE! {endpoint} accessible without auth")
                else:
                    self.print_info(f"{endpoint} returned {response.status_code}")
                    
            except Exception as e:
                self.print_warning(f"Test error on {endpoint}: {str(e)}")
        
        # Test 2: Brute force protection
        self.print_test("Test 2: Brute force protection")
        attempts = 10
        failed_attempts = 0
        
        for i in range(attempts):
            try:
                response = self.session.post(
                    f"{self.base_url}/api/auth/login",
                    json={
                        "username": "admin",
                        "password": f"wrong_password_{i}"
                    },
                    timeout=5
                )
                
                if response.status_code == 429:  # Too Many Requests
                    self.print_success(f"Rate limiting active after {i+1} attempts")
                    break
                elif response.status_code == 401:
                    failed_attempts += 1
                    
            except Exception as e:
                self.print_warning(f"Test error: {str(e)}")
                break
            
            time.sleep(0.1)
        
        if failed_attempts >= attempts:
            self.print_failure("NO rate limiting detected - brute force possible!")

    # ===== CSRF TESTS =====
    def test_csrf(self):
        self.print_header("CROSS-SITE REQUEST FORGERY (CSRF) TESTS")
        
        self.print_test("Test 1: CSRF token validation")
        
        # Prova richiesta senza CSRF token
        try:
            response = self.session.post(
                f"{self.base_url}/api/update",
                json={"test": "data"},
                headers={
                    "Origin": "https://malicious-site.com",
                    "Referer": "https://malicious-site.com"
                },
                timeout=5
            )
            
            if response.status_code in [401, 403]:
                self.print_success("CSRF protection active - foreign origin rejected")
            elif response.status_code == 200:
                self.print_failure("VULNERABLE! No CSRF protection")
            else:
                self.print_info(f"Response: {response.status_code}")
                
        except Exception as e:
            self.print_warning(f"Test error: {str(e)}")

    # ===== RATE LIMITING TESTS =====
    def test_rate_limiting(self):
        self.print_header("RATE LIMITING TESTS")
        
        endpoints = [
            ('/api/auth/login', 'POST', {"username": "test", "password": "test"}),
            ('/api/translate', 'POST', {"data": "test", "lang": "en"}),
            ('/api/news', 'POST', {}),
        ]
        
        for endpoint, method, payload in endpoints:
            self.print_test(f"Testing rate limit on {endpoint}")
            
            rate_limited = False
            for i in range(50):
                try:
                    if method == 'POST':
                        response = self.session.post(
                            f"{self.base_url}{endpoint}",
                            json=payload,
                            timeout=5
                        )
                    else:
                        response = self.session.get(
                            f"{self.base_url}{endpoint}",
                            timeout=5
                        )
                    
                    if response.status_code == 429:
                        self.print_success(f"Rate limiting active on {endpoint} after {i+1} requests")
                        rate_limited = True
                        break
                        
                except Exception as e:
                    self.print_warning(f"Test error: {str(e)}")
                    break
                
                time.sleep(0.05)
            
            if not rate_limited:
                self.print_failure(f"NO rate limiting on {endpoint}!")

    # ===== INFORMATION DISCLOSURE TESTS =====
    def test_information_disclosure(self):
        self.print_header("INFORMATION DISCLOSURE TESTS")
        
        # Test 1: Error messages
        self.print_test("Test 1: Error message disclosure")
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/update",
                data="INVALID_JSON",
                headers={"Content-Type": "application/json"},
                timeout=5
            )
            
            if response.text and any(keyword in response.text.lower() for keyword in 
                ['stack', 'error:', 'file:', 'line:', 'at ']):
                self.print_failure("Detailed error messages exposed!")
            else:
                self.print_success("Generic error messages used")
                
        except Exception as e:
            self.print_warning(f"Test error: {str(e)}")
        
        # Test 2: Security headers
        self.print_test("Test 2: Security headers")
        
        try:
            response = self.session.get(self.base_url, timeout=5)
            headers = response.headers
            
            security_headers = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': ['DENY', 'SAMEORIGIN'],
                'X-XSS-Protection': '1',
                'Strict-Transport-Security': 'max-age',
                'Content-Security-Policy': 'default-src',
            }
            
            for header, expected in security_headers.items():
                if header in headers:
                    if isinstance(expected, list):
                        if any(val in headers[header] for val in expected):
                            self.print_success(f"{header} is set correctly")
                        else:
                            self.print_warning(f"{header} has unexpected value")
                    else:
                        if expected in headers[header]:
                            self.print_success(f"{header} is set correctly")
                        else:
                            self.print_warning(f"{header} has unexpected value")
                else:
                    self.print_failure(f"Missing security header: {header}")
                    
        except Exception as e:
            self.print_warning(f"Test error: {str(e)}")
        
        # Test 3: Exposed files
        self.print_test("Test 3: Sensitive files exposure")
        
        sensitive_files = [
            '/.env',
            '/.git/config',
            '/package.json',
            '/.next/static',
            '/node_modules',
        ]
        
        for file_path in sensitive_files:
            try:
                response = self.session.get(
                    f"{self.base_url}{file_path}",
                    timeout=5
                )
                
                if response.status_code == 200:
                    self.print_failure(f"EXPOSED: {file_path}")
                elif response.status_code in [403, 404]:
                    self.print_success(f"Protected: {file_path}")
                    
            except Exception as e:
                self.print_warning(f"Test error on {file_path}: {str(e)}")

    # ===== INPUT VALIDATION TESTS =====
    def test_input_validation(self):
        self.print_header("INPUT VALIDATION TESTS")
        
        # Test 1: Negative index
        self.print_test("Test 1: Negative array index")
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/delete",
                json={
                    "attribute": "projects",
                    "index": -1
                },
                timeout=5
            )
            
            if response.status_code in [400, 401, 403]:
                self.print_success("Invalid index rejected")
            elif response.status_code == 200:
                self.print_failure("VULNERABLE! Negative index accepted")
                
        except Exception as e:
            self.print_warning(f"Test error: {str(e)}")
        
        # Test 2: Path traversal
        self.print_test("Test 2: Path traversal in attributes")
        
        path_traversal_payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "....//....//....//etc/passwd",
        ]
        
        for payload in path_traversal_payloads:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/update",
                    json={
                        "updateProp": payload,
                        "dataIt": {"test": "data"}
                    },
                    timeout=5
                )
                
                if response.status_code in [400, 401, 403]:
                    self.print_success(f"Path traversal rejected: {payload}")
                elif response.status_code == 200:
                    self.print_failure(f"VULNERABLE! Path traversal: {payload}")
                    
            except Exception as e:
                self.print_warning(f"Test error: {str(e)}")

    # ===== PRINT SUMMARY =====
    def print_summary(self):
        self.print_header("TEST SUMMARY")
        
        total = len(self.results['passed']) + len(self.results['failed']) + len(self.results['warnings'])
        
        print(f"{Fore.GREEN}Passed: {len(self.results['passed'])}/{total}")
        print(f"{Fore.RED}Failed: {len(self.results['failed'])}/{total}")
        print(f"{Fore.YELLOW}Warnings: {len(self.results['warnings'])}/{total}")
        
        if self.results['failed']:
            print(f"\n{Fore.RED}CRITICAL ISSUES FOUND:")
            for i, issue in enumerate(self.results['failed'], 1):
                print(f"{Fore.RED}{i}. {issue}")
        
        if self.results['warnings']:
            print(f"\n{Fore.YELLOW}WARNINGS:")
            for i, warning in enumerate(self.results['warnings'], 1):
                print(f"{Fore.YELLOW}{i}. {warning}")
        
        # Calcola score
        if total > 0:
            score = (len(self.results['passed']) / total) * 100
            
            if score >= 90:
                color = Fore.GREEN
                status = "EXCELLENT"
            elif score >= 70:
                color = Fore.YELLOW
                status = "GOOD"
            else:
                color = Fore.RED
                status = "NEEDS WORK"
            
            print(f"\n{color}Security Score: {score:.1f}% - {status}")

def main():
    parser = argparse.ArgumentParser(
        description='Security testing tool for andreastorci.it'
    )
    parser.add_argument(
        '--url',
        default='http://localhost:3000',
        help='Base URL to test (default: http://localhost:3000)'
    )
    parser.add_argument(
        '--test',
        help='Comma-separated list of tests to run (sql-injection,xss,auth,csrf,rate-limit,info-disclosure,input-validation)'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Run all tests'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Verbose output'
    )
    
    args = parser.parse_args()
    
    # Banner
    print(f"{Fore.CYAN}")
    print("""
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║         SECURITY TESTING AUTOMATION TOOL              ║
    ║              andreastorci.it                          ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    """)
    print(f"{Style.RESET_ALL}")
    
    tester = SecurityTester(args.url)
    
    print(f"{Fore.BLUE}[i] Target: {args.url}")
    print(f"{Fore.BLUE}[i] Starting security tests...\n")
    
    # Determina quali test eseguire
    if args.all:
        tests = [
            'sql-injection',
            'xss',
            'auth',
            'csrf',
            'rate-limit',
            'info-disclosure',
            'input-validation'
        ]
    elif args.test:
        tests = [t.strip() for t in args.test.split(',')]
    else:
        print(f"{Fore.YELLOW}No tests specified. Use --all or --test")
        return
    
    # Esegui test
    test_map = {
        'sql-injection': tester.test_nosql_injection,
        'xss': tester.test_xss,
        'auth': tester.test_authentication,
        'csrf': tester.test_csrf,
        'rate-limit': tester.test_rate_limiting,
        'info-disclosure': tester.test_information_disclosure,
        'input-validation': tester.test_input_validation,
    }
    
    for test_name in tests:
        if test_name in test_map:
            try:
                test_map[test_name]()
            except KeyboardInterrupt:
                print(f"\n{Fore.YELLOW}[!] Test interrupted by user")
                break
            except Exception as e:
                print(f"{Fore.RED}[!] Test '{test_name}' failed: {str(e)}")
        else:
            print(f"{Fore.YELLOW}[!] Unknown test: {test_name}")
    
    # Stampa riepilogo
    tester.print_summary()

if __name__ == '__main__':
    main()
