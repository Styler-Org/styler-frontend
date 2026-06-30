import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    TextField,
    Button,
    Avatar,
    IconButton,
    InputAdornment,
    Divider,
    Switch,
    CircularProgress,
    Grid,
    alpha,
    useTheme,
    Chip,
    Stack
} from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Notifications as NotificationsIcon,
    CloudUpload as CloudUploadIcon,
    Visibility,
    VisibilityOff,
    Save as SaveIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    ChevronRight as ChevronRightIcon,
    CheckCircle as CheckCircleIcon,
    Shield as ShieldIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

const MotionBox = motion(Box);

type Section = 'profile' | 'security' | 'notifications';

const navItems: { id: Section; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'profile', label: 'Profile', icon: <PersonIcon />, description: 'Your personal info' },
    { id: 'security', label: 'Security', icon: <LockIcon />, description: 'Password & access' },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon />, description: 'Alerts & updates' },
];

const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

interface FieldRowProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const FieldLabel: React.FC<FieldRowProps> = ({ label, icon, children }) => (
    <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Box sx={{ color: '#94a3b8', display: 'flex', fontSize: 18 }}>{icon}</Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                {label}
            </Typography>
        </Stack>
        {children}
    </Box>
);

const Settings: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const toast = useToast();
    const theme = useTheme();
    const [activeSection, setActiveSection] = useState<Section>('profile');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '', email: '', phone: '',
        address: { street: '', city: '', state: '', pincode: '', country: '' }
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '', newPassword: '', confirmNewPassword: ''
    });
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [notifications, setNotifications] = useState({
        emailBookings: true, smsUpdates: true,
        promos: false, reminders: true
    });

    useEffect(() => {
        if (user) {
            const addr = user.addresses?.[0] ?? {};
            setProfileData({
                name: user.name || '', email: user.email || '', phone: user.phone || '',
                address: {
                    street: (addr as any).street || '',
                    city: (addr as any).city || '',
                    state: (addr as any).state || '',
                    pincode: (addr as any).pincode || '',
                    country: (addr as any).country || 'India'
                }
            });
        }
    }, [user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const key = name.slice(8);
            setProfileData(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await userService.uploadProfilePicture(file);
            if (res.success && res.data) {
                updateUser({ profilePicture: res.data.profilePicture });
                toast.success('Photo updated');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await userService.updateProfile({
                name: profileData.name,
                phone: profileData.phone,
                address: profileData.address
            });
            if (res.success && res.data) {
                updateUser(res.data);
                toast.success('Profile saved');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated');
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#f8fafc',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#c7d2fe' },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pt: { xs: 14, md: 12 }, pb: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Settings
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your profile, security, and preferences
                    </Typography>
                </Box>

                <Grid container spacing={4} alignItems="flex-start">
                    {/* Left Sidebar */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Card sx={{ borderRadius: 5, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            {/* Avatar Section */}
                            <Box sx={{
                                p: 4, pb: 3, textAlign: 'center',
                                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
                            }}>
                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                    <Avatar
                                        src={user?.profilePicture}
                                        sx={{ width: 88, height: 88, mx: 'auto', border: '3px solid rgba(255,255,255,0.3)', bgcolor: '#6366f1', fontSize: '2.2rem', fontWeight: 700 }}
                                    >
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <IconButton
                                        component="label"
                                        size="small"
                                        disabled={uploading}
                                        sx={{
                                            position: 'absolute', bottom: 0, right: -4,
                                            bgcolor: 'white', color: '#6366f1', width: 30, height: 30,
                                            '&:hover': { bgcolor: '#f0f0ff' },
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {uploading ? <CircularProgress size={14} /> : <CloudUploadIcon sx={{ fontSize: 14 }} />}
                                        <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                                    </IconButton>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                                    {user?.name || 'User'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {user?.email}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chip
                                        label={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, fontSize: '0.7rem' }}
                                    />
                                </Box>
                            </Box>

                            {/* Nav Links */}
                            <Box sx={{ p: 1.5 }}>
                                {navItems.map((item) => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <Box
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            sx={{
                                                display: 'flex', alignItems: 'center', gap: 2, px: 2.5, py: 2,
                                                borderRadius: '12px', cursor: 'pointer', mb: 0.5,
                                                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : '#f8fafc' }
                                            }}
                                        >
                                            <Box sx={{
                                                width: 38, height: 38, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : '#f1f5f9',
                                                color: isActive ? theme.palette.primary.main : '#64748b',
                                                transition: 'all 0.2s'
                                            }}>
                                                {item.icon}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: isActive ? 700 : 600, color: isActive ? theme.palette.primary.main : '#334155' }}>
                                                    {item.label}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>{item.description}</Typography>
                                            </Box>
                                            <ChevronRightIcon sx={{ fontSize: 18, color: isActive ? theme.palette.primary.main : '#cbd5e1', opacity: isActive ? 1 : 0.5 }} />
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Card>
                    </Grid>

                    {/* Right Content */}
                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <AnimatePresence mode="wait">
                            {/* PROFILE SECTION */}
                            {activeSection === 'profile' && (
                                <MotionBox key="profile" variants={slideVariants} initial="enter" animate="center" exit="exit">
                                    <Card sx={{ borderRadius: 5, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                                        <Box sx={{ px: 4, py: 3.5, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.primary.main }}>
                                                <PersonIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>Personal Information</Typography>
                                                <Typography variant="caption" color="text.secondary">Update your name, phone, and address</Typography>
                                            </Box>
                                        </Box>
                                        <Box component="form" onSubmit={handleProfileSubmit} sx={{ p: 4 }}>
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <FieldLabel label="Full Name" icon={<PersonIcon fontSize="inherit" />}>
                                                        <TextField fullWidth name="name" value={profileData.name} onChange={handleProfileChange} placeholder="Your full name" sx={textFieldSx} />
                                                    </FieldLabel>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <FieldLabel label="Email Address" icon={<EmailIcon fontSize="inherit" />}>
                                                        <TextField fullWidth name="email" value={profileData.email} disabled placeholder="your@email.com"
                                                            helperText="Email cannot be changed" sx={textFieldSx} />
                                                    </FieldLabel>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <FieldLabel label="Phone Number" icon={<PhoneIcon fontSize="inherit" />}>
                                                        <TextField fullWidth name="phone" value={profileData.phone} onChange={handleProfileChange} placeholder="+91 98765 43210" sx={textFieldSx} />
                                                    </FieldLabel>
                                                </Grid>
                                            </Grid>

                                            <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationIcon sx={{ fontSize: 18, color: '#94a3b8' }} /> Address Details
                                            </Typography>
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField fullWidth label="Street Address" name="address.street" value={profileData.address.street} onChange={handleProfileChange} sx={textFieldSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="City" name="address.city" value={profileData.address.city} onChange={handleProfileChange} sx={textFieldSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="State" name="address.state" value={profileData.address.state} onChange={handleProfileChange} placeholder="Maharashtra" sx={textFieldSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Pincode" name="address.pincode" value={profileData.address.pincode} onChange={handleProfileChange} sx={textFieldSx} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Country" name="address.country" value={profileData.address.country || 'India'} onChange={handleProfileChange} sx={textFieldSx} />
                                                </Grid>
                                            </Grid>

                                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    disabled={loading}
                                                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                                                    sx={{ borderRadius: '50px', px: 4, fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
                                                >
                                                    {loading ? 'Saving…' : 'Save Changes'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                </MotionBox>
                            )}

                            {/* SECURITY SECTION */}
                            {activeSection === 'security' && (
                                <MotionBox key="security" variants={slideVariants} initial="enter" animate="center" exit="exit">
                                    <Card sx={{ borderRadius: 5, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                                        <Box sx={{ px: 4, py: 3.5, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha('#ef4444', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                                <ShieldIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>Security Settings</Typography>
                                                <Typography variant="caption" color="text.secondary">Update your password to keep your account safe</Typography>
                                            </Box>
                                        </Box>

                                        <Box component="form" onSubmit={handlePasswordSubmit} sx={{ p: 4, maxWidth: 520 }}>
                                            <Box sx={{ p: 3, bgcolor: '#fef9c3', borderRadius: '14px', border: '1px solid #fde68a', mb: 4 }}>
                                                <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 600 }}>
                                                    Use a strong password with at least 8 characters, mixing letters, numbers and symbols.
                                                </Typography>
                                            </Box>

                                            <Stack spacing={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Current Password"
                                                    name="currentPassword"
                                                    type={showCurrentPwd ? 'text' : 'password'}
                                                    value={passwordData.currentPassword}
                                                    onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowCurrentPwd(v => !v)} edge="end">
                                                                    {showCurrentPwd ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    sx={textFieldSx}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="New Password"
                                                    name="newPassword"
                                                    type={showNewPwd ? 'text' : 'password'}
                                                    value={passwordData.newPassword}
                                                    onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowNewPwd(v => !v)} edge="end">
                                                                    {showNewPwd ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    sx={textFieldSx}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Confirm New Password"
                                                    name="confirmNewPassword"
                                                    type={showNewPwd ? 'text' : 'password'}
                                                    value={passwordData.confirmNewPassword}
                                                    onChange={e => setPasswordData(p => ({ ...p, confirmNewPassword: e.target.value }))}
                                                    error={!!passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword}
                                                    helperText={passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword ? "Passwords don't match" : ''}
                                                    sx={textFieldSx}
                                                />
                                            </Stack>

                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                                                sx={{ mt: 4, borderRadius: '50px', fontWeight: 700, textTransform: 'none', py: 1.5, boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
                                            >
                                                {loading ? 'Updating…' : 'Update Password'}
                                            </Button>
                                        </Box>
                                    </Card>
                                </MotionBox>
                            )}

                            {/* NOTIFICATIONS SECTION */}
                            {activeSection === 'notifications' && (
                                <MotionBox key="notifications" variants={slideVariants} initial="enter" animate="center" exit="exit">
                                    <Card sx={{ borderRadius: 5, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                                        <Box sx={{ px: 4, py: 3.5, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha('#10b981', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                                <NotificationsIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>Notification Preferences</Typography>
                                                <Typography variant="caption" color="text.secondary">Choose how you'd like to receive updates</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ p: 4 }}>
                                            {[
                                                { key: 'emailBookings', title: 'Email — Booking Confirmations', description: 'Receive an email when a booking is confirmed or changed.', color: '#6366f1' },
                                                { key: 'smsUpdates', title: 'SMS / WhatsApp Updates', description: 'Get real-time status updates on your appointments.', color: '#10b981' },
                                                { key: 'reminders', title: 'Appointment Reminders', description: 'Get reminded 24 hours and 1 hour before your appointment.', color: '#f59e0b' },
                                                { key: 'promos', title: 'Promotions & Offers', description: 'Receive deals, seasonal offers, and loyalty rewards.', color: '#ec4899' },
                                            ].map((item, i) => (
                                                <React.Fragment key={item.key}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', py: 2.5, gap: 2 }}>
                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: alpha(item.color, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                                                                <CheckCircleIcon sx={{ fontSize: 20, color: item.color }} />
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                                                                    {item.title}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                                    {item.description}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Switch
                                                            checked={notifications[item.key as keyof typeof notifications]}
                                                            onChange={e => setNotifications(p => ({ ...p, [item.key]: e.target.checked }))}
                                                            sx={{
                                                                flexShrink: 0,
                                                                '& .MuiSwitch-switchBase.Mui-checked': { color: item.color },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: item.color }
                                                            }}
                                                        />
                                                    </Box>
                                                    {i < 3 && <Divider sx={{ borderStyle: 'dashed' }} />}
                                                </React.Fragment>
                                            ))}

                                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => toast.success('Preferences saved')}
                                                    sx={{ borderRadius: '50px', px: 4, fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
                                                >
                                                    Save Preferences
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                </MotionBox>
                            )}
                        </AnimatePresence>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Settings;
