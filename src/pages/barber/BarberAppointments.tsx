import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    InputAdornment,
    TextField,
    useTheme,
    Divider
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    AccessTime as TimeIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);

// Mock Data
const MOCK_APPOINTMENTS = [
    {
        id: 1,
        client: 'Rahul Sharma',
        service: 'Haircut & Beard Trim',
        date: 'Today',
        time: '10:00 AM',
        duration: '45 mins',
        status: 'confirmed',
        price: '₹450',
        avatar: 'R',
        phone: '+91 98765 43210'
    },
    {
        id: 2,
        client: 'Amit Patel',
        service: 'Classic Shave',
        date: 'Today',
        time: '11:00 AM',
        duration: '30 mins',
        status: 'pending',
        price: '₹250',
        avatar: 'A',
        phone: '+91 98765 43211'
    },
    {
        id: 3,
        client: 'Vikram Singh',
        service: 'Hair Color',
        date: 'Today',
        time: '02:00 PM',
        duration: '60 mins',
        status: 'confirmed',
        price: '₹1200',
        avatar: 'V',
        phone: '+91 98765 43212'
    },
    {
        id: 4,
        client: 'Rohit Verma',
        service: 'Facial',
        date: 'Tomorrow',
        time: '04:00 PM',
        duration: '45 mins',
        status: 'confirmed',
        price: '₹800',
        avatar: 'R',
        phone: '+91 98765 43213'
    },
    {
        id: 5,
        client: 'Suresh Kumar',
        service: 'Haircut',
        date: 'Past',
        time: 'Yesterday',
        duration: '30 mins',
        status: 'completed',
        price: '₹300',
        avatar: 'S',
        phone: '+91 98765 43214'
    }
];

const BarberAppointments: React.FC = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const filteredAppointments = MOCK_APPOINTMENTS.filter(apt => {
        const matchesSearch = apt.client.toLowerCase().includes(searchQuery.toLowerCase());
        const isUpcoming = apt.date === 'Today' || apt.date === 'Tomorrow';
        const isHistory = apt.date === 'Past';

        if (tabValue === 0) return matchesSearch && isUpcoming;
        return matchesSearch && isHistory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return { bg: '#dcfce7', color: '#166534' };
            case 'pending': return { bg: '#fef3c7', color: '#b45309' };
            case 'completed': return { bg: '#f3f4f6', color: '#374151' };
            case 'cancelled': return { bg: '#fee2e2', color: '#991b1b' };
            default: return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Header */}
            <Box sx={{
                bgcolor: 'white',
                pt: 6,
                pb: 8,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: -100, right: -50, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1, fontWeight: 600 }}>
                                MANAGEMENT
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mt: 1 }}>
                                My Appointments
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<CalendarIcon />}
                            sx={{
                                bgcolor: 'white',
                                color: 'white',
                                borderRadius: '12px',
                                px: 3,
                                py: 1,
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                            }}
                        >
                            Sync Calendar
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
                <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    sx={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'visible' }}
                >
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', borderRadius: '24px 24px 0 0' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    sx={{
                                        '& .MuiTab-root': {
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            minHeight: 48,
                                            borderRadius: '12px',
                                            mr: 1
                                        },
                                        '& .Mui-selected': {
                                            bgcolor: '#f1f5f9',
                                            color: '#0f172a'
                                        },
                                        '& .MuiTabs-indicator': {
                                            display: 'none'
                                        }
                                    }}
                                >
                                    <Tab label="Upcoming" />
                                    <Tab label="History" />
                                </Tabs>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <TextField
                                        placeholder="Search client..."
                                        size="small"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                                            sx: { borderRadius: '12px', bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }
                                        }}
                                        sx={{ width: '100%', maxWidth: 300 }}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterIcon />}
                                        sx={{ borderRadius: '12px', borderColor: '#e2e8f0', color: '#64748b' }}
                                    >
                                        Filter
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <CardContent sx={{ p: 0, bgcolor: '#f8fafc' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
                            <AnimatePresence mode='wait'>
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((apt, index) => (
                                        <motion.div
                                            key={apt.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    borderRadius: '16px',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 10px 20px rgba(0,0,0,0.02)',
                                                        borderColor: '#6366f1'
                                                    }
                                                }}
                                            >
                                                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                                    {/* Time & Date */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: 100,
                                                        p: 2,
                                                        bgcolor: '#f8fafc',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e2e8f0'
                                                    }}>
                                                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                                            {apt.date}
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight={800} color="#0f172a">
                                                            {apt.time}
                                                        </Typography>
                                                    </Box>

                                                    {/* Client Info */}
                                                    <Box sx={{ flex: 1, minWidth: 200 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                            <Avatar sx={{ bgcolor: textToColor(apt.client), width: 40, height: 40, fontWeight: 700 }}>
                                                                {apt.avatar}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="h6" fontWeight={700} color="#0f172a">
                                                                    {apt.client}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <PhoneIcon sx={{ fontSize: 14 }} /> {apt.phone}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    {/* Service Info */}
                                                    <Box sx={{ flex: 1, minWidth: 200 }}>
                                                        <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                                                            Service Details
                                                        </Typography>
                                                        <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                                                            {apt.service}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f1f5f9', px: 1, py: 0.2, borderRadius: '4px', fontWeight: 600 }}>
                                                                <TimeIcon sx={{ fontSize: 14 }} /> {apt.duration}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f1f5f9', px: 1, py: 0.2, borderRadius: '4px', fontWeight: 600 }}>
                                                                {apt.price}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Status & Actions */}
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, minWidth: 150 }}>
                                                        <Chip
                                                            label={apt.status}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: getStatusColor(apt.status).bg,
                                                                color: getStatusColor(apt.status).color,
                                                                fontWeight: 700,
                                                                textTransform: 'capitalize',
                                                                height: 28
                                                            }}
                                                        />
                                                        {tabValue === 0 && (
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{ bgcolor: '#edf7ed', color: '#1b5e20', '&:hover': { bgcolor: '#dcfce7' } }}
                                                                >
                                                                    <CheckCircleIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{ bgcolor: '#fef2f2', color: '#b91c1c', '&:hover': { bgcolor: '#fee2e2' } }}
                                                                >
                                                                    <CancelIcon />
                                                                </IconButton>
                                                                <IconButton size="small">
                                                                    <MoreIcon />
                                                                </IconButton>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </motion.div>
                                    ))
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="h6" color="text.secondary">No appointments found</Typography>
                                        <Typography variant="body2" color="text.secondary">Try adjusting your search or filters</Typography>
                                    </Box>
                                )}
                            </AnimatePresence>
                        </Box>
                    </CardContent>
                </MotionCard>
            </Container>
        </Box>
    );
};

// Helper function to generate consistent consistent colors from strings
function textToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export default BarberAppointments;
