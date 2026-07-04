import { useRef } from 'react';
import { gsap } from '../lib/gsap';

/** Attaches a magnetic-follow effect to a button/element: spread these handlers on the target. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
    const ref = useRef<T>(null);

    const onMouseMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    };

    const onMouseLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    return { ref, onMouseMove, onMouseLeave };
}
