import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { gsap } from '../../lib/gsap';
import SplitLetterCut, { SplitLetterCutHandle } from './SplitLetterCut';

interface LogoIntroSplashProps {
    onComplete: () => void;
}

const LogoIntroSplash: React.FC<LogoIntroSplashProps> = ({ onComplete }) => {
    const sRef = useRef<SplitLetterCutHandle>(null);
    const tylerRef = useRef<HTMLSpanElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const sparkleRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(rootRef.current, {
                    opacity: 0, duration: 0.6, delay: 0.9, ease: 'power2.inOut',
                    onComplete,
                });
            },
        });

        tl.call(() => sRef.current?.open(true))
          .to(tylerRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, '+=0.35')
          .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
          .to(sparkleRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.2');

        return () => { tl.kill(); };
    }, [onComplete]);

    return (
        <Box ref={rootRef} sx={{
            position: 'fixed', inset: 0, zIndex: 2000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(140deg, #050214 0%, #0f0a2e 50%, #09090b 100%)',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SplitLetterCut
                    ref={sRef}
                    char="S"
                    fontSize="clamp(4rem, 14vw, 9rem)"
                    background="linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)"
                    spread={7}
                />
                <Box component="span" ref={tylerRef} sx={{
                    fontFamily: '"Outfit", sans-serif', fontWeight: 900,
                    fontSize: 'clamp(4rem, 14vw, 9rem)', lineHeight: 1, letterSpacing: '-0.02em',
                    color: 'white', opacity: 0, transform: 'translateX(-16px)', display: 'inline-block',
                }}>
                    tyler
                </Box>
            </Box>

            <Typography ref={taglineRef} sx={{
                mt: 2, opacity: 0, transform: 'translateY(10px)',
                color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.14em',
                fontSize: { xs: '0.7rem', md: '0.85rem' }, textTransform: 'uppercase',
            }}>
                India's Premier Beauty &amp; Wellness Platform
            </Typography>

            <Box ref={sparkleRef} sx={{ mt: 2.5, opacity: 0, transform: 'scale(0.5)', fontSize: '1.4rem', color: '#a5b4fc' }}>
                ✦
            </Box>
        </Box>
    );
};

export default LogoIntroSplash;
