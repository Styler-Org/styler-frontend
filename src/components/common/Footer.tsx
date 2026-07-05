import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Divider, alpha } from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
    ContentCut as ScissorsIcon,
    ArrowOutward as ArrowOutwardIcon,
} from '@mui/icons-material';
import Logo from './Logo';

const socialLinks = [
    { icon: <InstagramIcon />, href: '#', label: 'Instagram', color: '#e1306c' },
    { icon: <TwitterIcon />,   href: '#', label: 'Twitter',   color: '#1da1f2' },
    { icon: <FacebookIcon />,  href: '#', label: 'Facebook',  color: '#1877f2' },
    { icon: <LinkedInIcon />,  href: '#', label: 'LinkedIn',  color: '#0a66c2' },
];

const footerLinks: Record<string, { label: string; path: string }[]> = {
    Product: [
        { label: 'Find Salons',       path: '/salons' },
        { label: 'Dermatologists',    path: '/dermatologists' },
        { label: 'Wellness & Spa',    path: '/spas' },
        { label: 'All Services',      path: '/services' },
    ],
    Company: [
        { label: 'About Us',          path: '#' },
        { label: 'Careers',           path: '#' },
        { label: 'Blog',              path: '#' },
        { label: 'Contact',           path: '#' },
    ],
    Support: [
        { label: 'Help Center',       path: '#' },
        { label: 'Privacy Policy',    path: '#' },
        { label: 'Terms of Service',  path: '#' },
        { label: 'FAQ',               path: '#' },
    ],
};

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decoration */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 50%, transparent 100%)' }} />
            <Box sx={{ position: 'absolute', top: '-30%', right: '-5%', width: '40%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '35%', height: '70%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                {/* Main Grid */}
                <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 4, md: 8 } }}>
                    <Grid container spacing={{ xs: 6, md: 8 }}>

                        {/* Brand Column */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ mb: 3 }}>
                                <Logo variant="light" size="medium" clickable={false} animateDelay={0.2} />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, mb: 5, maxWidth: 300, fontSize: '0.9rem' }}
                            >
                                Elevating your grooming and wellness experience with top-tier salons and expert stylists at your fingertips.
                            </Typography>

                            {/* Social Links */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {socialLinks.map((s) => (
                                    <IconButton
                                        key={s.label}
                                        href={s.href}
                                        aria-label={s.label}
                                        size="small"
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            bgcolor: 'rgba(255,255,255,0.06)',
                                            color: 'rgba(255,255,255,0.6)',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                bgcolor: alpha(s.color, 0.18),
                                                color: s.color,
                                                border: `1px solid ${alpha(s.color, 0.3)}`,
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        {React.cloneElement(s.icon, { sx: { fontSize: 18 } })}
                                    </IconButton>
                                ))}
                            </Box>
                        </Grid>

                        {/* Links Columns */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Grid container spacing={4}>
                                {Object.entries(footerLinks).map(([title, links]) => (
                                    <Grid size={{ xs: 6, sm: 4 }} key={title}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 700, color: 'white', mb: 3, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        >
                                            {title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {links.map((link) => (
                                                <Box
                                                    key={link.label}
                                                    component={Link}
                                                    to={link.path}
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.5)',
                                                        textDecoration: 'none',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        transition: 'all 0.2s ease',
                                                        lineHeight: 1.5,
                                                        width: 'fit-content',
                                                        '&:hover': {
                                                            color: 'rgba(255,255,255,0.9)',
                                                            transform: 'translateX(3px)',
                                                        },
                                                    }}
                                                >
                                                    {link.label}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                {/* Bottom strip */}
                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', py: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 2,
                        }}
                    >
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
                            © {new Date().getFullYear()} StylerApp Inc. All rights reserved.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(item => (
                                <Typography
                                    key={item}
                                    variant="caption"
                                    component="a"
                                    href="#"
                                    sx={{
                                        color: 'rgba(255,255,255,0.3)',
                                        fontSize: '0.78rem',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: 'rgba(255,255,255,0.7)' },
                                    }}
                                >
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
