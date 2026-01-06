import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Switch,
    FormControlLabel,
    TextField,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Policy as PolicyIcon
} from '@mui/icons-material';
import { Salon } from '../../types';
import { salonService } from '../../services/salonService';
import { useToast } from '../../context/ToastContext';

interface SalonSettingsModalProps {
    open: boolean;
    onClose: () => void;
    salon: Salon;
    onUpdate: () => void;
}

const SalonSettingsModal: React.FC<SalonSettingsModalProps> = ({
    open,
    onClose,
    salon,
    onUpdate
}) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        isActive: salon.isActive,
        emailNotifications: salon.notificationPreferences?.emailNotifications ?? true,
        smsNotifications: salon.notificationPreferences?.smsNotifications ?? false,
        cancellationPolicy: salon.bookingPolicies?.cancellationPolicy || '',
        advanceBookingDays: salon.bookingPolicies?.advanceBookingDays || 30,
        minAdvanceBookingHours: salon.bookingPolicies?.minAdvanceBookingHours || 2
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await salonService.updateSalon(salon._id, {
                isActive: settings.isActive,
                notificationPreferences: {
                    emailNotifications: settings.emailNotifications,
                    smsNotifications: settings.smsNotifications
                },
                bookingPolicies: {
                    cancellationPolicy: settings.cancellationPolicy,
                    advanceBookingDays: settings.advanceBookingDays,
                    minAdvanceBookingHours: settings.minAdvanceBookingHours
                }
            });

            toast.success('Settings updated successfully');
            onUpdate();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '16px' }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Salon Settings
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Status Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                        Status
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.isActive}
                                onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
                                color="primary"
                            />
                        }
                        label={
                            <Box>
                                <Typography variant="body2" fontWeight={600}>
                                    Salon Active
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {settings.isActive
                                        ? 'Salon is visible and accepting bookings'
                                        : 'Salon is hidden from customers'}
                                </Typography>
                            </Box>
                        }
                    />
                    {!settings.isActive && (
                        <Alert severity="warning" sx={{ mt: 2, borderRadius: '8px' }}>
                            Deactivating will hide your salon from search and prevent new bookings
                        </Alert>
                    )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Notifications Section */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <NotificationsIcon fontSize="small" color="action" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Notification Preferences
                        </Typography>
                    </Box>
                    <Box sx={{ pl: 4 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.emailNotifications}
                                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                />
                            }
                            label="Email notifications for new bookings"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.smsNotifications}
                                    onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                                />
                            }
                            label="SMS notifications for new bookings"
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Booking Policies Section */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <PolicyIcon fontSize="small" color="action" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Booking Policies
                        </Typography>
                    </Box>
                    <Box sx={{ pl: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Cancellation Policy"
                            placeholder="e.g., Cancel up to 24 hours before appointment for full refund"
                            multiline
                            rows={2}
                            size="small"
                            fullWidth
                            value={settings.cancellationPolicy}
                            onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })}
                        />
                        <TextField
                            label="Advance Booking (Days)"
                            type="number"
                            size="small"
                            value={settings.advanceBookingDays}
                            onChange={(e) => setSettings({ ...settings, advanceBookingDays: parseInt(e.target.value) || 30 })}
                            InputProps={{ inputProps: { min: 1, max: 365 } }}
                            helperText="How many days in advance customers can book"
                        />
                        <TextField
                            label="Minimum Advance Booking (Hours)"
                            type="number"
                            size="small"
                            value={settings.minAdvanceBookingHours}
                            onChange={(e) => setSettings({ ...settings, minAdvanceBookingHours: parseInt(e.target.value) || 0 })}
                            InputProps={{ inputProps: { min: 0, max: 72 } }}
                            helperText="Minimum hours before appointment time"
                        />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    sx={{ color: 'text.secondary' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                    sx={{ borderRadius: '8px', px: 3 }}
                >
                    {loading ? 'Saving...' : 'Save Settings'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SalonSettingsModal;
