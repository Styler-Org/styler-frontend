import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

/** Batch-reveals the direct children of the returned ref as they enter the viewport. */
export function useScrollReveal<T extends HTMLElement>(selector = ':scope > *', stagger = 0.08) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>(selector, el);
            gsap.set(items, { opacity: 0, y: 24 });
            ScrollTrigger.batch(items, {
                start: 'top 88%',
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger }),
            });
        }, el);

        return () => ctx.revert();
    }, [selector, stagger]);

    return ref;
}
