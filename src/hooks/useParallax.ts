import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

/** Moves the element vertically as its scroll container scrolls, for parallax backgrounds. */
export function useParallax<T extends HTMLElement>(speed = 0.3) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.to(el, {
                yPercent: speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.parentElement ?? el,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        });

        return () => ctx.revert();
    }, [speed]);

    return ref;
}
