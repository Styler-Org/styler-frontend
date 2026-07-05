import React, { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import SplitLetterCut, { SplitLetterCutHandle } from './SplitLetterCut';
import './Logo.css';

interface LogoProps {
    variant?: 'default' | 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', size = 'medium', clickable = true }) => {
    // Size configuration
    const sizeMap = {
        small: {
            fontSize: '1.25rem',
            iconSize: 24
        },
        medium: {
            fontSize: '1.75rem',
            iconSize: 36
        },
        large: {
            fontSize: '2.5rem',
            iconSize: 50
        },
    };

    // Color definitions
    const colorMap = {
        default: {
            text: 'transparent',
            bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            icon: '#6366f1' // Fallback/base color
        },
        light: {
            text: '#ffffff',
            bg: 'none',
            icon: '#ffffff'
        },
        dark: {
            text: '#1e293b', // Slate 800
            bg: 'none',
            icon: '#1e293b'
        },
    };

    const currentSize = sizeMap[size];
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const sRef = useRef<SplitLetterCutHandle>(null);

    const getHomeLink = () => {
        if (!isAuthenticated || !user) return '/';
        switch (user.role) {
            case 'barber': return '/barber/dashboard';
            case 'salon_owner': return '/salon-owner/dashboard';
            case 'superadmin': return '/admin';
            case 'customer': return '/customer/dashboard';
            default: return '/';
        }
    };

    // Typography styles based on variant
    const textStyle = {
        fontFamily: '"Outfit", "Inter", -apple-system, sans-serif',
        fontWeight: 700,
        fontSize: currentSize.fontSize,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        // Gradient handling
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
            {/* S+scissors icon box */}
            <Box sx={{
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
                    {/* Upper blade — tip top-left, curves right, to pivot */}
                    <path d="M 11.33,10.28 C 26.28,10.28 26.28,18.00 18.00,18.00"
                        stroke="white" strokeWidth="1.83" strokeLinecap="round"/>
                    {/* Lower blade — from pivot, curves left, tip bottom-right */}
                    <path d="M 18.00,18.00 C 9.72,18.00 9.72,25.72 24.67,25.72"
                        stroke="white" strokeWidth="1.83" strokeLinecap="round"/>
                    {/* Handle ring — top-right */}
                    <circle cx="24.67" cy="10.28" r="1.54" stroke="white" strokeWidth="1.26"/>
                    {/* Handle ring — bottom-left */}
                    <circle cx="11.33" cy="25.72" r="1.54" stroke="white" strokeWidth="1.26"/>
                    {/* Pivot */}
                    <circle cx="18.00" cy="18.00" r="1.12" fill="white"/>
                </svg>
            </Box>

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
                <Typography component="span" sx={textStyle}>
                    tyler
                </Typography>
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
