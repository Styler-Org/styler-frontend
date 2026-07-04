import { useRef } from 'react';
import { gsap } from '../lib/gsap';

/** Subtle 3D tilt + lift on hover, driven by cursor position. Spread onto the target element. */
export function useTilt<T extends HTMLElement>(maxTilt = 6) {
    const ref = useRef<T>(null);

    const onMouseMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
            rotateX: -py * maxTilt,
            rotateY: px * maxTilt,
            y: -4,
            transformPerspective: 800,
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    const onMouseLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    };

    return { ref, onMouseMove, onMouseLeave };
}
