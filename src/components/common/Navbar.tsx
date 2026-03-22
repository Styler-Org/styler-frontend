import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
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
    Container
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
    ChevronRight as ChevronRightIcon,
    Favorite,
    Email,
    Person as PersonIcon, // Re-added PersonIcon
    Info as InfoIcon, // Re-added InfoIcon
    Spa as SpaIcon,
    Face as FaceIcon,
    AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import Logo from './Logo';
import './Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isAuthenticated, clearAuth } = useAuthStore();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    // Pages with dark/purple hero backgrounds that need white logo
    const darkBackgroundPages = ['/', '/login', '/signup', '/lookbook'];
    const hasDarkBackground = darkBackgroundPages.includes(location.pathname);

    // Determine logo variant: white on dark backgrounds when not scrolled, otherwise default gradient
    const logoVariant = (!scrolled && hasDarkBackground) ? 'light' : 'default';

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        clearAuth();
        handleClose();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Role-based navigation links
    const getNavLinksForRole = () => {
        if (!isAuthenticated || !user) {
            return [
                { label: 'Salons', path: '/salons', icon: <LocationOnIcon /> },
                { label: 'Dermatologists', path: '/dermatologists', icon: <FaceIcon /> },
                { label: 'Spa', path: '/spas', icon: <SpaIcon /> },
            ];
        }

        switch (user.role) {
            case 'barber':
                return [
                    { label: 'Dashboard', path: '/barber/dashboard', icon: <DashboardIcon /> },
                    { label: 'Appointments', path: '/barber/appointments', icon: <CalendarIcon /> },
                    { label: 'Schedule', path: '/barber/schedule', icon: <InfoIcon /> },
                    { label: 'Profile', path: '/barber/profile', icon: <PersonIcon /> },
                ];
            case 'salon_owner':
                return [
                    { label: 'Dashboard', path: '/salon-owner/dashboard', icon: <DashboardIcon /> },
                    { label: 'My Salons', path: '/salons-owner/my-salons', icon: <StoreIcon /> },
                    { label: 'Services', path: '/salon-owner/manage-services', icon: <ContentCutIcon /> },
                    { label: 'Analytics', path: '/salon-owner/analytics', icon: <TrendingUpIcon /> },
                    { label: 'Staff', path: '/salon-owner/staff-management', icon: <PeopleIcon /> },
                ];
            case 'customer':
            default:
                return [
                    { label: 'Salons', path: '/salons', icon: <LocationOnIcon /> },
                    { label: 'Dermatologists', path: '/dermatologists', icon: <FaceIcon /> },
                    { label: 'Spa', path: '/spas', icon: <SpaIcon /> },
                    { label: 'Appointments', path: '/appointments', icon: <CalendarIcon /> },
                ];
        }
    };

    const navLinks = getNavLinksForRole();

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Logo size="small" variant="default" clickable={false} />
                <IconButton onClick={handleDrawerToggle} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ opacity: 0.1 }} />

            <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
                <List sx={{ px: 2 }}>
                    {navLinks.map((item) => {
                        const isActive = location.pathname === item.path && (!('state' in item) || (location.state as any)?.category === (item as any).state?.category);
                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 1.5 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    state={(item as any).state}
                                    onClick={handleDrawerToggle}
                                    sx={{
                                        borderRadius: '12px',
                                        bgcolor: isActive ? 'primary.main' : 'transparent',
                                        color: isActive ? 'white' : 'text.primary',
                                        '&:hover': { bgcolor: isActive ? 'primary.dark' : 'rgba(0,0,0,0.05)' },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'white' : 'text.secondary' }}>
                                        {React.cloneElement(item.icon as React.ReactElement, { fontSize: 'small' })}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                                    />
                                    {isActive && <ChevronRightIcon sx={{ fontSize: 16, color: 'white' }} />}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid', borderColor: 'divider' }}>
                {isAuthenticated && user ? (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar
                                src={user.profilePicture}
                                alt={user.name}
                                sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontWeight: 700, boxShadow: 2, border: '2px solid white' }}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ overflow: 'hidden' }}>
                                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: '#1e293b' }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, bgcolor: 'white' }}
                        >
                            Log Out
                        </Button>
                    </Box>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => {
                            handleDrawerToggle();
                            useUIStore.getState().openLoginModal();
                        }}
                        sx={{
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: '50px',
                            boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)'
                        }}
                    >
                        Login / Sign Up
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                color="inherit"
                className={scrolled ? 'navbar scrolled' : 'navbar'}
                elevation={0}
                sx={{
                    bgcolor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(16px)' : 'none',
                    borderBottom: '1px solid',
                    borderColor: scrolled ? 'rgba(0,0,0,0.08)' : 'transparent',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    top: 0,
                    left: 0,
                    right: 0
                }}
            >
                <Container maxWidth={false}>
                    <Toolbar disableGutters sx={{ height: scrolled ? 72 : 90, transition: 'all 0.3s ease' }}>
                        <Logo size={isMobile ? "small" : "medium"} variant={logoVariant} />

                        {isMobile ? (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleDrawerToggle}
                                sx={{ ml: 'auto', color: 'text.primary', bgcolor: scrolled ? 'rgba(0,0,0,0.05)' : 'white' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 0.5,
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    p: 0.75,
                                    bgcolor: scrolled ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.9)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '50px',
                                    border: '1px solid',
                                    borderColor: scrolled ? 'rgba(0,0,0,0.05)' : 'white',
                                    boxShadow: scrolled ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'
                                }}>
                                    {navLinks.map((item) => {
                                        const isActive = location.pathname === item.path && (!('state' in item) || (location.state as any)?.category === (item as any).state?.category);
                                        return (
                                            <Button
                                                key={item.label}
                                                component={Link}
                                                to={item.path}
                                                state={(item as any).state}
                                                disableRipple
                                                startIcon={item.icon}
                                                sx={{
                                                    color: isActive ? 'white' : '#64748b',
                                                    fontWeight: 600,
                                                    px: 2.5,
                                                    py: 1,
                                                    borderRadius: '30px',
                                                    textTransform: 'none',
                                                    whiteSpace: 'nowrap',
                                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        bgcolor: isActive ? 'primary.dark' : 'rgba(0,0,0,0.04)',
                                                        color: isActive ? 'white' : '#1e293b'
                                                    }
                                                }}
                                                className={`nav-item ${isActive ? 'active' : ''}`}
                                            >
                                                {item.label}
                                            </Button>
                                        );
                                    })}
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
                                    {isAuthenticated ? (
                                        <>
                                            {user?.role === 'customer' && (
                                                <Box sx={{
                                                    display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.8,
                                                    borderRadius: '50px',
                                                    background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
                                                    border: '1px solid rgba(244, 114, 182, 0.3)',
                                                    mr: 1
                                                }}>
                                                    <WalletIcon sx={{ color: '#f472b6', fontSize: 20 }} />
                                                    <Typography sx={{ fontWeight: 800, color: '#4f46e5', fontSize: '0.9rem' }}>
                                                        ₹{user?.wallet?.balance || 0}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <IconButton
                                                onClick={handleMenu}
                                                sx={{
                                                    p: 0.5,
                                                    border: '2px solid',
                                                    borderColor: scrolled ? 'transparent' : 'white',
                                                    bgcolor: scrolled ? 'transparent' : 'white',
                                                    boxShadow: scrolled ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.05)' }
                                                }}
                                            >
                                                <Avatar
                                                    src={user?.profilePicture}
                                                    alt={user?.name}
                                                    sx={{ width: 42, height: 42, bgcolor: 'primary.main', fontWeight: 700 }}
                                                >
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </IconButton>
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
                                                        width: 300,
                                                        borderRadius: '24px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)',
                                                        border: '1px solid',
                                                        borderColor: 'rgba(0,0,0,0.05)',
                                                    },
                                                }}
                                            >
                                                <Box sx={{ px: 3, pt: 3, pb: 2, bgcolor: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>
                                                        {user?.name || 'User'}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                                                        {user?.email || 'user@example.com'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ p: 1.5, bgcolor: 'white' }}>
                                                    <MenuItem
                                                        onClick={() => { navigate('/appointments'); handleClose(); }}
                                                        sx={{ py: 1.5, px: 2, borderRadius: '12px', mb: 0.5 }}
                                                    >
                                                        <CalendarIcon sx={{ mr: 2, color: '#64748b', fontSize: 20 }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>My Appointments</Typography>
                                                    </MenuItem>

                                                    <MenuItem
                                                        onClick={() => { navigate('/profile'); handleClose(); }}
                                                        sx={{ py: 1.5, px: 2, borderRadius: '12px', mb: 0.5 }}
                                                    >
                                                        <PersonIcon sx={{ mr: 2, color: '#64748b', fontSize: 20 }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Profile</Typography>
                                                    </MenuItem>

                                                    <MenuItem
                                                        onClick={() => { navigate('/settings'); handleClose(); }}
                                                        sx={{ py: 1.5, px: 2, borderRadius: '12px', mb: 1.5 }}
                                                    >
                                                        <SettingsIcon sx={{ mr: 2, color: '#64748b', fontSize: 20 }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Settings</Typography>
                                                    </MenuItem>

                                                    <Divider sx={{ my: 1, opacity: 0.5 }} />

                                                    <MenuItem
                                                        onClick={handleLogout}
                                                        sx={{ py: 1.5, px: 2, borderRadius: '12px', '&:hover': { bgcolor: '#fef2f2' } }}
                                                    >
                                                        <LogoutIcon sx={{ mr: 2, color: '#ef4444', fontSize: 20 }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>Logout</Typography>
                                                    </MenuItem>
                                                </Box>
                                            </Menu>
                                        </>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={() => useUIStore.getState().openLoginModal()}
                                            sx={{
                                                px: 4,
                                                py: 1.2,
                                                borderRadius: '50px',
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 24px -4px rgba(99, 102, 241, 0.6)',
                                                }
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                    )}
                                </Box>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar >

            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
