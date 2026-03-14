import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Alert,
    CircularProgress,
    Paper,
    Stepper,
    Step,
    StepLabel,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    MenuItem,
    Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Image as ImageIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useSalonStore } from '../../stores/salonStore';
import { salonService } from '../../services/salonService';
import LocationPicker from '../../components/LocationPicker';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface OperatingHours {
    day: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
}

interface ServiceFormData {
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    gender: 'male' | 'female' | 'unisex';
}

const CreateSalon: React.FC = () => {
    const navigate = useNavigate();
    const { registerSalon } = useSalonStore();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: ''
    });

    const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(
        daysOfWeek.map(day => ({
            day,
            openTime: '09:00',
            closeTime: '20:00',
            isOpen: day !== 'Sunday'
        }))
    );

    const [services, setServices] = useState<ServiceFormData[]>([]);
    const [currentService, setCurrentService] = useState<ServiceFormData>({
        name: '',
        description: '',
        category: 'Haircut',
        price: 0,
        duration: 30,
        gender: 'unisex'
    });

    const steps = ['Basic Information', 'Address & Location', 'Operating Hours', 'Services'];

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
        }));
        setError(null);
    };

    const handleOperatingHoursChange = (index: number, field: keyof OperatingHours, value: any) => {
        const updated = [...operatingHours];
        updated[index] = { ...updated[index], [field]: value };
        setOperatingHours(updated);
    };

    const handleServiceChange = (field: keyof ServiceFormData, value: any) => {
        setCurrentService(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleAddService = () => {
        if (!currentService.name.trim()) {
            setError('Service name is required');
            return;
        }
        if (currentService.price <= 0) {
            setError('Service price must be greater than 0');
            return;
        }
        if (currentService.duration < 15) {
            setError('Service duration must be at least 15 minutes');
            return;
        }

        setServices(prev => [...prev, currentService]);
        setCurrentService({
            name: '',
            description: '',
            category: 'Haircut',
            price: 0,
            duration: 30,
            gender: 'unisex'
        });
        setError(null);
    };

    const handleRemoveService = (index: number) => {
        setServices(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 0:
                if (!formData.name.trim()) {
                    setError('Salon name is required');
                    return false;
                }
                if (!formData.phone.trim() || formData.phone.length < 10) {
                    setError('Valid phone number is required');
                    return false;
                }
                if (uploadedImageUrls.length === 0 && selectedImages.length === 0) {
                    setError('At least 1 salon image is required');
                    return false;
                }
                return true;
            case 1:
                if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
                    setError('All address fields are required');
                    return false;
                }
                if (!formData.latitude || !formData.longitude) {
                    setError('Location coordinates are required');
                    return false;
                }
                return true;
            case 2:
                const hasOpenDay = operatingHours.some(h => h.isOpen);
                if (!hasOpenDay) {
                    setError('At least one day must be open');
                    return false;
                }
                return true;
            case 3:
                // Services step is optional
                return true;
            default:
                return true;
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalImages = selectedImages.length + uploadedImageUrls.length + files.length;

        if (totalImages > 3) {
            setError('Maximum 3 images allowed');
            return;
        }

        // Create preview URLs
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...files]);
        setImagesPreviews(prev => [...prev, ...newPreviews]);
        setError(null);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...selectedImages];
        const newPreviews = [...imagesPreviews];

        // Revoke object URL to prevent memory leak
        URL.revokeObjectURL(newPreviews[index]);

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setSelectedImages(newImages);
        setImagesPreviews(newPreviews);
        setError(null);
    };

    const handleRemoveUploadedImage = (index: number) => {
        const newUrls = [...uploadedImageUrls];
        newUrls.splice(index, 1);
        setUploadedImageUrls(newUrls);
    };

    const handleNext = async () => {
        if (!validateStep(activeStep)) return;

        // Upload images before moving to next step if on step 0
        if (activeStep === 0 && selectedImages.length > 0) {
            setUploadingImages(true);
            try {
                const response = await salonService.uploadSalonImages(selectedImages);
                setUploadedImageUrls(prev => [...prev, ...(response?.data?.images || [])]);
                // Clear selected images after upload
                selectedImages.forEach((_, index) => {
                    URL.revokeObjectURL(imagesPreviews[index]);
                });
                setSelectedImages([]);
                setImagesPreviews([]);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to upload images');
                setUploadingImages(false);
                return;
            } finally {
                setUploadingImages(false);
            }
        }

        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!validateStep(activeStep)) return;

        setLoading(true);
        setError(null);

        try {
            // Upload any remaining images
            let finalImageUrls = [...uploadedImageUrls];
            if (selectedImages.length > 0) {
                setUploadingImages(true);
                const response = await salonService.uploadSalonImages(selectedImages);
                finalImageUrls = [...finalImageUrls, ...(response?.data?.images || [])];
                setUploadingImages(false);
            }

            const payload = {
                businessName: formData.name,
                displayName: formData.name,
                description: formData.description,
                phone: formData.phone,
                email: formData.email || `${formData.phone}@styler.com`,
                images: finalImageUrls,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude)
                },
                operatingHours: operatingHours
                    .filter(h => h.isOpen)
                    .map(h => ({
                        day: h.day.toLowerCase(),
                        isOpen: h.isOpen,
                        slots: [{
                            start: h.openTime,
                            end: h.closeTime
                        }]
                    })),
                services: services.map(s => ({
                    name: s.name,
                    description: s.description,
                    category: s.category,
                    price: s.price,
                    duration: s.duration,
                    gender: s.gender,
                    isActive: true
                }))
            };

            await registerSalon(payload);

            // Cleanup preview URLs
            imagesPreviews.forEach(url => URL.revokeObjectURL(url));

            // Show success modal
            setShowSuccessModal(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create salon');
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Salon Name"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Describe your salon..."
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Phone Number"
                                fullWidth
                                required
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="10-digit number"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Email (Optional)"
                                fullWidth
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </Grid>

                        {/* Image Upload Section */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                                Salon Images * (Min 1, Max 3)
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                {/* Display uploaded images */}
                                {uploadedImageUrls.map((url, index) => (
                                    <Box
                                        key={`uploaded-${index}`}
                                        sx={{
                                            position: 'relative',
                                            width: 150,
                                            height: 150,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            border: '2px solid #e0e0e0'
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={`Salon ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveUploadedImage(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                                                width: 28,
                                                height: 28
                                            }}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Box>
                                ))}

                                {/* Display selected images (not yet uploaded) */}
                                {imagesPreviews.map((preview, index) => (
                                    <Box
                                        key={`preview-${index}`}
                                        sx={{
                                            position: 'relative',
                                            width: 150,
                                            height: 150,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            border: '2px dashed #6366f1'
                                        }}
                                    >
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveImage(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                                                width: 28,
                                                height: 28
                                            }}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Box>
                                ))}

                                {/* Add image button */}
                                {(uploadedImageUrls.length + selectedImages.length) < 3 && (
                                    <Box
                                        component="label"
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            border: '2px dashed #ccc',
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                borderColor: '#6366f1',
                                                bgcolor: 'rgba(99, 102, 241, 0.05)'
                                            },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageSelect}
                                            style={{ display: 'none' }}
                                        />
                                        <AddIcon sx={{ fontSize: 40, color: '#999' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                            Add Image
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                {uploadedImageUrls.length + selectedImages.length} of 3 images selected
                            </Typography>
                        </Grid>
                    </Grid>
                );

            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Street Address"
                                fullWidth
                                required
                                value={formData.street}
                                onChange={(e) => handleChange('street', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="City"
                                fullWidth
                                required
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="State"
                                fullWidth
                                required
                                value={formData.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Pincode"
                                fullWidth
                                required
                                value={formData.pincode}
                                onChange={(e) => handleChange('pincode', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                                Salon Location
                            </Typography>
                            <LocationPicker
                                latitude={formData.latitude ? parseFloat(formData.latitude) : undefined}
                                longitude={formData.longitude ? parseFloat(formData.longitude) : undefined}
                                onLocationSelect={handleLocationSelect}
                            />
                        </Grid>
                    </Grid>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                            Set your salon's operating hours
                        </Typography>
                        {operatingHours.map((hours, index) => (
                            <Paper key={hours.day} sx={{ p: 2, mb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, sm: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={hours.isOpen}
                                                onChange={(e) =>
                                                    handleOperatingHoursChange(index, 'isOpen', e.target.checked)
                                                }
                                                style={{ marginRight: 8 }}
                                            />
                                            <Typography fontWeight={hours.isOpen ? 600 : 400}>
                                                {hours.day}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    {hours.isOpen && (
                                        <>
                                            <Grid size={{ xs: 6, sm: 4 }}>
                                                <TextField
                                                    label="Opens"
                                                    type="time"
                                                    fullWidth
                                                    size="small"
                                                    value={hours.openTime}
                                                    onChange={(e) =>
                                                        handleOperatingHoursChange(index, 'openTime', e.target.value)
                                                    }
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 4 }}>
                                                <TextField
                                                    label="Closes"
                                                    type="time"
                                                    fullWidth
                                                    size="small"
                                                    value={hours.closeTime}
                                                    onChange={(e) =>
                                                        handleOperatingHoursChange(index, 'closeTime', e.target.value)
                                                    }
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    {!hours.isOpen && (
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Closed
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        ))}
                    </Box>
                );

            case 3:
                return (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                            Add services your salon offers (Optional)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            You can skip this step and add services later from your dashboard
                        </Typography>

                        {/* Current Service Form */}
                        <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8fafc' }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Service Name"
                                        fullWidth
                                        size="small"
                                        value={currentService.name}
                                        onChange={(e) => handleServiceChange('name', e.target.value)}
                                        placeholder="e.g., Haircut, Beard Trim"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        label="Category"
                                        fullWidth
                                        size="small"
                                        value={currentService.category}
                                        onChange={(e) => handleServiceChange('category', e.target.value)}
                                    >
                                        <MenuItem value="Salons">Salons</MenuItem>
                                        <MenuItem value="Dermatologists">Dermatologists</MenuItem>
                                        <MenuItem value="Wellness & Spa">Wellness & Spa</MenuItem>
                                        <MenuItem value="Nails & Lashes">Nails & Lashes</MenuItem>
                                        <MenuItem value="Haircut">Haircut</MenuItem>
                                        <MenuItem value="Shaving">Shaving</MenuItem>
                                        <MenuItem value="Beard">Beard</MenuItem>
                                        <MenuItem value="Facial">Facial</MenuItem>
                                        <MenuItem value="Massage">Massage</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        label="Gender"
                                        fullWidth
                                        size="small"
                                        value={currentService.gender}
                                        onChange={(e) => handleServiceChange('gender', e.target.value)}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="unisex">Unisex</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        size="small"
                                        multiline
                                        rows={2}
                                        value={currentService.description}
                                        onChange={(e) => handleServiceChange('description', e.target.value)}
                                        placeholder="Brief description of the service"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Price (₹)"
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={currentService.price}
                                        onChange={(e) => handleServiceChange('price', parseFloat(e.target.value) || 0)}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Duration (minutes)"
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={currentService.duration}
                                        onChange={(e) => handleServiceChange('duration', parseInt(e.target.value) || 30)}
                                        InputProps={{ inputProps: { min: 15, step: 15 } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleAddService}
                                        startIcon={<AddIcon />}
                                        fullWidth
                                        sx={{ borderRadius: '8px' }}
                                    >
                                        Add Service
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Added Services List */}
                        {services.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                                    Added Services ({services.length})
                                </Typography>
                                <Grid container spacing={2}>
                                    {services.map((service, index) => (
                                        <Grid size={{ xs: 12 }} key={index}>
                                            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                                                        <Typography variant="body1" fontWeight={600}>
                                                            {service.name}
                                                        </Typography>
                                                        <Chip label={service.gender} size="small" sx={{ textTransform: 'capitalize', fontSize: '0.7rem' }} />
                                                    </Box>
                                                    {service.description && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                            {service.description}
                                                        </Typography>
                                                    )}
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Typography variant="body2" color="primary" fontWeight={600}>
                                                            ₹{service.price}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {service.duration} mins
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton onClick={() => handleRemoveService(index)} color="error" size="small">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
                        Create New Salon
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ minHeight: 400 }}>
                        {renderStepContent(activeStep)}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            onClick={() => navigate('/salon-owner/dashboard')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {activeStep > 0 && (
                                <Button onClick={handleBack} disabled={loading}>
                                    Back
                                </Button>
                            )}
                            {activeStep < steps.length - 1 ? (
                                <Button variant="contained" onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : null}
                                >
                                    {loading ? 'Creating...' : 'Create Salon'}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Success Modal */}
            <Dialog
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        textAlign: 'center',
                        p: 2
                    }
                }}
            >
                <DialogContent sx={{ pt: 4 }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'success.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            animation: 'scaleIn 0.4s ease-out'
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 50, color: 'success.main' }} />
                    </Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                        🎉 Success!
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Salon Created Successfully
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                        Your salon has been registered. You can now manage it and add your team members.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
                    <Button
                        onClick={() => setShowSuccessModal(false)}
                        variant="outlined"
                        size="large"
                    >
                        Stay Here
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/salons-owner/my-salons')}
                        sx={{
                            minWidth: 160,
                            background: '#4338ca',
                            fontWeight: 600
                        }}
                    >
                        Go to My Salons
                    </Button>
                </DialogActions>
            </Dialog>

            <style>
                {`
                    @keyframes scaleIn {
                        0% {
                            transform: scale(0);
                        }
                        50% {
                            transform: scale(1.1);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                `}
            </style>
        </Container>
    );
};

export default CreateSalon;
