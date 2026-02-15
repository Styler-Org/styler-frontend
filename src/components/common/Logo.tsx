import React from 'react';
import { Box, Typography } from '@mui/material';
import { ContentCut as ScissorsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
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

    const getHomeLink = () => {
        if (!isAuthenticated || !user) return '/';
        switch (user.role) {
            case 'barber': return '/barber/dashboard';
            case 'salon_owner': return '/salon-owner/dashboard';
            case 'superadmin': return '/admin/superadmin';
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
            sx={{ gap: 0, alignItems: 'center' }}
        >
            <Typography component="span" sx={textStyle}>
                St
            </Typography>

            <Box className="logo-scissor-wrapper" sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: size === 'small' ? '0px' : '1px',
                position: 'relative',
                top: size === 'large' ? '0.05em' : 0
            }}>
                <ScissorsIcon
                    className="logo-scissor-icon-anim"
                    sx={{
                        fontSize: currentSize.iconSize || 'inherit',
                        color: variant === 'default' ? '#4f46e5' : colorMap[variant].icon,
                        fill: variant === 'default' ? 'url(#styler-gradient-def)' : undefined,
                        transform: 'rotate(180deg)',
                        filter: variant === 'default' ? 'drop-shadow(0px 2px 4px rgba(79, 70, 229, 0.3))' : 'none'
                    }}
                />

                {variant === 'default' && (
                    <svg width={0} height={0} style={{ position: 'absolute', visibility: 'hidden' }}>
                        <defs>
                            <linearGradient id="styler-gradient-def" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4f46e5" />
                                <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                        </defs>
                    </svg>
                )}
            </Box>

            <Typography component="span" sx={textStyle}>
                lerApp
            </Typography>
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
