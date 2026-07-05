import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { gsap } from '../../lib/gsap';
import SplitLetterCut, { SplitLetterCutHandle } from './SplitLetterCut';
import './Logo.css';

interface LogoProps {
    variant?: 'default' | 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    clickable?: boolean;
    /** Delay before the mount animation plays, in seconds. Default 0.1. */
    animateDelay?: number;
}

const Logo: React.FC<LogoProps> = ({
    variant = 'default',
    size = 'medium',
    clickable = true,
    animateDelay = 0.1,
}) => {
    const sizeMap = {
        small:  { fontSize: '1.25rem', iconSize: 24 },
        medium: { fontSize: '1.75rem', iconSize: 36 },
        large:  { fontSize: '2.5rem',  iconSize: 50 },
    };

    const colorMap = {
        default: { text: 'transparent', bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', icon: '#6366f1' },
        light:   { text: '#ffffff',     bg: 'none', icon: '#ffffff' },
        dark:    { text: '#1e293b',     bg: 'none', icon: '#1e293b' },
    };

    const currentSize = sizeMap[size];
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const sRef      = useRef<SplitLetterCutHandle>(null);
    const tylerRef  = useRef<HTMLSpanElement>(null);
    const iconRef   = useRef<HTMLDivElement>(null);

    const getHomeLink = () => {
        if (!isAuthenticated || !user) return '/';
        switch (user.role) {
            case 'barber':       return '/barber/dashboard';
            case 'salon_owner':  return '/salon-owner/dashboard';
            case 'superadmin':   return '/admin';
            case 'customer':     return '/customer/dashboard';
            default:             return '/';
        }
    };

    // Mount animation — mirrors the LogoIntroSplash sequence but inline
    useEffect(() => {
        const tyler = tylerRef.current;
        const icon  = iconRef.current;
        if (!tyler || !icon) return;

        // Start hidden
        gsap.set(tyler, { opacity: 0, x: -10 });
        gsap.set(icon,  { opacity: 0, scale: 0.7 });

        const tl = gsap.timeline({ delay: animateDelay });

        // 1. Icon pops in
        tl.to(icon, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' })
        // 2. Scissors cut the "S"
          .call(() => sRef.current?.open(true), undefined, '+=0.05')
        // 3. "tyler" slides in
          .to(tyler, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }, '+=0.2');

        return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const textStyle = {
        fontFamily: '"Outfit", "Inter", -apple-system, sans-serif',
        fontWeight: 700,
        fontSize: currentSize.fontSize,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        background: variant === 'default' ? colorMap.default.bg : 'none',
        WebkitBackgroundClip: variant === 'default' ? 'text' : 'unset',
        backgroundClip: variant === 'default' ? 'text' : 'unset',
        color: variant === 'default' ? 'transparent' : colorMap[variant].text,
        WebkitTextFillColor: variant === 'default' ? 'transparent' : colorMap[variant].text,
    };

    const logoContent = (
        <Box
            className={`styler-logo styler-logo-${variant} styler-logo-${size}`}
            aria-label="StylerApp Logo"
            onMouseEnter={() => sRef.current?.open(false)}
            onMouseLeave={() => sRef.current?.close()}
            sx={{ gap: '10px', alignItems: 'center' }}
        >
            {/* Icon box */}
            <Box ref={iconRef} sx={{
                width: currentSize.iconSize,
                height: currentSize.iconSize,
                borderRadius: `${Math.round(currentSize.iconSize * 0.26)}px`,
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #1e293b 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: variant === 'default' ? '0 2px 12px rgba(99,102,241,0.35)' : 'none',
            }}>
                <svg
                    viewBox="0 0 36 36"
                    width={Math.round(currentSize.iconSize * 0.72)}
                    height={Math.round(currentSize.iconSize * 0.72)}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M 11.33,10.28 C 26.28,10.28 26.28,18.00 18.00,18.00"
                        stroke="white" strokeWidth="1.83" strokeLinecap="round"/>
                    <path d="M 18.00,18.00 C 9.72,18.00 9.72,25.72 24.67,25.72"
                        stroke="white" strokeWidth="1.83" strokeLinecap="round"/>
                    <circle cx="24.67" cy="10.28" r="1.54" stroke="white" strokeWidth="1.26"/>
                    <circle cx="11.33" cy="25.72" r="1.54" stroke="white" strokeWidth="1.26"/>
                    <circle cx="18.00" cy="18.00" r="1.12" fill="white"/>
                </svg>
            </Box>

            {/* Wordmark */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SplitLetterCut
                    ref={sRef}
                    char="S"
                    fontSize={currentSize.fontSize}
                    fontWeight={700}
                    fontFamily='"Outfit", "Inter", -apple-system, sans-serif'
                    background={variant === 'default' ? colorMap.default.bg : undefined}
                    color={variant === 'default' ? undefined : colorMap[variant].text}
                />
                <Box
                    component="span"
                    ref={tylerRef}
                    sx={{ ...textStyle, display: 'inline-block' }}
                >
                    tyler
                </Box>
            </Box>
        </Box>
    );

    if (clickable) {
        return (
            <Link to={getHomeLink()} style={{ textDecoration: 'none', display: 'inline-flex' }}>
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};

export default Logo;
