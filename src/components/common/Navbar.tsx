import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Typography,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    alpha,
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
    LocationOn as LocationOnIcon,
    ContentCut as ContentCutIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Info as InfoIcon,
    Spa as SpaIcon,
    Face as FaceIcon,
    AccountBalanceWallet as WalletIcon,
    ChevronRight as ChevronRightIcon,
    NotificationsNoneOutlined as BellIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import Logo from './Logo';

const MotionBox = motion(Box);

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isAuthenticated, clearAuth } = useAuthStore();
    const [scrolled, setScrolled] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const darkBgPages = ['/', '/login', '/signup'];
    const hasDarkBg = darkBgPages.includes(location.pathname);
    const logoVariant = !scrolled && hasDarkBg ? 'light' : 'default';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => { clearAuth(); handleClose(); navigate('/login'); };
    const handleDrawerToggle = () => setMobileOpen(prev => !prev);

    const getNavLinks = () => {
        if (!isAuthenticated || !user) {
            return [
                { label: 'Salons', path: '/salons', icon: <LocationOnIcon fontSize="small" /> },
                { label: 'Dermatologists', path: '/dermatologists', icon: <FaceIcon fontSize="small" /> },
                { label: 'Spa', path: '/spas', icon: <SpaIcon fontSize="small" /> },
            ];
        }
        switch (user.role) {
            case 'barber':
                return [
                    { label: 'Dashboard', path: '/barber/dashboard', icon: <DashboardIcon fontSize="small" /> },
                    { label: 'Appointments', path: '/barber/appointments', icon: <CalendarIcon fontSize="small" /> },
                    { label: 'Schedule', path: '/barber/schedule', icon: <InfoIcon fontSize="small" /> },
                    { label: 'Profile', path: '/barber/profile', icon: <PersonIcon fontSize="small" /> },
                ];
            case 'salon_owner':
                return [
                    { label: 'Dashboard', path: '/salon-owner/dashboard', icon: <DashboardIcon fontSize="small" /> },
                    { label: 'My Salons', path: '/salons-owner/my-salons', icon: <StoreIcon fontSize="small" /> },
                    { label: 'Analytics', path: '/salon-owner/analytics', icon: <TrendingUpIcon fontSize="small" /> },
                    { label: 'Staff', path: '/salon-owner/staff-management', icon: <PeopleIcon fontSize="small" /> },
                ];
            default:
                return [
                    { label: 'Salons', path: '/salons', icon: <LocationOnIcon fontSize="small" /> },
                    { label: 'Dermatologists', path: '/dermatologists', icon: <FaceIcon fontSize="small" /> },
                    { label: 'Spa', path: '/spas', icon: <SpaIcon fontSize="small" /> },
                    { label: 'Appointments', path: '/appointments', icon: <CalendarIcon fontSize="small" /> },
                ];
        }
    };

    const navLinks = getNavLinks();

    const isActive = (path: string) => location.pathname === path;

    const walletBalance = user?.wallet?.balance ?? 0;

    /* ── MOBILE DRAWER ── */
    const mobileDrawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Logo size="small" variant="default" clickable={false} />
                <IconButton onClick={handleDrawerToggle} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.04)', borderRadius: '10px' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Nav Items */}
            <Box sx={{ flex: 1, overflowY: 'auto', py: 2, px: 2 }}>
                <List disablePadding>
                    {navLinks.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={handleDrawerToggle}
                                    sx={{
                                        borderRadius: '12px',
                                        py: 1.2,
                                        px: 2,
                                        background: active ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                                        color: active ? 'white' : 'text.primary',
                                        '&:hover': {
                                            background: active ? 'linear-gradient(135deg, #5558e8 0%, #4338ca 100%)' : alpha('#6366f1', 0.06),
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36, color: active ? 'rgba(255,255,255,0.9)' : 'text.secondary' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontSize: '0.925rem', fontWeight: active ? 700 : 500 }}
                                    />
                                    {active && <ChevronRightIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* Footer */}
            <Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#f8fafc' }}>
                {isAuthenticated && user ? (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, p: 1.5, borderRadius: '14px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                            <Avatar
                                src={user.profilePicture}
                                sx={{ width: 42, height: 42, bgcolor: '#6366f1', fontWeight: 700, fontSize: '0.9rem' }}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: '#0f172a' }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '0.75rem' }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                        {user.role === 'customer' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 2, py: 1, borderRadius: '10px', bgcolor: alpha('#6366f1', 0.08) }}>
                                <WalletIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#6366f1' }}>
                                    Wallet: ₹{walletBalance}
                                </Typography>
                            </Box>
                        )}
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{ borderRadius: '10px', fontWeight: 600, bgcolor: 'white', fontSize: '0.875rem' }}
                        >
                            Log Out
                        </Button>
                    </Box>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => { handleDrawerToggle(); useUIStore.getState().openLoginModal(); }}
                        sx={{ borderRadius: '12px', fontWeight: 700, py: 1.5 }}
                    >
                        Get Started
                    </Button>
                )}
            </Box>
        </Box>
    );

    /* ── DESKTOP NAV PILL ── */
    const navBgScrolled = 'rgba(255,255,255,0.08)';
    const navBgUnscrolled = 'rgba(255,255,255,0.9)';

    return (
        <>
            <Box
                component="header"
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1100,
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Glass blur layer */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
                        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                        borderBottom: scrolled ? '1px solid rgba(241,245,249,0.8)' : '1px solid transparent',
                        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)' : 'none',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: 'none',
                    }}
                />

                <Box
                    sx={{
                        position: 'relative',
                        maxWidth: '1440px',
                        mx: 'auto',
                        px: { xs: 2, sm: 3, md: 4 },
                        height: scrolled ? 64 : 80,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ flexShrink: 0 }}>
                        <Logo size={isMobile ? 'small' : 'medium'} variant={logoVariant} />
                    </Box>

                    {/* Desktop Nav Pill */}
                    {!isMobile && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                p: 0.75,
                                bgcolor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.92)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '50px',
                                border: '1px solid',
                                borderColor: scrolled ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.8)',
                                boxShadow: scrolled ? 'none' : '0 2px 16px rgba(0,0,0,0.08)',
                                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            {navLinks.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Button
                                        key={item.label}
                                        component={Link}
                                        to={item.path}
                                        disableRipple
                                        startIcon={React.cloneElement(item.icon, { sx: { fontSize: '0.9rem !important' } })}
                                        sx={{
                                            color: active ? 'white' : scrolled ? '#475569' : '#334155',
                                            fontWeight: active ? 700 : 600,
                                            px: 2,
                                            py: 0.9,
                                            borderRadius: '40px',
                                            fontSize: '0.87rem',
                                            letterSpacing: '0.01em',
                                            whiteSpace: 'nowrap',
                                            background: active ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                                            boxShadow: active ? '0 3px 10px rgba(99, 102, 241, 0.35)' : 'none',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                background: active
                                                    ? 'linear-gradient(135deg, #5558e8 0%, #4338ca 100%)'
                                                    : alpha('#6366f1', 0.08),
                                                color: active ? 'white' : '#6366f1',
                                                transform: 'none',
                                            },
                                            '& .MuiButton-startIcon': {
                                                marginRight: '5px',
                                                '& svg': { fontSize: '0.9rem !important' }
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </Box>
                    )}

                    {/* Right side actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
                        {!isMobile && isAuthenticated && user ? (
                            <>
                                {/* Wallet chip */}
                                {user.role === 'customer' && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                            px: 1.75,
                                            py: 0.75,
                                            borderRadius: '50px',
                                            bgcolor: scrolled ? alpha('#6366f1', 0.08) : 'rgba(255,255,255,0.9)',
                                            border: '1px solid',
                                            borderColor: scrolled ? alpha('#6366f1', 0.15) : 'rgba(255,255,255,0.8)',
                                            backdropFilter: 'blur(8px)',
                                            boxShadow: scrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.06)',
                                        }}
                                    >
                                        <WalletIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                                        <Typography sx={{ fontWeight: 800, color: '#6366f1', fontSize: '0.85rem' }}>
                                            ₹{walletBalance}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Avatar dropdown */}
                                <IconButton
                                    onClick={handleMenu}
                                    sx={{
                                        p: 0.4,
                                        border: '2px solid',
                                        borderColor: Boolean(anchorEl) ? '#6366f1' : scrolled ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',
                                        bgcolor: scrolled ? 'transparent' : 'rgba(255,255,255,0.9)',
                                        transition: 'all 0.2s ease',
                                        borderRadius: '50%',
                                        '&:hover': {
                                            borderColor: '#6366f1',
                                            transform: 'none',
                                        },
                                    }}
                                >
                                    <Avatar
                                        src={user.profilePicture}
                                        sx={{ width: 34, height: 34, bgcolor: '#6366f1', fontWeight: 700, fontSize: '0.85rem' }}
                                    >
                                        {user.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>

                                {/* Dropdown Menu */}
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            mt: 1.5,
                                            width: 280,
                                            borderRadius: '20px',
                                            overflow: 'visible',
                                            boxShadow: '0 16px 48px -8px rgba(0,0,0,0.16)',
                                            border: '1px solid #f1f5f9',
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: -6,
                                                right: 20,
                                                width: 12,
                                                height: 12,
                                                bgcolor: 'background.paper',
                                                transform: 'rotate(45deg)',
                                                borderTop: '1px solid #f1f5f9',
                                                borderLeft: '1px solid #f1f5f9',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                >
                                    {/* User info header */}
                                    <Box sx={{ px: 2.5, pt: 2.5, pb: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #f1f5f9', borderRadius: '20px 20px 0 0' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar
                                                src={user.profilePicture}
                                                sx={{ width: 44, height: 44, bgcolor: '#6366f1', fontWeight: 800 }}
                                            >
                                                {user.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }} noWrap>
                                                    {user.name}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.2 }} noWrap>
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {user.role === 'customer' && (
                                            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.75, borderRadius: '8px', bgcolor: alpha('#6366f1', 0.08) }}>
                                                <WalletIcon sx={{ color: '#6366f1', fontSize: 16 }} />
                                                <Typography sx={{ fontWeight: 800, color: '#6366f1', fontSize: '0.82rem' }}>
                                                    Wallet Balance: ₹{walletBalance}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <Box sx={{ p: 1.5 }}>
                                        {user.role === 'customer' && (
                                            <MenuItem onClick={() => { navigate('/appointments'); handleClose(); }}>
                                                <CalendarIcon sx={{ mr: 1.5, color: '#94a3b8', fontSize: 18 }} />
                                                My Appointments
                                            </MenuItem>
                                        )}
                                        <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                                            <PersonIcon sx={{ mr: 1.5, color: '#94a3b8', fontSize: 18 }} />
                                            Profile
                                        </MenuItem>
                                        <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                                            <SettingsIcon sx={{ mr: 1.5, color: '#94a3b8', fontSize: 18 }} />
                                            Settings
                                        </MenuItem>

                                        <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

                                        <MenuItem
                                            onClick={handleLogout}
                                            sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2', color: '#ef4444' } }}
                                        >
                                            <LogoutIcon sx={{ mr: 1.5, color: '#ef4444', fontSize: 18 }} />
                                            Sign Out
                                        </MenuItem>
                                    </Box>
                                </Menu>
                            </>
                        ) : !isMobile ? (
                            <Button
                                variant="contained"
                                onClick={() => useUIStore.getState().openLoginModal()}
                                sx={{
                                    px: 3,
                                    py: 1.1,
                                    borderRadius: '50px',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    background: scrolled
                                        ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                                        : 'rgba(255,255,255,0.95)',
                                    color: scrolled ? 'white' : '#4f46e5',
                                    boxShadow: scrolled ? 'var(--shadow-primary)' : '0 2px 12px rgba(0,0,0,0.1)',
                                    border: '1px solid',
                                    borderColor: scrolled ? 'transparent' : 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                        background: scrolled
                                            ? 'linear-gradient(135deg, #5558e8 0%, #4338ca 100%)'
                                            : 'white',
                                        boxShadow: scrolled ? 'var(--shadow-primary-lg)' : '0 4px 20px rgba(0,0,0,0.15)',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                Get Started
                            </Button>
                        ) : null}

                        {/* Mobile hamburger */}
                        {isMobile && (
                            <IconButton
                                onClick={handleDrawerToggle}
                                sx={{
                                    p: 1,
                                    bgcolor: scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.9)',
                                    borderRadius: '12px',
                                    color: scrolled ? 'text.primary' : '#0f172a',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid',
                                    borderColor: scrolled ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.6)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: scrolled ? 'rgba(0,0,0,0.08)' : 'white',
                                        transform: 'none',
                                    },
                                }}
                            >
                                <MenuIcon sx={{ fontSize: 22 }} />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 300,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        border: 'none',
                        boxShadow: '0 16px 56px rgba(0,0,0,0.2)',
                    },
                }}
            >
                {mobileDrawer}
            </Drawer>
        </>
    );
};

export default Navbar;
