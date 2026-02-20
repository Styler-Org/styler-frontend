import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Typography, Chip, Box, Button, IconButton } from '@mui/material';
import { LocationOn as LocationIcon, Star as StarIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Salon } from '../../types';
import './SalonCard.css';

interface SalonCardProps {
    salon: Salon;
    onClick?: () => void;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon, onClick }) => {
    const isOpen = salon.isOpen !== undefined ? salon.isOpen : true;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    const images = salon.images && salon.images.length > 0 ? salon.images : [];
    const hasMultipleImages = images.length > 1;

    // Auto-carousel: cycle through images every 3 seconds
    useEffect(() => {
        if (!hasMultipleImages) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [hasMultipleImages, images.length]);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handleDotClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setCurrentImageIndex(index);
    };

    return (
        <Card
            className="salon-card"
            onClick={onClick}
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: onClick ? 'translateY(-4px)' : 'none',
                    boxShadow: onClick ? 8 : 2,
                },
            }}
        >
            {/* Image Carousel Container */}
            <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', bgcolor: '#f3f4f6' }}>
                {images.length > 0 && !imageError ? (
                    <>
                        {/* Images */}
                        <Box sx={{
                            display: 'flex',
                            transition: 'transform 0.5s ease-in-out',
                            transform: `translateX(-${currentImageIndex * 100}%)`,
                            height: '100%'
                        }}>
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    src={image}
                                    alt={`${salon.displayName || salon.businessName} - ${index + 1}`}
                                    onError={() => setImageError(true)}
                                    sx={{
                                        minWidth: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ))}
                        </Box>

                        {/* Navigation Arrows - Only show if multiple images */}
                        {hasMultipleImages && (
                            <>
                                <IconButton
                                    onClick={handlePrevImage}
                                    className="nav-arrow-btn"
                                    sx={{
                                        position: 'absolute',
                                        left: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 36,
                                        height: 36
                                    }}
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <IconButton
                                    onClick={handleNextImage}
                                    className="nav-arrow-btn"
                                    sx={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 36,
                                        height: 36
                                    }}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </>
                        )}

                        {/* Dots Indicator - Only show if multiple images */}
                        {hasMultipleImages && (
                            <Box sx={{
                                position: 'absolute',
                                bottom: 8,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: 0.75,
                                bgcolor: 'rgba(0,0,0,0.3)',
                                borderRadius: '12px',
                                px: 1,
                                py: 0.5
                            }}>
                                {images.map((_, index) => (
                                    <Box
                                        key={index}
                                        onClick={(e) => handleDotClick(e, index)}
                                        className={index === currentImageIndex ? 'nav-dot active' : 'nav-dot'}
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            '&:hover': { bgcolor: 'white' }
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </>
                ) : (
                    /* Placeholder for no images or image error */
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: 700
                    }}>
                        {(salon.displayName || salon.businessName || 'S')[0].toUpperCase()}
                    </Box>
                )}

                {/* Status Badge - Top Right Corner */}
                <Chip
                    label={isOpen ? 'Open' : 'Closed'}
                    size="small"
                    color={isOpen ? 'success' : 'default'}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 600,
                        zIndex: 2
                    }}
                />
            </Box>

            <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography className="salon-card-title" component="h3" gutterBottom>
                    {salon.displayName}
                </Typography>

                <Box className="salon-info-item" sx={{ mb: 1 }}>
                    <LocationIcon fontSize="small" />
                    <Typography variant="body2" sx={{ color: 'inherit' }}>
                        {salon.address?.city}{salon.address?.state ? `, ${salon.address.state}` : ''}
                    </Typography>
                </Box>

                <Box className="salon-reviews" sx={{ mb: 1.5 }}>
                    <StarIcon fontSize="medium" sx={{ color: '#f59e0b' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                        {typeof salon.rating === 'object' && salon.rating.average
                            ? `${salon.rating.average.toFixed(1)} `
                            : typeof salon.rating === 'number' && salon.rating > 0
                                ? `${salon.rating.toFixed(1)} `
                                : 'New'}
                    </Typography>
                    <Typography className="review-count">
                        ({typeof salon.rating === 'object' && salon.rating.count ? salon.rating.count : salon.totalReviews || 0} reviews)
                    </Typography>
                </Box>

                {salon.description && (
                    <Typography className="salon-description" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {salon.description}
                    </Typography>
                )}

                {salon.specialties && salon.specialties.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                        {salon.specialties.slice(0, 3).map((specialty, index) => (
                            <Chip key={index} label={specialty} size="small" variant="outlined" />
                        ))}
                    </Box>
                )}
            </CardContent>

            <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    className="book-now-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                    disabled={!isOpen}
                    sx={{
                        py: 1.5,
                        '&:disabled': {
                            background: '#e2e8f0',
                            color: '#94a3b8',
                            boxShadow: 'none'
                        }
                    }}
                >
                    Book Now
                </Button>
            </CardActions>
        </Card>
    );
};

export default SalonCard;
