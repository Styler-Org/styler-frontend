import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Button, IconButton, Avatar, Menu, MenuItem,
    Typography, useMediaQuery, useTheme, Drawer, List,
    ListItem, ListItemButton, ListItemText, ListItemIcon,
    Divider, alpha, Chip,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Dashboard as DashboardIcon,
    Store as StoreIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    Logout as LogoutIcon,
    Close as CloseIcon,
    Menu as MenuIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Info as InfoIcon,
    ChevronRight as ChevronRightIcon,
    PhoneIphone as AppIcon,
    Handshake as PartnerIcon,
    Home as HomeIcon,
    HelpOutline as HowIcon,
    DesignServices as ServicesIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import Logo from './Logo';

/* ── nav link definitions per role ── */
const marketingLinks = [
    { label: 'Home',         path: '/',             icon: <HomeIcon fontSize="small" /> },
    { label: 'About',        path: '/about',        icon: <InfoIcon fontSize="small" /> },
    { label: 'Services',     path: '/services',     icon: <ServicesIcon fontSize="small" /> },
    { label: 'How It Works', path: '/how-it-works', icon: <HowIcon fontSize="small" /> },
];

const barberLinks = [
    { label: 'Dashboard',    path: '/barber/dashboard',    icon: <DashboardIcon fontSize="small" /> },
    { label: 'Appointments', path: '/barber/appointments', icon: <CalendarIcon fontSize="small" /> },
    { label: 'Schedule',     path: '/barber/schedule',     icon: <InfoIcon fontSize="small" /> },
];

const ownerLinks = [
    { label: 'Dashboard', path: '/salon-owner/dashboard',       icon: <DashboardIcon fontSize="small" /> },
    { label: 'My Salons', path: '/salons-owner/my-salons',      icon: <StoreIcon fontSize="small" /> },
    { label: 'Analytics', path: '/salon-owner/analytics',       icon: <TrendingUpIcon fontSize="small" /> },
    { label: 'Staff',     path: '/salon-owner/staff-management', icon: <PeopleIcon fontSize="small" /> },
];

const Navbar: React.FC = () => {
    const navigate    = useNavigate();
    const location    = useLocation();
    const theme       = useTheme();
    const isMobile    = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isAuthenticated, clearAuth } = useAuthStore();

    const [scrolled,   setScrolled]   = useState(false);
    const [anchorEl,   setAnchorEl]   = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const darkBgPages = ['/', '/login', '/about', '/how-it-works', '/download', '/become-a-partner'];
    const hasDarkBg   = darkBgPages.some(p => location.pathname === p);
    const logoVariant = !scrolled && hasDarkBg ? 'light' : 'default';
    const textOnDark  = !scrolled && hasDarkBg;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    const handleMenu   = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose  = () => setAnchorEl(null);
    const handleLogout = () => { clearAuth(); handleClose(); navigate('/'); };

    const navLinks = !isAuthenticated || !user
        ? marketingLinks
        : user.role === 'barber'
            ? barberLinks
            : user.role === 'salon_owner'
                ? ownerLinks
                : marketingLinks;

    const isActive = (path: string) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    /* ── Mobile Drawer ── */
    const mobileDrawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Logo size="small" variant="default" clickable={false} />
                <IconButton onClick={() => setMobileOpen(false)} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.04)', borderRadius: '10px' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', py: 2, px: 2 }}>
                <List disablePadding>
                    {navLinks.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton component={Link} to={item.path}
                                    sx={{
                                        borderRadius: '12px', py: 1.2, px: 2,
                                        background: active ? 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)' : 'transparent',
                                        color: active ? 'white' : 'text.primary',
                                        '&:hover': { background: active ? 'linear-gradient(135deg,#5558e8 0%,#4338ca 100%)' : alpha('#6366f1', 0.06) },
                                    }}>
                                    <ListItemIcon sx={{ minWidth: 36, color: active ? 'rgba(255,255,255,0.9)' : 'text.secondary' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.925rem', fontWeight: active ? 700 : 500 }} />
                                    {active && <ChevronRightIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}

                    {/* CTAs for public visitors */}
                    {(!isAuthenticated || !user) && (
                        <>
                            <Divider sx={{ my: 1.5 }} />
                            <ListItem disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton component={Link} to="/download"
                                    sx={{ borderRadius: '12px', py: 1.2, px: 2, bgcolor: alpha('#6366f1', 0.06), '&:hover': { bgcolor: alpha('#6366f1', 0.12) } }}>
                                    <ListItemIcon sx={{ minWidth: 36, color: '#6366f1' }}><AppIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Download App" primaryTypographyProps={{ fontSize: '0.925rem', fontWeight: 600, color: '#6366f1' }} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/become-a-partner"
                                    sx={{ borderRadius: '12px', py: 1.2, px: 2, bgcolor: alpha('#ec4899', 0.06), '&:hover': { bgcolor: alpha('#ec4899', 0.12) } }}>
                                    <ListItemIcon sx={{ minWidth: 36, color: '#ec4899' }}><PartnerIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Become a Partner" primaryTypographyProps={{ fontSize: '0.925rem', fontWeight: 600, color: '#ec4899' }} />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>

            <Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#f8fafc' }}>
                {isAuthenticated && user ? (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, p: 1.5, borderRadius: '14px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                            <Avatar src={user.profilePicture} sx={{ width: 42, height: 42, bgcolor: '#6366f1', fontWeight: 700, fontSize: '0.9rem' }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</Typography>
                                <Chip label={user.role?.replace('_', ' ')} size="small"
                                    sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', mt: 0.5 }} />
                            </Box>
                        </Box>
                        <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}
                            sx={{ borderRadius: '10px', fontWeight: 600, bgcolor: 'white', fontSize: '0.875rem' }}>
                            Sign Out
                        </Button>
                    </Box>
                ) : (
                    <Button fullWidth variant="contained" size="large"
                        onClick={() => { setMobileOpen(false); useUIStore.getState().openLoginModal(); }}
                        sx={{ borderRadius: '12px', fontWeight: 700, py: 1.5 }}>
                        Partner Login
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <Box component="header" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100, transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
                <Box sx={{
                    position: 'absolute', inset: 0,
                    bgcolor: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(241,245,249,0.8)' : '1px solid transparent',
                    boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)' : 'none',
                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)', pointerEvents: 'none',
                }} />

                <Box sx={{
                    position: 'relative', maxWidth: '1440px', mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4 },
                    height: scrolled ? 64 : 80,
                    display: 'flex', alignItems: 'center',
                    transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
                }}>
                    <Box sx={{ flexShrink: 0 }}>
                        <Logo size={isMobile ? 'small' : 'medium'} variant={logoVariant} />
                    </Box>

                    {/* Desktop pill nav */}
                    {!isMobile && (
                        <Box sx={{
                            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                            display: 'flex', alignItems: 'center', gap: 0.5, p: 0.75,
                            bgcolor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(12px)', borderRadius: '50px',
                            border: '1px solid', borderColor: scrolled ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.8)',
                            boxShadow: scrolled ? 'none' : '0 2px 16px rgba(0,0,0,0.08)',
                            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        }}>
                            {navLinks.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Button key={item.label} component={Link} to={item.path} disableRipple
                                        startIcon={React.cloneElement(item.icon, { sx: { fontSize: '0.9rem !important' } })}
                                        sx={{
                                            color: active ? 'white' : scrolled ? '#475569' : '#334155',
                                            fontWeight: active ? 700 : 600, px: 2, py: 0.9, borderRadius: '40px',
                                            fontSize: '0.87rem', letterSpacing: '0.01em', whiteSpace: 'nowrap',
                                            background: active ? 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)' : 'transparent',
                                            boxShadow: active ? '0 3px 10px rgba(99,102,241,0.35)' : 'none',
                                            transition: 'all 0.25s ease',
                                            '&:hover': { background: active ? 'linear-gradient(135deg,#5558e8 0%,#4338ca 100%)' : alpha('#6366f1', 0.08), color: active ? 'white' : '#6366f1' },
                                            '& .MuiButton-startIcon': { marginRight: '5px', '& svg': { fontSize: '0.9rem !important' } },
                                        }}>
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </Box>
                    )}

                    {/* Right side actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
                        {!isMobile && (
                            isAuthenticated && user ? (
                                <>
                                    <IconButton onClick={handleMenu} sx={{
                                        p: 0.4, border: '2px solid', borderRadius: '50%',
                                        borderColor: Boolean(anchorEl) ? '#6366f1' : scrolled ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',
                                        bgcolor: scrolled ? 'transparent' : 'rgba(255,255,255,0.9)',
                                        transition: 'all 0.2s ease', '&:hover': { borderColor: '#6366f1' },
                                    }}>
                                        <Avatar src={user.profilePicture} sx={{ width: 34, height: 34, bgcolor: '#6366f1', fontWeight: 700, fontSize: '0.85rem' }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>

                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        PaperProps={{ elevation: 0, sx: { mt: 1.5, width: 260, borderRadius: '20px', overflow: 'visible', boxShadow: '0 16px 48px -8px rgba(0,0,0,0.16)', border: '1px solid #f1f5f9', '&::before': { content: '""', display: 'block', position: 'absolute', top: -6, right: 20, width: 12, height: 12, bgcolor: 'background.paper', transform: 'rotate(45deg)', borderTop: '1px solid #f1f5f9', borderLeft: '1px solid #f1f5f9', zIndex: 0 } } }}>
                                        <Box sx={{ px: 2.5, pt: 2.5, pb: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #f1f5f9', borderRadius: '20px 20px 0 0' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar src={user.profilePicture} sx={{ width: 44, height: 44, bgcolor: '#6366f1', fontWeight: 800 }}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }} noWrap>{user.name}</Typography>
                                                    <Chip label={user.role?.replace('_', ' ')} size="small"
                                                        sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', mt: 0.5 }} />
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{ p: 1.5 }}>
                                            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}
                                                sx={{ borderRadius: '10px', gap: 1.5, py: 1.2, fontSize: '0.875rem', fontWeight: 600 }}>
                                                <PersonIcon sx={{ color: '#94a3b8', fontSize: 18 }} /> Profile
                                            </MenuItem>
                                            <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}
                                                sx={{ borderRadius: '10px', gap: 1.5, py: 1.2, fontSize: '0.875rem', fontWeight: 600 }}>
                                                <SettingsIcon sx={{ color: '#94a3b8', fontSize: 18 }} /> Settings
                                            </MenuItem>
                                            <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />
                                            <MenuItem onClick={handleLogout}
                                                sx={{ borderRadius: '10px', gap: 1.5, py: 1.2, color: '#ef4444', fontWeight: 600, fontSize: '0.875rem', '&:hover': { bgcolor: '#fef2f2' } }}>
                                                <LogoutIcon sx={{ color: '#ef4444', fontSize: 18 }} /> Sign Out
                                            </MenuItem>
                                        </Box>
                                    </Menu>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Button component={Link} to="/download"
                                        sx={{
                                            px: 2.5, py: 1, borderRadius: '50px', fontWeight: 700, fontSize: '0.82rem',
                                            color: textOnDark ? 'rgba(255,255,255,0.9)' : '#6366f1',
                                            border: '1.5px solid', borderColor: textOnDark ? 'rgba(255,255,255,0.35)' : alpha('#6366f1', 0.3),
                                            bgcolor: textOnDark ? 'rgba(255,255,255,0.08)' : 'transparent',
                                            backdropFilter: 'blur(8px)',
                                            '&:hover': { bgcolor: textOnDark ? 'rgba(255,255,255,0.14)' : alpha('#6366f1', 0.06) },
                                            transition: 'all 0.25s ease',
                                        }}>
                                        Download App
                                    </Button>
                                    <Button component={Link} to="/become-a-partner"
                                        sx={{
                                            px: 3, py: 1.1, borderRadius: '50px', fontWeight: 700, fontSize: '0.875rem',
                                            background: scrolled ? 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)' : 'rgba(255,255,255,0.95)',
                                            color: scrolled ? 'white' : '#4f46e5',
                                            boxShadow: scrolled ? '0 4px 14px rgba(99,102,241,0.4)' : '0 2px 12px rgba(0,0,0,0.1)',
                                            border: '1px solid', borderColor: scrolled ? 'transparent' : 'rgba(255,255,255,0.8)',
                                            '&:hover': { background: scrolled ? 'linear-gradient(135deg,#5558e8 0%,#4338ca 100%)' : 'white', transform: 'translateY(-1px)' },
                                            transition: 'all 0.25s ease',
                                        }}>
                                        Become a Partner
                                    </Button>
                                    <Button onClick={() => useUIStore.getState().openLoginModal()}
                                        sx={{
                                            px: 2, py: 1, borderRadius: '50px', fontWeight: 600, fontSize: '0.8rem',
                                            color: textOnDark ? 'rgba(255,255,255,0.7)' : '#64748b',
                                            '&:hover': { color: textOnDark ? 'white' : '#0f172a', bgcolor: 'transparent' },
                                        }}>
                                        Partner Login
                                    </Button>
                                </Box>
                            )
                        )}

                        {isMobile && (
                            <IconButton onClick={() => setMobileOpen(true)} sx={{
                                p: 1, bgcolor: scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.9)',
                                borderRadius: '12px', color: scrolled ? 'text.primary' : '#0f172a',
                                backdropFilter: 'blur(8px)', border: '1px solid',
                                borderColor: scrolled ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.6)',
                                transition: 'all 0.2s ease', '&:hover': { bgcolor: scrolled ? 'rgba(0,0,0,0.08)' : 'white' },
                            }}>
                                <MenuIcon sx={{ fontSize: 22 }} />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Box>

            <Drawer variant="temporary" anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 300, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, border: 'none', boxShadow: '0 16px 56px rgba(0,0,0,0.2)' } }}>
                {mobileDrawer}
            </Drawer>
        </>
    );
};

export default Navbar;
