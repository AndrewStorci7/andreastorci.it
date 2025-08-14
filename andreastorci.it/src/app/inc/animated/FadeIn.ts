/**
 * Hook personalizzato per gestire le animazioni fade-in
 * @author Andrea Storci aka dreean
 */
'use client'

import { useEffect, useRef } from 'react';

export const useFadeIn = (options?: IntersectionObserverInit) => {
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
                ...options
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    return elementRef;
};

// Hook per osservare tutti gli elementi fade-in nella pagina
export const useFadeInObserver = (
    selector: string = '.fade-in',
    options?: IntersectionObserverInit
) => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
                ...options
            }
        );

        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => observer.observe(el));

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        
                        if (element.classList.contains('fade-in')) {
                            observer.observe(element);
                        }
                        
                        const fadeInChildren = element.querySelectorAll(selector);
                        fadeInChildren.forEach((child) => observer.observe(child));
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [selector, options]);
};

// Hook avanzato con controllo dello stato
export const useFadeInWithState = (
    delay: number = 0,
    duration: number = 600,
    options?: IntersectionObserverInit
) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element || hasAnimated.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                            hasAnimated.current = true;
                        }, delay);
                        
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
                ...options
            }
        );

        element.style.transitionDuration = `${duration}ms`;
        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [delay, duration]);

    return elementRef;
};