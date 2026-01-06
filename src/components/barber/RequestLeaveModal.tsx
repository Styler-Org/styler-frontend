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
    EventBusy as LeaveIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface RequestLeaveModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const LEAVE_TYPES = [
    { value: 'sick', label: 'Sick Leave' },
    { value: 'vacation', label: 'Vacation' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'other', label: 'Other' }
];

const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        startDate: dayjs() as Dayjs | null,
        endDate: dayjs() as Dayjs | null,
        leaveType: '',
        reason: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate
            if (!formData.startDate || !formData.endDate || !formData.leaveType || !formData.reason) {
                throw new Error('Please fill in all required fields');
            }

            if (formData.endDate.isBefore(formData.startDate)) {
                throw new Error('End date must be after start date');
            }

            // Mock API call - replace with actual API when available
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Leave request submitted:', {
                startDate: formData.startDate.format('YYYY-MM-DD'),
                endDate: formData.endDate.format('YYYY-MM-DD'),
                leaveType: formData.leaveType,
                reason: formData.reason
            });

            // Reset form
            setFormData({
                startDate: dayjs(),
                endDate: dayjs(),
                leaveType: '',
                reason: ''
            });

            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit leave request');
        } finally {
            setLoading(false);
        }
    };

    const days = formData.startDate && formData.endDate
        ? formData.endDate.diff(formData.startDate, 'day') + 1
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
                        <LeaveIcon sx={{ color: '#ef4444' }} />
                        <Typography variant="h6" fontWeight={700}>
                            Request Leave
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Submit a leave request for salon owner approval
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
                            <DatePicker
                                label="Start Date"
                                value={formData.startDate}
                                onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
                                minDate={dayjs()}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        fullWidth: true
                                    }
                                }}
                            />

                            <DatePicker
                                label="End Date"
                                value={formData.endDate}
                                onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
                                minDate={formData.startDate || dayjs()}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        fullWidth: true
                                    }
                                }}
                            />

                            {days > 0 && (
                                <Box sx={{
                                    p: 2,
                                    bgcolor: '#eff6ff',
                                    borderRadius: '12px',
                                    border: '1px solid #bfdbfe'
                                }}>
                                    <Typography variant="body2" fontWeight={600} color="#1e40af">
                                        📅 Duration: {days} {days === 1 ? 'day' : 'days'}
                                    </Typography>
                                </Box>
                            )}

                            <TextField
                                select
                                label="Leave Type"
                                required
                                fullWidth
                                value={formData.leaveType}
                                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                            >
                                {LEAVE_TYPES.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Reason"
                                placeholder="Please provide a reason for your leave request..."
                                required
                                multiline
                                rows={3}
                                fullWidth
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />

                            <Alert severity="info" sx={{ borderRadius: '8px' }}>
                                Your leave request will be sent to the salon owner for approval.
                                You'll be notified once it's reviewed.
                            </Alert>
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
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} /> : null}
                            sx={{ borderRadius: '8px', px: 3, fontWeight: 600 }}
                        >
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </LocalizationProvider>
    );
};

export default RequestLeaveModal;
