import { useEffect, useRef } from 'react';
import { gsap, SplitText } from '../lib/gsap';

/** Splits the element's text into words/chars and reveals them on scroll with GSAP. */
export function useSplitReveal<T extends HTMLElement>(
    options: { type?: 'words' | 'chars'; stagger?: number; start?: string } = {},
) {
    const ref = useRef<T>(null);
    const { type = 'words', stagger = 0.03, start = 'top 85%' } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            const split = new SplitText(el, { type });
            const targets = type === 'chars' ? split.chars : split.words;

            gsap.set(targets, { opacity: 0, yPercent: 110 });
            gsap.to(targets, {
                opacity: 1,
                yPercent: 0,
                duration: 0.8,
                stagger,
                ease: 'power4.out',
                scrollTrigger: { trigger: el, start, once: true },
            });

            return () => split.revert();
        }, el);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ref;
}
