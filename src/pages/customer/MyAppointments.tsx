import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    CircularProgress,
    Tabs,
    Tab,
    Button,
    TextField,
    InputAdornment,
    Divider,
    Avatar,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    AccessTime as TimeIcon,
    LocationOn as LocationIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    MoreVert as MoreVertIcon,
    Close as CloseIcon,
    EventRepeat as RescheduleIcon,
    ArrowForward as ArrowForwardIcon,
    ContentCut as ServiceIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus, PaginatedResponse } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import './MyAppointments.css';

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
            id={`appointment-tabpanel-${index}`}
            aria-labelledby={`appointment-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const MyAppointments: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    // Fetch all appointments
    const { data, isLoading } = useQuery({
        queryKey: ['my-appointments'],
        queryFn: () => appointmentService.getMyAppointments({ limit: 100 }), // Fetch more to filter locally
    });

    // Backend returns { success, data: Appointment[], meta }, not nested in PaginatedResponse
    const allAppointments = (data?.data as Appointment[]) || [];

    // Filter and sort appointments
    const { upcoming, past, cancelled } = useMemo(() => {
        const now = dayjs();
        const filtered = allAppointments.filter(app => {
            // If no search query, include all appointments
            if (!searchQuery.trim()) return true;

            // Handle both populated and non-populated salonId/serviceIds
            const salonName = typeof app.salonId === 'string' ? '' : (app.salonId as any)?.name || '';
            const serviceMatch = Array.isArray(app.serviceIds)
                ? app.serviceIds.some(s => typeof s === 'object' && (s as any).name?.toLowerCase().includes(searchQuery.toLowerCase()))
                : false;

            return salonName.toLowerCase().includes(searchQuery.toLowerCase()) || serviceMatch;
        });

        const upcomingApps: Appointment[] = [];
        const pastApps: Appointment[] = [];
        const cancelledApps: Appointment[] = [];

        filtered.forEach(app => {
            if (app.status === 'cancelled' || app.status === 'no_show') {
                cancelledApps.push(app);
            } else if (app.status === 'completed') {
                pastApps.push(app);
            } else {
                // Pending, Confirmed, In Progress
                const appDate = dayjs(app.scheduledAt); // Use scheduledAt from API
                if (appDate.isAfter(now.subtract(1, 'day'))) { // Allow "today" to be upcoming
                    upcomingApps.push(app);
                } else {
                    pastApps.push(app);
                }
            }
        });

        // Sort upcoming by soonest first
        upcomingApps.sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf());
        // Sort others by newest first
        pastApps.sort((a, b) => dayjs(b.scheduledAt).valueOf() - dayjs(a.scheduledAt).valueOf());
        cancelledApps.sort((a, b) => dayjs(b.scheduledAt).valueOf() - dayjs(a.scheduledAt).valueOf());

        return { upcoming: upcomingApps, past: pastApps, cancelled: cancelledApps };
    }, [allAppointments, searchQuery]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedAppointmentId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAppointmentId(null);
    };

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case 'confirmed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'completed': return '#3b82f6';
            case 'cancelled': return '#ef4444';
            case 'in_progress': return '#8b5cf6';
            default: return '#6b7280';
        }
    };

    const renderAppointmentCard = (appointment: Appointment) => {
        const salonName = (appointment.salonId as any)?.name || 'Unknown Salon';
        const salonAddress = (appointment.salonId as any)?.address?.street || '';
        const barberName = (appointment.barberId as any)?.userId?.name || 'Any Stylist';
        const serviceNames = (appointment.serviceIds as any[])?.map(s => s.name).join(', ') || 'Service';
        const dateTimeObj = dayjs(appointment.scheduledAt); // Use scheduledAt from API
        const statusColor = getStatusColor(appointment.status);
        const totalAmount = (appointment as any).pricing?.total || 0; // Use pricing.total from API

        return (
            <Card
                key={appointment._id}
                sx={{
                    mb: 2,
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'visible',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                        borderColor: 'transparent'
                    }
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                        {/* Time Column (Left) */}
                        <Box sx={{
                            width: { xs: '100%', sm: 140 },
                            bgcolor: '#f8fafc',
                            p: 3,
                            display: 'flex',
                            flexDirection: { xs: 'row', sm: 'column' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: { xs: 2, sm: 1 },
                            borderRight: { xs: 'none', sm: '1px solid rgba(0,0,0,0.05)' },
                            borderBottom: { xs: '1px solid rgba(0,0,0,0.05)', sm: 'none' }
                        }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#334155' }}>
                                {dateTimeObj.format('DD')}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                                {dateTimeObj.format('MMM')}
                            </Typography>
                            <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />
                            <Chip
                                label={dateTimeObj.format('hh:mm A')}
                                size="small"
                                icon={<TimeIcon sx={{ fontSize: '14px !important' }} />}
                                sx={{
                                    bgcolor: 'white',
                                    fontWeight: 700,
                                    color: '#475569',
                                    border: '1px solid #e2e8f0'
                                }}
                            />
                        </Box>

                        {/* Details Column (Middle) */}
                        <Box sx={{ flex: 1, p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#1e293b' }}>
                                        {salonName}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                                        <LocationIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {salonAddress}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label={appointment.status.replace('_', ' ')}
                                    size="small"
                                    sx={{
                                        bgcolor: `${statusColor}15`,
                                        color: statusColor,
                                        fontWeight: 700,
                                        textTransform: 'capitalize',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Box>

                            <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: '#eff6ff',
                                                color: '#3b82f6',
                                                width: 40,
                                                height: 40
                                            }}
                                        >
                                            <ServiceIcon fontSize="small" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Service</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                {serviceNames}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Avatar
                                            src={(appointment.barberId as any)?.userId?.profilePicture}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Stylist</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                {barberName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Actions Col (Right) */}
                        <Box sx={{
                            width: { xs: '100%', sm: 180 },
                            p: 2,
                            display: 'flex',
                            flexDirection: { xs: 'row', sm: 'column' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            borderLeft: { xs: 'none', sm: '1px solid rgba(0,0,0,0.05)' },
                            borderTop: { xs: '1px solid rgba(0,0,0,0.05)', sm: 'none' },
                            bgcolor: { xs: 'white', sm: '#f8fafc' }
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366f1', mb: { xs: 0, sm: 2 } }}>
                                {formatCurrency(totalAmount)}
                            </Typography>
                            <Box sx={{ flexGrow: { xs: 1, sm: 0 }, display: { xs: 'block', sm: 'none' } }} />

                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                fullWidth={!isMobile}
                                onClick={() => navigate(`/appointments/${appointment._id}`)} // Updated route
                                sx={{
                                    bgcolor: 'white',
                                    color: 'white',
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    '&:hover': {
                                        bgcolor: '#f1f5f9',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }
                                }}
                            >
                                Details
                            </Button>

                            {/* Only show "More" menu for upcoming */}
                            {tabValue === 0 && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, appointment._id)}
                                    sx={{ display: { xs: 'block', sm: 'none' } }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', mb: 1 }}>
                            My Appointments
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage your upcoming visits and view history
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<CalendarIcon />}
                        onClick={() => navigate('/salons')}
                        sx={{
                            borderRadius: '50px',
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            bgcolor: '#6366f1',
                            boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)',
                            '&:hover': { bgcolor: '#4f46e5' }
                        }}
                    >
                        Book New
                    </Button>
                </Box>

                <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', mb: 4, overflow: 'visible' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 2, md: 4 }, pt: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2 }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant={isMobile ? "fullWidth" : "standard"}
                            sx={{
                                minHeight: 60,
                                flex: 1,
                                width: { xs: '100%', md: 'auto' },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    minHeight: 60,
                                    color: '#64748b',
                                    '&.Mui-selected': { color: '#6366f1' }
                                },
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    bgcolor: '#6366f1',
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            <Tab label={`Upcoming (${upcoming.length})`} />
                            <Tab label={`Past (${past.length})`} />
                            <Tab label={`Cancelled (${cancelled.length})`} />
                        </Tabs>

                        <TextField
                            placeholder="Search salon or service..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: { xs: '100%', md: 300 },
                                mb: { xs: 2, md: 0 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                    bgcolor: '#f8fafc',
                                    '& fieldset': { borderColor: '#e2e8f0' },
                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 400, bgcolor: 'white', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                <CircularProgress sx={{ color: '#6366f1' }} />
                            </Box>
                        ) : (
                            <>
                                <CustomPanel value={tabValue} index={0}>
                                    {upcoming.length > 0 ? (
                                        upcoming.map(renderAppointmentCard)
                                    ) : (
                                        <EmptyState type="upcoming" onBook={() => navigate('/salons')} />
                                    )}
                                </CustomPanel>
                                <CustomPanel value={tabValue} index={1}>
                                    {past.length > 0 ? (
                                        past.map(renderAppointmentCard)
                                    ) : (
                                        <EmptyState type="past" onBook={() => navigate('/salons')} />
                                    )}
                                </CustomPanel>
                                <CustomPanel value={tabValue} index={2}>
                                    {cancelled.length > 0 ? (
                                        cancelled.map(renderAppointmentCard)
                                    ) : (
                                        <EmptyState type="cancelled" onBook={() => navigate('/salons')} />
                                    )}
                                </CustomPanel>
                            </>
                        )}
                    </Box>
                </Card>
            </Container>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        minWidth: 160
                    }
                }}
            >
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, px: 2 }}>
                    <ListItemIcon><RescheduleIcon fontSize="small" /></ListItemIcon>
                    Reschedule
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, px: 2, color: '#ef4444' }}>
                    <ListItemIcon><CloseIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                    Cancel Booking
                </MenuItem>
            </Menu>
        </Box>
    );
};

const CustomPanel: React.FC<{ value: number; index: number; children: React.ReactNode }> = ({ value, index, children }) => {
    return (
        <div role="tabpanel" hidden={value !== index} style={{ width: '100%' }}>
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
};

const EmptyState: React.FC<{ type: string; onBook: () => void }> = ({ type, onBook }) => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
        <Avatar
            sx={{
                width: 80,
                height: 80,
                bgcolor: '#f1f5f9',
                color: '#94a3b8',
                mx: 'auto',
                mb: 3
            }}
        >
            <CalendarIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            No {type} appointments
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            {type === 'upcoming'
                ? "You don't have any upcoming appointments scheduled. Time to treat yourself?"
                : `You don't have any ${type} appointments in your history.`}
        </Typography>
        {type === 'upcoming' && (
            <Button
                variant="outlined"
                onClick={onBook}
                sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: '#6366f1',
                    color: '#6366f1'
                }}
            >
                Find a Salon
            </Button>
        )}
    </Box>
);

export default MyAppointments;
