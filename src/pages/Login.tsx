import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
    CircularProgress,
    IconButton,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Phone as PhoneIcon,
    Login as LoginIcon,
    PersonAdd as PersonAddIcon,
    ContentCut as ScissorsIcon,
    CalendarMonth as CalendarIcon,
    Store as StoreIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { UserRole } from '../types';
import Logo from '../components/common/Logo';
import './Login.css';

const MotionBox = motion(Box);

interface LoginFormValues {
    email: string;
    password: string;
}

interface RegisterFormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface LoginProps {
    isRegisterMode?: boolean;
}

const Login: React.FC<LoginProps> = ({ isRegisterMode = false }) => {
    const [activeTab, setActiveTab] = useState(isRegisterMode ? 1 : 0);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loginData, setLoginData] = useState<LoginFormValues>({ email: '', password: '' });
    const [registerData, setRegisterData] = useState<RegisterFormValues>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { isAuthenticated, user } = useAuthStore();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const dashboardPath = getDashboardPath(user.role);
            navigate(dashboardPath, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const getDashboardPath = (role: string) => {
        switch (role) {
            case 'barber': return '/barber/dashboard';
            case 'salon_owner': return '/salon-owner/dashboard';
            case 'superadmin': return '/admin/superadmin';
            case 'customer':
            default: return '/customer/dashboard';
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.login({
                emailOrPhone: loginData.email,
                password: loginData.password,
            });

            if (response.success && response.data) {
                const { user, tokens } = response.data;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Login successful! Welcome back.');

                switch (user.role) {
                    case UserRole.BARBER:
                        setTimeout(() => navigate('/barber/dashboard'), 500);
                        break;
                    case UserRole.SALON_OWNER:
                        setTimeout(() => navigate('/salon-owner/dashboard'), 500);
                        break;
                    case UserRole.SUPER_ADMIN:
                        setTimeout(() => navigate('/admin/superadmin'), 500);
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        setTimeout(() => navigate('/customer/dashboard'), 500);
                }
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register({
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
                phone: registerData.phone,
                role: selectedRole,
            });

            if (response.success && response.data && response.data.tokens) {
                const { user, tokens } = response.data;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Account created successfully! Welcome aboard.');

                switch (selectedRole) {
                    case UserRole.BARBER:
                        setTimeout(() => navigate('/barber/dashboard'), 500);
                        break;
                    case UserRole.SALON_OWNER:
                        setTimeout(() => navigate('/salon-owner/dashboard'), 500);
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        setTimeout(() => navigate('/customer/dashboard'), 500);
                }
            } else {
                setActiveTab(0);
                toast.success('Registration successful! Please login.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="login-page">
            {/* Left Side - Branding */}
            <Box className="login-left">
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="login-branding"
                >
                    <Box sx={{ mb: 4 }}>
                        <Logo variant="light" size="large" clickable={false} />
                    </Box>
                    <Typography className="login-tagline">
                        Experience the art of grooming with StylerApp. Check in to check out the best salons near you.
                    </Typography>

                    <Box className="login-features">
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><ScissorsIcon /></Box>
                            <Box>
                                <Typography fontWeight={700}>Expert Stylists</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Top-tier professionals</Typography>
                            </Box>
                        </Box>
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><CalendarIcon /></Box>
                            <Box>
                                <Typography fontWeight={700}>Easy Booking</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Schedule in seconds</Typography>
                            </Box>
                        </Box>
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><StoreIcon /></Box>
                            <Box>
                                <Typography fontWeight={700}>Premium Salons</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Curated locations</Typography>
                            </Box>
                        </Box>
                    </Box>
                </MotionBox>
            </Box>

            {/* Right Side - Form */}
            <Box className="login-right">
                <MotionBox
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="login-form-container"
                >
                    <Box className="login-form-header">
                        <Typography variant="h1">Welcome Back</Typography>
                        <Typography variant="body1">Please enter your details to sign in</Typography>
                    </Box>

                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        className="login-tabs"
                    >
                        <Tab label="Login" />
                        <Tab label="Create Account" />
                    </Tabs>

                    <CardContent sx={{ p: 0 }}>
                        {/* Login Tab */}
                        {activeTab === 0 && (
                            <Box component="form" onSubmit={handleLoginSubmit} className="login-form">
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: '#94a3b8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2.5 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: '#94a3b8' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 4 }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    endIcon={!loading && <ArrowForwardIcon />}
                                    sx={{
                                        height: 56,
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                                </Button>

                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <Button sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>
                                        Forgot Password?
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Signup Tab */}
                        {activeTab === 1 && (
                            <Box component="form" onSubmit={handleRegisterSubmit} className="login-form">
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontWeight: 600, color: '#64748b', textAlign: 'center' }}>
                                        SELECT YOUR ACCOUNT TYPE
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={selectedRole}
                                        exclusive
                                        onChange={(_, newRole) => newRole && setSelectedRole(newRole)}
                                        fullWidth
                                        className="role-selection-group"
                                    >
                                        <ToggleButton value={UserRole.CUSTOMER} className="role-card-btn">
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                <CalendarIcon fontSize="small" />
                                                <Typography variant="body2" fontWeight={600}>Customer</Typography>
                                            </Box>
                                        </ToggleButton>
                                        <ToggleButton value={UserRole.BARBER} className="role-card-btn">
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                <ScissorsIcon fontSize="small" />
                                                <Typography variant="body2" fontWeight={600}>Barber</Typography>
                                            </Box>
                                        </ToggleButton>
                                        <ToggleButton value={UserRole.SALON_OWNER} className="role-card-btn">
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                <StoreIcon fontSize="small" />
                                                <Typography variant="body2" fontWeight={600}>Owner</Typography>
                                            </Box>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontWeight: 600, color: '#64748b' }}>
                                    PERSONAL DETAILS
                                </Typography>

                                <Box sx={{ display: 'grid', gap: 2.5 }}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        required
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        required
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        value={registerData.phone}
                                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                        required
                                        inputProps={{ maxLength: 10 }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        }}
                                    />

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Confirm"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={registerData.confirmPassword}
                                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                                                            {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        mt: 4,
                                        height: 56,
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </MotionBox>
            </Box>
        </Box>
    );
};

export default Login;
