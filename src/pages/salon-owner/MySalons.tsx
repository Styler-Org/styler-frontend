import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Alert,
    CircularProgress,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Store as StoreIcon,
    LocationOn as LocationIcon,
    AccessTime as TimeIcon,
    Star as StarIcon,
    ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useSalonStore } from '../../stores/salonStore';
import { useAuthStore } from '../../stores/authStore';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const MySalons: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { mySalons, loading, error, fetchMySalons, deleteSalon } = useSalonStore();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [salonToDelete, setSalonToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchMySalons();
    }, [fetchMySalons]);

    const handleDeleteClick = (salonId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSalonToDelete(salonId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!salonToDelete) return;

        setDeleting(true);
        try {
            await deleteSalon(salonToDelete);
            setDeleteDialogOpen(false);
            setSalonToDelete(null);
        } catch (error) {
            // Error is already in the store
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSalonToDelete(null);
    };

    // Helper function to check if salon is currently open
    const isSalonOpen = (salon: any): boolean => {
        if (!salon.operatingHours || salon.operatingHours.length === 0) return false;

        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

        const todayHours = salon.operatingHours.find((hours: any) =>
            hours.day.toLowerCase() === currentDay.toLowerCase()
        );

        if (!todayHours || !todayHours.isOpen || !todayHours.slots || todayHours.slots.length === 0) return false;

        // Parse opening and closing times (format: "HH:MM")
        const [openHour, openMin] = todayHours.slots[0].start.split(':').map(Number);
        const [closeHour, closeMin] = todayHours.slots[0].end.split(':').map(Number);

        const openingTime = openHour * 60 + openMin;
        const closingTime = closeHour * 60 + closeMin;

        return currentTime >= openingTime && currentTime <= closingTime;
    };

    return (
        <Box className="my-salons-page" sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Header Section */}
            <Box sx={{
                bgcolor: 'white',
                pt: 6,
                pb: 8,
                px: 3,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                mb: 6
            }}>
                {/* Background decorative elements */}
                <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
                        <Box>
                            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, fontWeight: 600 }}>
                                PORTFOLIO
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1e293b', mt: 1 }}>
                                My Salons
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600 }}>
                                Manage your salon locations, update details, and track performance.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/salons/create')}
                            sx={{
                                borderRadius: '50px',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            Add New Salon
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
                        {error}
                    </Alert>
                )}

                {loading && mySalons.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                        <CircularProgress />
                    </Box>
                ) : !loading && mySalons.length === 0 ? (
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            px: 3,
                            bgcolor: 'white',
                            borderRadius: '24px',
                            border: '1px dashed rgba(0,0,0,0.1)',
                            maxWidth: 600,
                            mx: 'auto',
                            mt: 4
                        }}
                    >
                        <Box sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3
                        }}>
                            <StoreIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                            No salons yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            You haven't registered any salons yet. Start building your network today!
                        </Typography>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/salons/create')}
                            sx={{ borderRadius: '50px', px: 4, py: 1.2 }}
                        >
                            Register First Salon
                        </Button>
                    </MotionBox>
                ) : (
                    <Grid container spacing={3}>
                        {mySalons.map((salon, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={salon._id}>
                                <MotionCard
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => navigate(`/salon-owner/salons/${salon._id}`)}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '24px',
                                        border: '1px solid rgba(0,0,0,0.04)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', height: 220, bgcolor: '#f1f5f9' }}>
                                        {salon.images && salon.images.length > 0 && salon.images[0] ? (
                                            <CardMedia
                                                component="img"
                                                height="100%"
                                                image={salon.images[0]}
                                                alt={salon.displayName || salon.businessName}
                                                sx={{ objectFit: 'cover' }}
                                                onError={(e: any) => {
                                                    // If image fails to load, hide it and show fallback
                                                    e.target.style.display = 'none';
                                                    const fallback = e.target.nextSibling;
                                                    if (fallback) fallback.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <Box sx={{
                                            height: '100%',
                                            display: (salon.images && salon.images.length > 0 && salon.images[0]) ? 'none' : 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            color: '#94a3b8',
                                            gap: 1
                                        }}>
                                            <StoreIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                                            <Typography variant="caption" color="text.secondary">
                                                No image
                                            </Typography>
                                        </Box>
                                        {/* Status Chip */}
                                        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                                            <Chip
                                                icon={<TimeIcon sx={{ fontSize: '1rem !important' }} />}
                                                label={
                                                    !salon.isActive
                                                        ? 'Permanently Closed'
                                                        : isSalonOpen(salon)
                                                            ? 'Open Now'
                                                            : 'Closed'
                                                }
                                                sx={{
                                                    bgcolor: !salon.isActive
                                                        ? 'rgba(127, 29, 29, 0.9)'
                                                        : isSalonOpen(salon)
                                                            ? 'rgba(16, 185, 129, 0.9)'
                                                            : 'rgba(239, 68, 68, 0.9)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    backdropFilter: 'blur(4px)',
                                                    border: 'none',
                                                    '& .MuiChip-icon': { color: 'white' }
                                                }}
                                            />
                                        </Box>

                                        {/* Rating Badge */}
                                        <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                bgcolor: 'white',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '20px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}>
                                                <StarIcon sx={{ color: '#f59e0b', fontSize: 16 }} />
                                                <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b' }}>
                                                    {typeof salon.rating === 'object' && salon.rating?.average
                                                        ? salon.rating.average.toFixed(1)
                                                        : typeof salon.rating === 'number'
                                                            ? salon.rating.toFixed(1)
                                                            : 'New'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                                            {salon.displayName || salon.businessName}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 2 }}>
                                            <LocationIcon sx={{ fontSize: 18, mr: 0.5, color: '#64748b' }} />
                                            <Typography variant="body2" noWrap>
                                                {salon.address ? `${salon.address.street}, ${salon.address.city}` : 'No address provided'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                            {(salon as any).services?.slice(0, 3).map((service: any, index: number) => (
                                                <Chip
                                                    key={index}
                                                    label={typeof service === 'string' ? service : service.name || 'Service'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#f1f5f9',
                                                        color: '#475569',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500,
                                                        borderRadius: '6px'
                                                    }}
                                                />
                                            ))}
                                            {(salon as any).services?.length > 3 && (
                                                <Chip
                                                    label={`+${(salon as any).services.length - 3}`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#f1f5f9',
                                                        color: '#64748b',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        borderRadius: '6px'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>

                                    <Box sx={{
                                        p: 2,
                                        pt: 0,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderTop: '1px solid rgba(0,0,0,0.04)'
                                    }}>
                                        <Button
                                            endIcon={<ArrowIcon />}
                                            sx={{ color: '#6366f1', fontWeight: 600, textTransform: 'none' }}
                                        >
                                            Manage
                                        </Button>
                                        <Box>
                                            <Tooltip title="Edit Salon">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/salons/${salon._id}/edit`);
                                                    }}
                                                    sx={{ color: '#64748b', '&:hover': { color: '#3b82f6', bgcolor: '#eff6ff' } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Salon">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleDeleteClick(salon._id, e)}
                                                    disabled={loading || deleting}
                                                    sx={{ color: '#64748b', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                PaperProps={{
                    sx: { borderRadius: '24px', p: 1 }
                }}
            >
                <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700 }}>
                    Delete Salon?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this salon? This action cannot be undone.
                        All associated data including services, barbers, and appointments will be permanently removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        disabled={deleting}
                        sx={{ color: '#64748b', fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                        sx={{ borderRadius: '50px', px: 3, fontWeight: 600, boxShadow: 'none' }}
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {deleting ? 'Deleting...' : 'Delete Salon'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default MySalons;
