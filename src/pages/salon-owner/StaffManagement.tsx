import React, { useState, useEffect } from 'react';
import { BarberStatus } from '../../types';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    Autocomplete,
    Grid,
    Badge,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    Star as StarIcon,
    Verified as VerifiedIcon,
    Pending as PendingIcon,
    Block as BlockIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useBarberStore } from '../../stores/barberStore';
import { useSalonStore } from '../../stores/salonStore';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const MotionCard = motion(Card);

interface AddStaffFormData {
    name: string;
    email: string;
    phone: string;
    salonId: string;
    specialties: string[];
    experience: number;
}

const StaffManagement: React.FC = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [filterTab, setFilterTab] = useState(0); // 0: All, 1: Pending, 2: Approved
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useToast();

    const { mySalons: salons, fetchMySalons } = useSalonStore();
    const {
        barbers: salonBarbers,
        fetchSalonBarbers,
        approveBarber,
        rejectBarber,
        registerBarber
    } = useBarberStore();

    const [formData, setFormData] = useState<AddStaffFormData>({
        name: '',
        email: '',
        phone: '',
        salonId: '',
        specialties: [],
        experience: 0
    });

    const specializationOptions = [
        'Hair Cutting',
        'Hair Styling',
        'Hair Coloring',
        'Beard Trimming',
        'Shaving',
        'Facial',
        'Hair Treatment',
        'Massage'
    ];

    useEffect(() => {
        fetchMySalons();
    }, [fetchMySalons]);

    useEffect(() => {
        if (salons.length > 0 && !formData.salonId) {
            setFormData(prev => ({ ...prev, salonId: salons[0]._id }));
            fetchSalonBarbers(salons[0]._id);
        }
    }, [salons, formData.salonId, fetchSalonBarbers]);

    const handleAddStaff = async () => {
        setLoading(true);

        try {
            // Use new endpoint that creates/finds user and registers barber
            const api = (await import('../../services/api')).default;

            await api.post(`/salons/${formData.salonId}/staff`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                displayName: formData.name, // Use same name as display name
                specializations: formData.specialties,
                experience: formData.experience
            });

            toast.success('Staff member added successfully!');
            setOpenAddDialog(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                salonId: salons[0]?._id || '',
                specialties: [],
                experience: 0
            });

            // Refresh staff list
            if (formData.salonId) {
                fetchSalonBarbers(formData.salonId);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to add staff member';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (barberId: string) => {
        try {
            await approveBarber(barberId);
            toast.success('Staff member approved successfully!');
            if (formData.salonId) {
                fetchSalonBarbers(formData.salonId);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to approve staff member');
        }
    };

    const handleReject = async (barberId: string) => {
        try {
            await rejectBarber(barberId, 'Rejected by salon owner');
            toast.success('Staff member rejected');
            if (formData.salonId) {
                fetchSalonBarbers(formData.salonId);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reject staff member');
        }
    };

    const filteredStaff = salonBarbers.filter(barber => {
        const matchesFilter =
            filterTab === 0 ? true :
                filterTab === 1 ? barber.status === BarberStatus.PENDING :
                    filterTab === 2 ? barber.status === BarberStatus.APPROVED : true;

        const barberName = (barber.userId as any)?.name || '';
        const matchesSearch = searchTerm.trim() === '' || barberName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const pendingCount = salonBarbers.filter(b => b.status === BarberStatus.PENDING).length;
    const activeCount = salonBarbers.filter(b => b.status === BarberStatus.APPROVED).length;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Header Section */}
            <Box sx={{
                bgcolor: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                pt: 4,
                pb: 6,
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                color: 'white'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1, fontWeight: 600 }}>
                                TEAM
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: 'white' }}>
                                Staff Management
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAddDialog(true)}
                            size="large"
                            sx={{
                                bgcolor: 'white',
                                color: '#1e293b',
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 4,
                                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.92)', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }
                            }}
                        >
                            Add New Staff
                        </Button>
                    </Box>

                    {/* Stats Cards */}
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                        <PeopleIcon sx={{ color: 'white' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={700}>
                                            <CountUp end={salonBarbers.length} duration={2} />
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Total Team Size</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, bgcolor: 'rgba(74, 222, 128, 0.2)', borderRadius: '12px' }}>
                                        <VerifiedIcon sx={{ color: '#4ade80' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={700}>
                                            <CountUp end={activeCount} duration={2} />
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Active Barbers</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, bgcolor: 'rgba(251, 146, 60, 0.2)', borderRadius: '12px' }}>
                                        <PendingIcon sx={{ color: '#fb923c' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={700}>
                                            <CountUp end={pendingCount} duration={2} />
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Pending Requests</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {/* Filters and Search */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Tabs
                        value={filterTab}
                        onChange={(e, val) => setFilterTab(val)}
                        sx={{
                            '& .MuiTabs-indicator': { bgcolor: '#1e293b', height: 3, borderRadius: '3px 3px 0 0' },
                            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '1rem', color: '#64748b', '&.Mui-selected': { color: '#1e293b' } }
                        }}
                    >
                        <Tab label="All Staff" />
                        <Tab label={
                            <Badge badgeContent={pendingCount} color="warning" sx={{ '& .MuiBadge-badge': { right: -12, top: 2 } }}>
                                Pending
                            </Badge>
                        } />
                        <Tab label="Approved" />
                    </Tabs>

                    <TextField
                        size="small"
                        placeholder="Search staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            bgcolor: 'white',
                            borderRadius: '12px',
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                            minWidth: 250
                        }}
                    />
                </Box>

                {/* Staff Grid */}
                <Grid container spacing={3}>
                    {filteredStaff.length === 0 ? (
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: '24px' }}>
                                <PeopleIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                                <Typography color="text.secondary">No staff members found based on your filters.</Typography>
                            </Box>
                        </Grid>
                    ) : (
                        filteredStaff.map((barber) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={barber._id}>
                                <MotionCard
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                                    sx={{
                                        borderRadius: '24px',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        overflow: 'visible',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Box sx={{
                                        height: 100,
                                        background: barber.status === BarberStatus.APPROVED
                                            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                                            : barber.status === BarberStatus.PENDING
                                                ? 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)'
                                                : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                        borderRadius: '24px 24px 0 0',
                                        position: 'relative'
                                    }}>
                                        <Chip
                                            label={barber.status}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                right: 16,
                                                bgcolor: 'white',
                                                fontWeight: 700,
                                                color: barber.status === BarberStatus.APPROVED ? '#16a34a' : barber.status === BarberStatus.PENDING ? '#ea580c' : '#64748b',
                                                textTransform: 'uppercase',
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ pt: 0, mt: -6, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Avatar sx={{
                                            width: 96,
                                            height: 96,
                                            bgcolor: '#1e293b',
                                            color: 'white',
                                            fontSize: '2rem',
                                            fontWeight: 700,
                                            border: '4px solid white',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            mb: 2
                                        }}>
                                            {(barber as any)?.displayName?.charAt(0) || 'B'}
                                        </Avatar>

                                        <Typography variant="h6" fontWeight={700} align="center">
                                            {(barber as any)?.displayName || 'Staff Member'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mb: 1 }}>
                                            {salons.find(s => s._id === barber.salonId)?.displayName || salons.find(s => s._id === barber.salonId)?.businessName || 'Salon'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {barber.experience} years experience
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', my: 2 }}>
                                            {barber.specialties?.slice(0, 3).map((spec, i) => (
                                                <Chip key={i} label={spec} size="small" variant="outlined" sx={{ fontSize: '0.65rem', borderRadius: '6px' }} />
                                            ))}
                                            {barber.specialties?.length > 3 && (
                                                <Chip label={`+${barber.specialties.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', borderRadius: '6px' }} />
                                            )}
                                        </Box>

                                        <Box sx={{ width: '100%', mt: 'auto', pt: 2, display: 'flex', gap: 1 }}>
                                            {barber.status === BarberStatus.PENDING ? (
                                                <>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() => handleApprove(barber._id)}
                                                        sx={{ borderRadius: '12px', textTransform: 'none' }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleReject(barber._id)}
                                                        sx={{ borderRadius: '12px', textTransform: 'none' }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="inherit"
                                                    sx={{ borderRadius: '12px', textTransform: 'none', borderColor: '#e2e8f0' }}
                                                >
                                                    View Details
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>

            {/* Add Staff Dialog */}
            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '24px', overflow: 'hidden' }
                }}
            >
                <DialogTitle sx={{ bgcolor: '#f8fafc', fontWeight: 700, py: 3 }}>
                    Add New Staff Member
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
                        <TextField
                            label="Full Name"
                            required
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            InputProps={{ sx: { borderRadius: '12px' } }}
                        />
                        <TextField
                            label="Email"
                            required
                            fullWidth
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            InputProps={{ sx: { borderRadius: '12px' } }}
                        />
                        <TextField
                            label="Phone"
                            required
                            fullWidth
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            InputProps={{ sx: { borderRadius: '12px' } }}
                        />
                        <TextField
                            select
                            label="Assign to Salon"
                            required
                            fullWidth
                            value={formData.salonId}
                            onChange={(e) => setFormData({ ...formData, salonId: e.target.value })}
                            InputProps={{ sx: { borderRadius: '12px' } }}
                        >
                            {salons.map((salon: any) => (
                                <MenuItem key={salon._id} value={salon._id}>
                                    {salon.displayName || salon.businessName}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Autocomplete
                            multiple
                            options={specializationOptions}
                            value={formData.specialties}
                            onChange={(e, newValue) => setFormData({ ...formData, specialties: newValue })}
                            renderInput={(params) => (
                                <TextField {...params} label="Specializations" placeholder="Select specializations" InputProps={{ ...params.InputProps, sx: { borderRadius: '12px' } }} />
                            )}
                        />
                        <TextField
                            label="Years of Experience"
                            type="number"
                            fullWidth
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                            InputProps={{ inputProps: { min: 0, max: 50 }, sx: { borderRadius: '12px' } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setOpenAddDialog(false)} sx={{ borderRadius: '12px', textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddStaff}
                        disabled={loading || !formData.name || !formData.email || !formData.phone || !formData.salonId}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 4, bgcolor: '#1e293b' }}
                    >
                        {loading ? 'Adding Staff...' : 'Add Staff'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StaffManagement;
