import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Box } from '@mui/material';
import { gsap } from '../../lib/gsap';

export interface SplitLetterCutHandle {
    /** Scissors slice the letter open. If withEffects, plays scissors + spark burst first. */
    open: (withEffects?: boolean) => void;
    /** Snaps the letter back together (used for hover replay). */
    close: () => void;
}

interface SplitLetterCutProps {
    char: string;
    fontSize: number | string;
    fontWeight?: number;
    fontFamily?: string;
    color?: string;
    background?: string;
    /** Extra px the two halves separate by once cut. */
    spread?: number;
}

const SPARK_COUNT = 8;

const SplitLetterCut = forwardRef<SplitLetterCutHandle, SplitLetterCutProps>(
    ({ char, fontSize, fontWeight = 900, fontFamily = '"Outfit", sans-serif', color = 'inherit', background, spread = 5 }, ref) => {
        const topRef = useRef<HTMLSpanElement>(null);
        const bottomRef = useRef<HTMLSpanElement>(null);
        const glowRef = useRef<HTMLDivElement>(null);
        const scissorsRef = useRef<SVGSVGElement>(null);
        const sparkRefs = useRef<(HTMLSpanElement | null)[]>([]);
        const tlRef = useRef<gsap.core.Timeline | null>(null);

        useImperativeHandle(ref, () => ({
            open(withEffects = false) {
                tlRef.current?.kill();
                const tl = gsap.timeline();
                tlRef.current = tl;

                if (withEffects && scissorsRef.current) {
                    tl.set(scissorsRef.current, { opacity: 1, x: 26, y: -30, rotate: -18, scale: 1 })
                      .to(scissorsRef.current, { x: -4, y: 4, rotate: 6, duration: 0.5, ease: 'power2.in' });
                }

                tl.to(topRef.current, { x: -spread, y: -spread, rotate: -4, duration: 0.35, ease: 'power2.out' }, withEffects ? '-=0.05' : 0)
                  .to(bottomRef.current, { x: spread, y: spread, rotate: 4, duration: 0.35, ease: 'power2.out' }, '<')
                  .to(glowRef.current, { opacity: 1, duration: 0.15 }, '<');

                if (withEffects) {
                    const sparks = sparkRefs.current.filter(Boolean) as HTMLSpanElement[];
                    tl.set(sparks, { opacity: 1, x: 0, y: 0, scale: 0.4 }, '<')
                      .to(sparks, {
                          x: () => gsap.utils.random(-32, 32),
                          y: () => gsap.utils.random(-32, 32),
                          scale: 1,
                          opacity: 0,
                          duration: 0.5,
                          stagger: 0.02,
                          ease: 'power1.out',
                      }, '<')
                      .to(scissorsRef.current, { opacity: 0, x: 40, y: -40, rotate: -20, duration: 0.4, ease: 'power1.in' }, '-=0.2');
                }
            },
            close() {
                tlRef.current?.kill();
                const tl = gsap.timeline();
                tlRef.current = tl;
                tl.to([topRef.current, bottomRef.current], { x: 0, y: 0, rotate: 0, duration: 0.3, ease: 'power2.inOut' })
                  .to(glowRef.current, { opacity: 0, duration: 0.2 }, '<');
            },
        }));

        const letterSx = {
            position: 'absolute' as const,
            inset: 0,
            fontFamily,
            fontWeight,
            fontSize,
            lineHeight: 1,
            color: background ? 'transparent' : color,
            background: background || undefined,
            WebkitBackgroundClip: background ? 'text' : undefined,
            backgroundClip: background ? 'text' : undefined,
            WebkitTextFillColor: background ? 'transparent' : undefined,
        };

        return (
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                {/* invisible sizer so the box takes up the right space */}
                <Box component="span" sx={{ ...letterSx, position: 'relative', visibility: 'hidden' }}>{char}</Box>

                <Box component="span" ref={topRef} sx={{ ...letterSx, clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>{char}</Box>
                <Box component="span" ref={bottomRef} sx={{ ...letterSx, clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}>{char}</Box>

                <Box ref={glowRef} sx={{
                    position: 'absolute', inset: '-6%', opacity: 0, pointerEvents: 'none',
                    background: 'linear-gradient(135deg, transparent 47%, rgba(255,255,255,0.95) 49.5%, rgba(165,180,252,0.9) 50.5%, transparent 53%)',
                    filter: 'blur(0.5px)',
                }} />

                {Array.from({ length: SPARK_COUNT }).map((_, i) => (
                    <Box key={i} component="span"
                        ref={(el: HTMLSpanElement | null) => { sparkRefs.current[i] = el; }}
                        sx={{
                            position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, borderRadius: '50%',
                            background: i % 2 ? '#a5b4fc' : '#ffffff', opacity: 0, pointerEvents: 'none',
                            boxShadow: '0 0 6px 1px rgba(255,255,255,0.8)',
                        }}
                    />
                ))}

                <Box component="svg" ref={scissorsRef} viewBox="0 0 36 36" sx={{
                    position: 'absolute', top: '38%', left: '55%', width: '46%', height: '46%',
                    opacity: 0, pointerEvents: 'none', transformOrigin: '50% 50%',
                }} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 11.33,10.28 C 26.28,10.28 26.28,18.00 18.00,18.00" stroke="white" strokeWidth="1.83" strokeLinecap="round" />
                    <path d="M 18.00,18.00 C 9.72,18.00 9.72,25.72 24.67,25.72" stroke="white" strokeWidth="1.83" strokeLinecap="round" />
                    <circle cx="24.67" cy="10.28" r="1.54" stroke="white" strokeWidth="1.26" />
                    <circle cx="11.33" cy="25.72" r="1.54" stroke="white" strokeWidth="1.26" />
                    <circle cx="18.00" cy="18.00" r="1.12" fill="white" />
                </Box>
            </Box>
        );
    },
);

SplitLetterCut.displayName = 'SplitLetterCut';

export default SplitLetterCut;
