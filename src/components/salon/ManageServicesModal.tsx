import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Paper,
    InputAdornment,
    CircularProgress,
    Divider,
    DialogContentText
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ContentCut as ServiceIcon,
    Save as SaveIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { Service, ServiceGender } from '../../types';
import { salonService } from '../../services/salonService';
import { useToast } from '../../context/ToastContext';

interface ManageServicesModalProps {
    open: boolean;
    onClose: () => void;
    salonId: string;
    services: Service[];
    onUpdate: () => void;
}

interface ServiceFormData {
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    gender: ServiceGender;
    isActive: boolean;
}

const categories = [
    'Haircut',
    'Shaving',
    'Beard',
    'Facial',
    'Hair Color',
    'Hair Treatment',
    'Massage',
    'Other'
];

const ManageServicesModal: React.FC<ManageServicesModalProps> = ({
    open,
    onClose,
    salonId,
    services,
    onUpdate
}) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<{ id: string; name: string } | null>(null);
    const [formData, setFormData] = useState<ServiceFormData>({
        name: '',
        description: '',
        category: 'Haircut',
        price: 0,
        duration: 30,
        gender: ServiceGender.UNISEX,
        isActive: true
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: 'Haircut',
            price: 0,
            duration: 30,
            gender: ServiceGender.UNISEX,
            isActive: true
        });
        setEditingServiceId(null);
        setShowAddForm(false);
    };

    const handleEdit = (service: Service) => {
        setFormData({
            name: service.name,
            description: service.description,
            category: (service as any).category || 'Haircut',
            price: service.price,
            duration: service.duration,
            gender: service.gender || ServiceGender.UNISEX,
            isActive: (service as any).isActive ?? true
        });
        setEditingServiceId(service._id);
        setShowAddForm(true);
    };

    const handleDeleteClick = (serviceId: string, serviceName: string) => {
        setServiceToDelete({ id: serviceId, name: serviceName });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!serviceToDelete) return;

        setLoading(true);
        try {
            await salonService.removeService(salonId, serviceToDelete.id);
            toast.success('Service deleted successfully');
            setDeleteDialogOpen(false);
            setServiceToDelete(null);
            onUpdate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete service');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.description || formData.price <= 0 || formData.duration <= 0) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            if (editingServiceId) {
                // Update existing service
                await salonService.updateService(salonId, editingServiceId, formData);
                toast.success('Service updated successfully');
            } else {
                // Add new service
                await salonService.addService(salonId, formData);
                toast.success('Service added successfully');
            }
            resetForm();
            onUpdate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '16px', maxHeight: '90vh' }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ServiceIcon color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                            Manage Services
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Add/Edit Service Form */}
                {showAddForm && (
                    <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                            {editingServiceId ? 'Edit Service' : 'Add New Service'}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Service Name"
                                size="small"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <TextField
                                label="Description"
                                size="small"
                                fullWidth
                                required
                                multiline
                                rows={2}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={formData.category}
                                        label="Category"
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        value={formData.gender}
                                        label="Gender"
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as ServiceGender })}
                                    >
                                        <MenuItem value={ServiceGender.MALE}>Male</MenuItem>
                                        <MenuItem value={ServiceGender.FEMALE}>Female</MenuItem>
                                        <MenuItem value={ServiceGender.UNISEX}>Unisex</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Price"
                                    size="small"
                                    type="number"
                                    required
                                    fullWidth
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                        inputProps: { min: 1 }
                                    }}
                                />
                                <TextField
                                    label="Duration (minutes)"
                                    size="small"
                                    type="number"
                                    required
                                    fullWidth
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                                    InputProps={{
                                        inputProps: { min: 15, step: 15 }
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button
                                    onClick={resetForm}
                                    disabled={loading}
                                    size="small"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                                    size="small"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    {loading ? 'Saving...' : (editingServiceId ? 'Update' : 'Add Service')}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                )}

                {/* Add Service Button */}
                {!showAddForm && (
                    <Box sx={{ mb: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setShowAddForm(true)}
                            fullWidth
                            sx={{ borderRadius: '8px', py: 1.5, borderStyle: 'dashed' }}
                        >
                            Add New Service
                        </Button>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Services List */}
                {services.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <ServiceIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                        <Typography color="text.secondary">No services added yet</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Click "Add New Service" to get started
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.map((service) => (
                                    <TableRow key={service._id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{service.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {service.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={(service as any).category || 'Other'}
                                                size="small"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600} color="primary">
                                                ₹{service.price}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{service.duration} mins</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={(service as any).gender || 'unisex'}
                                                size="small"
                                                sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(service)}
                                                disabled={loading}
                                                sx={{ color: '#3b82f6' }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClick(service._id, service.name)}
                                                disabled={loading}
                                                sx={{ color: '#ef4444' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ borderRadius: '8px', px: 3 }}
                >
                    Close
                </Button>
            </DialogActions>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: { borderRadius: '16px' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Delete Service?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{serviceToDelete?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{ borderRadius: '8px' }}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default ManageServicesModal;
