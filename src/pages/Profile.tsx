import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Avatar,
    Typography,
    Grid,
    IconButton,
    Stack,
    Alert,
    CircularProgress,
    Container,
    Fade,
    Paper,
    Divider,
    Chip
} from '@mui/material';

import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Edit as EditIcon,
    PhotoCamera as PhotoCameraIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    Badge as BadgeIcon,
    CalendarMonth as CalendarIcon,
    LocationOn as LocationIcon,
    VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import userService from '../services/userService';

const Profile: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;

        // Build address object from form fields
        const street = formData.get('street') as string;
        const city = formData.get('city') as string;
        const state = formData.get('state') as string;
        const pincode = formData.get('pincode') as string;
        const country = formData.get('country') as string;

        // Only include address if at least one field is filled
        const address = (street || city || state || pincode) ? {
            street: street || '',
            city: city || '',
            state: state || '',
            pincode: pincode || '',
            country: country || 'India',
        } : undefined;

        try {
            setLoading(true);
            const response = await userService.updateProfile({ name, phone, address });

            if (response.success && response.data) {
                updateUser(response.data);
                setSuccess(true);
                setIsEditing(false);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            const response = await userService.uploadProfilePicture(file);

            if (response.success && response.data) {
                updateUser({ profilePicture: response.data.profilePicture });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload profile picture');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const handleCoverImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            const response = await userService.uploadCoverImage(file);

            if (response.success && response.data) {
                updateUser({ coverImage: response.data.coverImage });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload cover image');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', position: 'relative', pb: 8 }}>
            {/* Background Decorative Elements */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)',
                opacity: 0.6,
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ pt: 4, position: 'relative', zIndex: 1 }}>
                {/* Notifications */}
                <Fade in={success}>
                    <Alert
                        icon={<VerifiedUserIcon fontSize="inherit" />}
                        severity="success"
                        sx={{
                            position: 'fixed',
                            top: 24,
                            right: 24,
                            zIndex: 2000,
                            borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                        }}
                    >
                        Profile updated successfully!
                    </Alert>
                </Fade>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Hero / Cover Section */}
                <Box sx={{ position: 'relative', height: 280, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Box sx={{
                        height: '100%',
                        width: '100%',
                        background: user?.coverImage
                            ? `url(${user.coverImage}) center/cover no-repeat`
                            : '#4338ca',
                        position: 'relative'
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            id="cover-image-upload"
                            onChange={handleCoverImageSelect}
                        />
                        <IconButton
                            component="label"
                            htmlFor="cover-image-upload"
                            disabled={uploading}
                            sx={{
                                position: 'absolute',
                                top: 24,
                                right: 24,
                                bgcolor: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                                backdropFilter: 'blur(8px)',
                                borderRadius: '12px',
                                padding: '8px 16px'
                            }}
                        >
                            {uploading ? <CircularProgress size={20} color="inherit" /> : (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PhotoCameraIcon fontSize="small" />
                                    <Typography variant="caption" fontWeight={600}>Change Cover</Typography>
                                </Stack>
                            )}
                        </IconButton>
                    </Box>
                </Box>

                <Grid container spacing={4} sx={{ px: { xs: 1, md: 2 } }}>
                    {/* Left Column: Avatar & Quick Info */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ position: 'relative', mt: '-75px', mb: 4 }}>
                            <Box sx={{ position: 'relative', mt: '-75px', ml: 3, zIndex: 2, display: 'inline-block' }}>
                                <Avatar
                                    src={user?.profilePicture}
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        border: '6px solid white',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                        bgcolor: '#6366f1',
                                        fontSize: '4rem',
                                        fontWeight: 700
                                    }}
                                >
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="profile-picture-upload"
                                    onChange={handleFileSelect}
                                />
                                <IconButton
                                    component="label"
                                    htmlFor="profile-picture-upload"
                                    disabled={uploading}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'white',
                                        color: '#6366f1',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.1)' },
                                    }}
                                >
                                    <PhotoCameraIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ mt: 2, px: 2 }}>
                                <Typography variant="h4" fontWeight={800} color="#1e293b">
                                    {user?.name || 'User Name'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    {user?.email}
                                </Typography>

                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                                    <Chip
                                        icon={<BadgeIcon sx={{ fontSize: '16px !important' }} />}
                                        label={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                                        sx={{ borderRadius: '8px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontWeight: 600 }}
                                    />
                                    <Chip
                                        icon={<CalendarIcon sx={{ fontSize: '16px !important' }} />}
                                        label={`Joined ${new Date().getFullYear()}`}
                                        sx={{ borderRadius: '8px', bgcolor: 'white', border: '1px solid #e2e8f0' }}
                                    />
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Column: Edtiable Form */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: '24px',
                                border: '1px solid',
                                borderColor: 'rgba(0,0,0,0.05)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                bgcolor: 'white'
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={700} color="#1e293b">
                                        Personal Information
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Update your personal details and address
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    onClick={() => setIsEditing(!isEditing)}
                                    color={isEditing ? "error" : "primary"}
                                    startIcon={isEditing ? <CloseIcon /> : <EditIcon />}
                                    sx={{
                                        borderRadius: '12px',
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        boxShadow: isEditing ? 'none' : '0 4px 14px rgba(99, 102, 241, 0.4)',
                                        bgcolor: isEditing ? '#fee2e2' : '#6366f1',
                                        color: isEditing ? '#ef4444' : 'white',
                                        '&:hover': {
                                            bgcolor: isEditing ? '#fecaca' : '#4f46e5',
                                        }
                                    }}
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </Box>

                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#64748b' }}>Full Name</Typography>
                                        <TextField
                                            name="name"
                                            defaultValue={user?.name}
                                            fullWidth
                                            disabled={!isEditing}
                                            placeholder="Enter your full name"
                                            InputProps={{
                                                startAdornment: <PersonIcon sx={{ color: '#cbd5e1', mr: 1.5 }} />,
                                                sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#64748b' }}>Email Address</Typography>
                                        <TextField
                                            name="email"
                                            value={user?.email}
                                            fullWidth
                                            disabled
                                            InputProps={{
                                                startAdornment: <EmailIcon sx={{ color: '#cbd5e1', mr: 1.5 }} />,
                                                sx: { borderRadius: '12px', bgcolor: '#f8fafc' }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#64748b' }}>Phone Number</Typography>
                                        <TextField
                                            name="phone"
                                            defaultValue={user?.phone}
                                            fullWidth
                                            disabled={!isEditing}
                                            placeholder="+91 98765 43210"
                                            InputProps={{
                                                startAdornment: <PhoneIcon sx={{ color: '#cbd5e1', mr: 1.5 }} />,
                                                sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' }
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ mb: 2 }}>
                                            Address Details
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#64748b' }}>Street Address</Typography>
                                        <TextField
                                            name="street"
                                            defaultValue={user?.addresses?.[0]?.street || ''}
                                            fullWidth
                                            disabled={!isEditing}
                                            placeholder="123 Main St, Apt 4B"
                                            InputProps={{
                                                startAdornment: <LocationIcon sx={{ color: '#cbd5e1', mr: 1.5 }} />,
                                                sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' }
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#64748b' }}>City</Typography>
                                        <TextField
                                            name="city"
                                            defaultValue={user?.addresses?.[0]?.city || ''}
                                            fullWidth
                                            disabled={!isEditing}
                                            placeholder="Mumbai"
                                            InputProps={{ sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#64748b' }}>State</Typography>
                                        <TextField
                                            name="state"
                                            defaultValue={user?.addresses?.[0]?.state || ''}
                                            fullWidth
                                            disabled={!isEditing}
                                            placeholder="Maharashtra"
                                            InputProps={{ sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#64748b' }}>Pincode</Typography>
                                        <TextField
                                            name="pincode"
                                            defaultValue={user?.addresses?.[0]?.pincode || ''}
                                            fullWidth
                                            disabled={!isEditing}
                                            placeholder="400001"
                                            InputProps={{ sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#64748b' }}>Country</Typography>
                                        <TextField
                                            name="country"
                                            defaultValue={user?.addresses?.[0]?.country || 'India'}
                                            fullWidth
                                            disabled={!isEditing}
                                            placeholder="India"
                                            InputProps={{ sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' } }}
                                        />
                                    </Grid>

                                    {isEditing && (
                                        <Grid size={{ xs: 12 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                                <Button
                                                    variant="text"
                                                    color="inherit"
                                                    onClick={() => setIsEditing(false)}
                                                    sx={{ borderRadius: '10px', fontWeight: 600 }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={loading}
                                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                    sx={{
                                                        borderRadius: '10px',
                                                        px: 4,
                                                        py: 1.2,
                                                        fontWeight: 600,
                                                        bgcolor: '#6366f1',
                                                        '&:hover': { bgcolor: '#4f46e5' },
                                                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                                                    }}
                                                >
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Profile;
