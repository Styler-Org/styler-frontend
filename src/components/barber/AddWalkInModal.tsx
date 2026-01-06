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
    PersonAdd as PersonAddIcon,
    Phone as PhoneIcon,
    ContentCut as ServiceIcon
} from '@mui/icons-material';

interface AddWalkInModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

// Mock services data
const MOCK_SERVICES = [
    { id: '1', name: 'Haircut & Beard Trim', duration: 45, price: 450 },
    { id: '2', name: 'Classic Shave', duration: 30, price: 250 },
    { id: '3', name: 'Hair Color', duration: 60, price: 1200 },
    { id: '4', name: 'Facial', duration: 45, price: 800 },
    { id: '5', name: 'Haircut', duration: 30, price: 300 }
];

const AddWalkInModal: React.FC<AddWalkInModalProps> = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        serviceId: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate
            if (!formData.clientName || !formData.clientPhone || !formData.serviceId) {
                throw new Error('Please fill in all required fields');
            }

            // Mock API call - replace with actual API when available
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Walk-in appointment created:', formData);

            // Reset form
            setFormData({
                clientName: '',
                clientPhone: '',
                serviceId: '',
                notes: ''
            });

            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create walk-in appointment');
        } finally {
            setLoading(false);
        }
    };

    const selectedService = MOCK_SERVICES.find(s => s.id === formData.serviceId);

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
                    <PersonAddIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Add Walk-in Client
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Quickly add a walk-in appointment to your schedule
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
                        <TextField
                            label="Client Name"
                            placeholder="Enter client name"
                            required
                            fullWidth
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            InputProps={{
                                startAdornment: <PersonAddIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />

                        <TextField
                            label="Phone Number"
                            placeholder="+91 98765 43210"
                            required
                            fullWidth
                            value={formData.clientPhone}
                            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                            InputProps={{
                                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />

                        <TextField
                            select
                            label="Service"
                            required
                            fullWidth
                            value={formData.serviceId}
                            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                            InputProps={{
                                startAdornment: <ServiceIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        >
                            {MOCK_SERVICES.map((service) => (
                                <MenuItem key={service.id} value={service.id}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography>{service.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {service.duration} mins • ₹{service.price}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>

                        {selectedService && (
                            <Box sx={{
                                p: 2,
                                bgcolor: '#f1f5f9',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    SERVICE SUMMARY
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body2">Duration:</Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {selectedService.duration} minutes
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                    <Typography variant="body2">Price:</Typography>
                                    <Typography variant="body2" fontWeight={700} color="primary.main">
                                        ₹{selectedService.price}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <TextField
                            label="Notes (Optional)"
                            placeholder="Any special requests or notes..."
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
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : null}
                        sx={{ borderRadius: '8px', px: 3, fontWeight: 600 }}
                    >
                        {loading ? 'Adding...' : 'Add Walk-in'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddWalkInModal;
