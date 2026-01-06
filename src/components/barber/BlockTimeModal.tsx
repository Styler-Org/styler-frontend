import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Block as BlockIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface BlockTimeModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const BLOCK_REASONS = [
    { value: 'lunch', label: 'Lunch Break' },
    { value: 'break', label: 'Personal Break' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'training', label: 'Training' },
    { value: 'personal', label: 'Personal Appointment' },
    { value: 'other', label: 'Other' }
];

const BlockTimeModal: React.FC<BlockTimeModalProps> = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        startTime: dayjs() as Dayjs | null,
        endTime: dayjs().add(1, 'hour') as Dayjs | null,
        reason: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate
            if (!formData.startTime || !formData.endTime || !formData.reason) {
                throw new Error('Please fill in all required fields');
            }

            if (formData.endTime.isBefore(formData.startTime)) {
                throw new Error('End time must be after start time');
            }

            // Mock API call - replace with actual API when available
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Time blocked:', {
                startTime: formData.startTime.format(),
                endTime: formData.endTime.format(),
                reason: formData.reason,
                notes: formData.notes
            });

            // Reset form
            setFormData({
                startTime: dayjs(),
                endTime: dayjs().add(1, 'hour'),
                reason: '',
                notes: ''
            });

            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to block time');
        } finally {
            setLoading(false);
        }
    };

    const duration = formData.startTime && formData.endTime
        ? formData.endTime.diff(formData.startTime, 'minute')
        : 0;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        <BlockIcon color="error" />
                        <Typography variant="h6" fontWeight={700}>
                            Block Time
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Block out time when you're unavailable for appointments
                    </Typography>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                                {error}
                            </Alert>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <DateTimePicker
                                label="Start Time"
                                value={formData.startTime}
                                onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        fullWidth: true
                                    }
                                }}
                            />

                            <DateTimePicker
                                label="End Time"
                                value={formData.endTime}
                                onChange={(newValue) => setFormData({ ...formData, endTime: newValue })}
                                minDateTime={formData.startTime || undefined}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        fullWidth: true
                                    }
                                }}
                            />

                            {duration > 0 && (
                                <Box sx={{
                                    p: 2,
                                    bgcolor: '#fef3c7',
                                    borderRadius: '12px',
                                    border: '1px solid #fde047'
                                }}>
                                    <Typography variant="body2" fontWeight={600} color="#92400e">
                                        ⏱️ Duration: {Math.floor(duration / 60)}h {duration % 60}m
                                    </Typography>
                                </Box>
                            )}

                            <TextField
                                select
                                label="Reason"
                                required
                                fullWidth
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            >
                                {BLOCK_REASONS.map((reason) => (
                                    <MenuItem key={reason.value} value={reason.value}>
                                        {reason.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Additional Notes (Optional)"
                                placeholder="Any additional details..."
                                multiline
                                rows={2}
                                fullWidth
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={onClose}
                            disabled={loading}
                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="error"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} /> : null}
                            sx={{ borderRadius: '8px', px: 3, fontWeight: 600 }}
                        >
                            {loading ? 'Blocking...' : 'Block Time'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </LocalizationProvider>
    );
};

export default BlockTimeModal;
