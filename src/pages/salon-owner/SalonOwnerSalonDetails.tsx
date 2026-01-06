import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Tabs,
    Tab,
    useTheme,
    Fade
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Star as StarIcon,
    People as PeopleIcon,
    Store as StoreIcon,
    AccessTime as AccessTimeIcon,
    ContentCut as ServiceIcon,
    Delete as DeleteIcon,
    Settings as SettingsIcon,
    Info as InfoIcon,
    Verified as VerifiedIcon
} from '@mui/icons-material';
import { salonService } from '../../services/salonService';
import { barberService } from '../../services/barberService';
import { Salon, Service, Barber } from '../../types';
import { motion } from 'framer-motion';
import SalonSettingsModal from '../../components/salon/SalonSettingsModal';
import ManageServicesModal from '../../components/salon/ManageServicesModal';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`salon-tabpanel-${index}`}
            aria-labelledby={`salon-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    <Fade in={value === index}>
                        <Box>{children}</Box>
                    </Fade>
                </Box>
            )}
        </div>
    );
}

const SalonOwnerSalonDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [manageServicesModalOpen, setManageServicesModalOpen] = useState(false);

    // Mock stats for the overview
    const [stats, setStats] = useState({
        monthlyRevenue: 125000,
        totalBookings: 86,
        avgRating: 4.8
    });

    useEffect(() => {
        const fetchSalonDetails = async () => {
            if (!id) return;

            setLoading(true);
            try {
                // Fetch salon details
                const salonResponse = await salonService.getSalonById(id);
                setSalon(salonResponse.data as Salon);

                // Fetch services
                try {
                    const servicesResponse = await salonService.getSalonServices(id);
                    setServices(servicesResponse.data || []);
                } catch (err) {
                    console.error('Error fetching services:', err);
                    setServices([]);
                }

                // Fetch staff
                try {
                    const staffResponse = await barberService.getSalonBarbers(id);
                    setStaff(staffResponse.data || []);
                } catch (err) {
                    console.error('Error fetching staff:', err);
                    setStaff([]);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load salon details');
            } finally {
                setLoading(false);
            }
        };

        fetchSalonDetails();
    }, [id]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Helper function to check if salon is currently open
    const isSalonOpen = (): boolean => {
        if (!salon?.operatingHours || salon.operatingHours.length === 0) return false;

        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const todayHours = salon.operatingHours.find((hours) =>
            hours.day.toLowerCase() === currentDay.toLowerCase()
        );

        if (!todayHours || !todayHours.isOpen || !todayHours.slots || todayHours.slots.length === 0) return false;

        const [openHour, openMin] = todayHours.slots[0].start.split(':').map(Number);
        const [closeHour, closeMin] = todayHours.slots[0].end.split(':').map(Number);

        const openingTime = openHour * 60 + openMin;
        const closingTime = closeHour * 60 + closeMin;

        return currentTime >= openingTime && currentTime <= closingTime;
    };

    // Helper function to safely format rating
    const formatRating = (rating: any): string => {
        if (!rating) return 'N/A';
        if (typeof rating === 'number') return rating.toFixed(1);
        if (typeof rating === 'object' && rating.average && typeof rating.average === 'number') {
            return rating.average.toFixed(1);
        }
        return 'N/A';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !salon) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Salon not found'}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Back to Salons
                </Button>
            </Container>
        );
    }

    const activeStaff = staff.filter(s => s.isActive && s.status === 'approved');
    const activeServices = services.filter(s => s.isActive);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Header/Hero Section */}
            <Box sx={{
                bgcolor: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'visible', // Allow content to overlap
                mb: 4
            }}>
                {/* Gradient Banner */}
                <Box sx={{
                    height: 200,
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    position: 'relative'
                }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/salons-owner/my-salons')}
                        sx={{
                            position: 'absolute',
                            top: 24,
                            left: 24,
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' }
                        }}
                    >
                        My Salons
                    </Button>
                </Box>

                <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 1, pb: 2 }}>
                    <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={4} alignItems="center">
                                {/* Salon Image/Logo Placeholder */}
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Box sx={{
                                        width: '100%',
                                        paddingTop: '100%', // 1:1 Aspect Ratio
                                        position: 'relative',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        bgcolor: '#f1f5f9',
                                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                                    }}>
                                        {salon.images && salon.images.length > 0 && salon.images[0] ? (
                                            <img
                                                src={salon.images[0]}
                                                alt={salon.name || salon.displayName}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e: any) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : null}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            display: (salon.images && salon.images.length > 0 && salon.images[0]) ? 'none' : 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            color: '#94a3b8',
                                            gap: 1
                                        }}>
                                            <StoreIcon sx={{ fontSize: 60, opacity: 0.5 }} />
                                            <Typography variant="caption" color="text.secondary">
                                                No image
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Salon Details */}
                                <Grid size={{ xs: 12, md: 9 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                    {salon.name}
                                                </Typography>
                                                <Chip
                                                    label={isSalonOpen() ? 'Open Now' : 'Closed'}
                                                    icon={<AccessTimeIcon sx={{ fontSize: '1rem !important' }} />}
                                                    sx={{
                                                        bgcolor: isSalonOpen() ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: isSalonOpen() ? '#10b981' : '#ef4444',
                                                        fontWeight: 700,
                                                        border: 'none',
                                                        '& .MuiChip-icon': { color: 'inherit' }
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                                                {/* Rating */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <StarIcon sx={{ color: '#f59e0b' }} />
                                                    <Typography variant="body1" fontWeight={700}>
                                                        {formatRating(salon.rating)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        ({salon.totalReviews || 0} reviews)
                                                    </Typography>
                                                </Box>

                                                {/* Location */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                                    <LocationIcon fontSize="small" />
                                                    <Typography variant="body2">
                                                        {salon.address?.street}, {salon.address?.city}
                                                    </Typography>
                                                </Box>

                                                {/* Phone */}
                                                {salon.phone && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                                        <PhoneIcon fontSize="small" />
                                                        <Typography variant="body2">
                                                            {salon.phone}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => navigate(`/salons/${id}/edit`)}
                                                    sx={{
                                                        borderRadius: '50px',
                                                        px: 3,
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                    }}
                                                >
                                                    Edit Details
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<SettingsIcon />}
                                                    onClick={() => setSettingsModalOpen(true)}
                                                    sx={{
                                                        borderRadius: '50px',
                                                        px: 3,
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        borderColor: 'rgba(0,0,0,0.1)',
                                                        color: '#64748b',
                                                        '&:hover': { borderColor: '#6366f1', color: '#6366f1', bgcolor: 'transparent' }
                                                    }}
                                                >
                                                    Settings
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* Mini Stats for Hero */}
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Card variant="outlined" sx={{ p: 2, borderRadius: '16px', minWidth: 100, textAlign: 'center', bgcolor: '#f8fafc', border: 'none' }}>
                                                <Typography variant="h5" fontWeight={700} color="primary">{activeStaff.length}</Typography>
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">STAFF</Typography>
                                            </Card>
                                            <Card variant="outlined" sx={{ p: 2, borderRadius: '16px', minWidth: 100, textAlign: 'center', bgcolor: '#f8fafc', border: 'none' }}>
                                                <Typography variant="h5" fontWeight={700} color="primary">{activeServices.length}</Typography>
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">SERVICES</Typography>
                                            </Card>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Tabs Navigation */}
                    <Box sx={{ mt: 4, borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="salon tabs"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    mr: 4,
                                    color: '#64748b',
                                    '&.Mui-selected': { color: '#6366f1' }
                                },
                                '& .MuiTabs-indicator': {
                                    bgcolor: '#6366f1',
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            <Tab label="Overview" icon={<InfoIcon fontSize="small" />} iconPosition="start" />
                            <Tab label="Services" icon={<ServiceIcon fontSize="small" />} iconPosition="start" />
                            <Tab label="Staff" icon={<PeopleIcon fontSize="small" />} iconPosition="start" />
                        </Tabs>
                    </Box>

                    {/* Tab 1: Overview */}
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid container spacing={4}>
                            {/* About Section */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>About the Salon</Typography>
                                <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                                    {salon.description || "No description provided for this salon yet. keeping your profile updated helps attract more customers."}
                                </Typography>

                                <Grid container spacing={3} sx={{ mt: 2 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>ADDRESS</Typography>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                                <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: '12px', height: 'fit-content' }}>
                                                    <LocationIcon color="action" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body1" fontWeight={500}>{salon.address?.street}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{salon.address?.city}, {salon.address?.state} {salon.address?.pincode}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>CONTACT</Typography>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                                <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: '12px', height: 'fit-content' }}>
                                                    <PhoneIcon color="action" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body1" fontWeight={500}>{salon.phone || 'N/A'}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{salon.email || 'N/A'}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Hours Section */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                            <AccessTimeIcon color="action" />
                                            <Typography variant="h6" fontWeight={700}>Opening Hours</Typography>
                                        </Box>

                                        {!salon.operatingHours || salon.operatingHours.length === 0 ? (
                                            <Typography color="text.secondary">Hours not set</Typography>
                                        ) : (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {salon.operatingHours.map((hours, index) => (
                                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body2" fontWeight={600} sx={{ width: 100, textTransform: 'capitalize' }}>{hours.day}</Typography>
                                                        {hours.isOpen && hours.slots && hours.slots.length > 0 ? (
                                                            <Chip
                                                                label={`${hours.slots[0].start} - ${hours.slots[0].end}`}
                                                                size="small"
                                                                sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 600, fontSize: '0.75rem' }}
                                                            />
                                                        ) : (
                                                            <Typography variant="body2" color="error" sx={{ fontSize: '0.85rem' }}>Closed</Typography>
                                                        )}
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CustomTabPanel>

                    {/* Tab 2: Services */}
                    <CustomTabPanel value={tabValue} index={1}>
                        <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight={700}>Services Menu</Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ borderRadius: '50px', textTransform: 'none' }}
                                    onClick={() => setManageServicesModalOpen(true)}
                                >
                                    Manage Services
                                </Button>
                            </Box>

                            {services.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <ServiceIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                                    <Typography color="text.secondary">No services added yet.</Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>SERVICE NAME</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>CATEGORY</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>PRICE</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>DURATION</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b' }}>STATUS</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {services.map((service) => (
                                                <TableRow key={service._id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600}>{service.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{service.description}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={service.gender}
                                                            size="small"
                                                            sx={{ borderRadius: '6px', fontSize: '0.7rem', textTransform: 'capitalize' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" fontWeight={600} color="primary">₹{service.price}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2">{service.duration} mins</Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={service.isActive ? 'Active' : 'Inactive'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: service.isActive ? '#f0fdf4' : '#f1f5f9',
                                                                color: service.isActive ? '#16a34a' : '#64748b',
                                                                fontWeight: 600,
                                                                borderRadius: '6px'
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Card>
                    </CustomTabPanel>

                    {/* Tab 3: Staff */}
                    <CustomTabPanel value={tabValue} index={2}>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ borderRadius: '50px', textTransform: 'none' }}
                                onClick={() => navigate('/salon-owner/staff-management')}
                            >
                                Manage Staff
                            </Button>
                        </Box>

                        {staff.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: '24px', border: '1px dashed rgba(0,0,0,0.1)' }}>
                                <PeopleIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                                <Typography color="text.secondary">No staff members added yet.</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {staff.map((barber) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={barber._id}>
                                        <MotionCard
                                            whileHover={{ y: -5 }}
                                            sx={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'visible', mt: 2 }}
                                        >
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, pt: 0, position: 'relative' }}>
                                                <Avatar
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        bgcolor: '#6366f1',
                                                        fontSize: '2rem',
                                                        border: '4px solid white',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                        mt: -4,
                                                        mb: 2
                                                    }}
                                                >
                                                    {(barber.userId as any)?.name?.charAt(0) || 'B'}
                                                </Avatar>
                                                <Typography variant="h6" fontWeight={700}>{(barber.userId as any)?.name}</Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {barber.experience} years experience
                                                </Typography>

                                                <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
                                                    <Chip
                                                        icon={<StarIcon sx={{ fontSize: '1rem !important', color: '#f59e0b' }} />}
                                                        label={formatRating(barber.rating)}
                                                        size="small"
                                                        sx={{ bgcolor: '#fffbeb', color: '#b45309', fontWeight: 600 }}
                                                    />
                                                    <Chip
                                                        label={barber.status}
                                                        size="small"
                                                        color={barber.status === 'approved' ? 'success' : 'warning'}
                                                        sx={{ fontSize: '0.75rem', textTransform: 'capitalize', borderRadius: '6px' }}
                                                    />
                                                </Box>

                                                <Box sx={{ width: '100%', pt: 2, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1, textAlign: 'center' }}>SPECIALTIES</Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                                                        {barber.specialties?.slice(0, 3).map((spec, i) => (
                                                            <Chip key={i} label={spec} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </MotionCard>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </CustomTabPanel>

                </Container>
            </Box>

            {/* Salon Settings Modal */}
            {salon && (
                <SalonSettingsModal
                    open={settingsModalOpen}
                    onClose={() => setSettingsModalOpen(false)}
                    salon={salon}
                    onUpdate={() => {
                        // Refresh salon data after settings update
                        if (id) {
                            salonService.getSalonById(id).then(response => {
                                if (response.success && response.data) {
                                    setSalon(response.data);
                                }
                            });
                        }
                    }}
                />
            )}

            {/* Manage Services Modal */}
            {id && (
                <ManageServicesModal
                    open={manageServicesModalOpen}
                    onClose={() => setManageServicesModalOpen(false)}
                    salonId={id}
                    services={services}
                    onUpdate={() => {
                        // Refresh services data after update
                        if (id) {
                            salonService.getSalonServices(id).then(response => {
                                if (response.success && response.data) {
                                    setServices(response.data);
                                }
                            });
                        }
                    }}
                />
            )}
        </Box>
    );
};

export default SalonOwnerSalonDetails;
