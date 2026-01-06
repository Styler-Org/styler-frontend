import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    Switch,
    FormControlLabel,
    Divider,
    useTheme,
    Tooltip
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    AccessTime as TimeIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Edit as EditIcon,
    EventAvailable as AvailableIcon,
    EventBusy as BusyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
];

const BarberSchedule: React.FC = () => {
    const theme = useTheme();
    const [selectedDay, setSelectedDay] = useState('Monday');
    // Mock state for availability - in a real app this would come from an API
    const [schedule, setSchedule] = useState<Record<string, { enabled: boolean; slots: string[] }>>({
        'Monday': { enabled: true, slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
        'Tuesday': { enabled: true, slots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
        'Wednesday': { enabled: true, slots: TIME_SLOTS },
        'Thursday': { enabled: true, slots: ['10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM'] },
        'Friday': { enabled: true, slots: TIME_SLOTS },
        'Saturday': { enabled: true, slots: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'] },
        'Sunday': { enabled: false, slots: [] },
    });

    const handleDayToggle = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], enabled: !prev[day].enabled }
        }));
    };

    const handleSlotToggle = (day: string, slot: string) => {
        setSchedule(prev => {
            const currentSlots = prev[day].slots;
            const newSlots = currentSlots.includes(slot)
                ? currentSlots.filter(s => s !== slot)
                : [...currentSlots, slot];
            return {
                ...prev,
                [day]: { ...prev[day], slots: newSlots }
            };
        });
    };

    const currentDaySchedule = schedule[selectedDay];

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
                <Box sx={{ position: 'absolute', top: -50, left: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1, fontWeight: 600 }}>
                                MANAGEMENT
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mt: 1 }}>
                                My Schedule
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{
                                bgcolor: '#4ade80',
                                color: 'white',
                                borderRadius: '12px',
                                px: 3,
                                py: 1,
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#22c55e' }
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
                <Grid container spacing={4}>
                    {/* Weekly Overview */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MotionCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            sx={{ borderRadius: '24px', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                        >
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="h6" fontWeight={700} color="#1e293b">Weekly Overview</Typography>
                                    <Typography variant="body2" color="text.secondary">Select a day to edit availability</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {DAYS.map((day) => (
                                        <Box
                                            key={day}
                                            onClick={() => setSelectedDay(day)}
                                            sx={{
                                                p: 2.5,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                bgcolor: selectedDay === day ? '#eff6ff' : 'transparent',
                                                borderLeft: selectedDay === day ? '4px solid #3b82f6' : '4px solid transparent',
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: selectedDay === day ? '#eff6ff' : '#f8fafc' }
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700} color={selectedDay === day ? '#1e40af' : '#334155'}>
                                                    {day}
                                                </Typography>
                                                <Typography variant="caption" color={schedule[day].enabled ? '#166534' : '#991b1b'} fontWeight={600}>
                                                    {schedule[day].enabled ? `${schedule[day].slots.length} slots active` : 'Off Duty'}
                                                </Typography>
                                            </Box>
                                            {schedule[day].enabled ? (
                                                <AvailableIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                                            ) : (
                                                <BusyIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </MotionCard>
                    </Grid>

                    {/* Day Details */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <MotionCard
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={selectedDay} // Animate when day changes
                            sx={{ borderRadius: '24px', minHeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight={800} color="#1e293b">{selectedDay}</Typography>
                                        <Typography variant="body2" color="text.secondary">Configure your working hours</Typography>
                                    </Box>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={currentDaySchedule.enabled}
                                                onChange={() => handleDayToggle(selectedDay)}
                                                color="success"
                                            />
                                        }
                                        label={currentDaySchedule.enabled ? "Available" : "Unavailable"}
                                        sx={{
                                            '& .MuiTypography-root': { fontWeight: 600, color: currentDaySchedule.enabled ? '#166534' : '#991b1b' }
                                        }}
                                    />
                                </Box>

                                <Divider sx={{ mb: 4 }} />

                                {currentDaySchedule.enabled ? (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                            <TimeIcon color="action" />
                                            <Typography variant="h6" fontWeight={700} color="#334155">Time Slots</Typography>
                                        </Box>
                                        <Grid container spacing={2}>
                                            {TIME_SLOTS.map((slot) => {
                                                const isActive = currentDaySchedule.slots.includes(slot);
                                                return (
                                                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={slot}>
                                                        <Box
                                                            onClick={() => handleSlotToggle(selectedDay, slot)}
                                                            sx={{
                                                                p: 2,
                                                                borderRadius: '12px',
                                                                border: '1px solid',
                                                                borderColor: isActive ? '#3b82f6' : '#e2e8f0',
                                                                bgcolor: isActive ? '#eff6ff' : 'white',
                                                                color: isActive ? '#1e40af' : '#64748b',
                                                                cursor: 'pointer',
                                                                textAlign: 'center',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    borderColor: '#3b82f6',
                                                                    transform: 'translateY(-2px)'
                                                                }
                                                            }}
                                                        >
                                                            <Typography variant="body2" fontWeight={700}>
                                                                {slot}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                        <Box sx={{ mt: 4, p: 2, bgcolor: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                                            <Typography variant="subtitle2" color="#c2410c" fontWeight={700} gutterBottom>
                                                Quick Tip
                                            </Typography>
                                            <Typography variant="body2" color="#9a3412">
                                                Disabling a time slot only prevents NEW bookings. Existing appointments will remain scheduled.
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94a3b8' }}>
                                        <BusyIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                                        <Typography variant="h6" fontWeight={600}>You are off duty on {selectedDay}s</Typography>
                                        <Typography variant="body2">Toggle the switch above to enable bookings.</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </MotionCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default BarberSchedule;
