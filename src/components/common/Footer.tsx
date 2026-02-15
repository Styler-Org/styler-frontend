import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider, TextField, Button, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
    ArrowForward as ArrowForwardIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import Logo from './Logo';
import './Footer.css';

const Footer: React.FC = () => {
    const footerLinks = {
        'Company': [
            { label: 'About Us', path: '/about' },
            { label: 'Careers', path: '#' },
            { label: 'Blog', path: '#' },
            { label: 'Contact', path: '#' },
        ],
        'Services': [
            { label: 'Hair Cutting', path: '/services' },
            { label: 'Beard Grooming', path: '/services' },
            { label: 'Facial Treatments', path: '/services' },
            { label: 'Hair Coloring', path: '/services' },
        ],
        'Support': [
            { label: 'Help Center', path: '#' },
            { label: 'Terms of Service', path: '#' },
            { label: 'Privacy Policy', path: '#' },
            { label: 'FAQ', path: '#' },
        ],
    };

    return (
        <Box component="footer" className="footer">
            <Container maxWidth="lg">

                <Grid container spacing={6} sx={{ mb: 6 }}>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Box sx={{ mb: 3 }}>
                            <Logo variant="light" size="medium" clickable={false} />
                        </Box>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, mb: 4, maxWidth: 300 }}>
                            Elevating your grooming experience with top-tier salons and expert stylists at your fingertips.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                                <IconButton
                                    key={index}
                                    sx={{
                                        color: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: '#6366f1',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)',
                                        },
                                    }}
                                >
                                    <Icon />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Grid container spacing={4}>
                            {Object.entries(footerLinks).map(([title, links]) => (
                                <Grid size={{ xs: 6, sm: 4 }} key={title}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
                                        {title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {links.map((link) => (
                                            <MuiLink
                                                key={link.label}
                                                component={Link}
                                                to={link.path}
                                                sx={{
                                                    color: 'rgba(255,255,255,0.7)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    '&:hover': {
                                                        color: 'white',
                                                        transform: 'translateX(5px)',
                                                    },
                                                }}
                                            >
                                                {title !== 'Support' && <ArrowForwardIcon sx={{ fontSize: 14, mr: 1, opacity: 0.5 }} />}
                                                {link.label}
                                            </MuiLink>
                                        ))}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        © {new Date().getFullYear()} StylerApp Inc. All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                            Privacy Policy
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                            Terms of Use
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
