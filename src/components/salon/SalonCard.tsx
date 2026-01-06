import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Box, Button } from '@mui/material';
import { LocationOn as LocationIcon, Star as StarIcon } from '@mui/icons-material';
import { Salon } from '../../types';
import './SalonCard.css';

interface SalonCardProps {
    salon: Salon;
    onClick?: () => void;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon, onClick }) => {
    const isOpen = salon.isOpen !== undefined ? salon.isOpen : true;

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
                '&:hover': {
                    transform: onClick ? 'translateY(-4px)' : 'none',
                    boxShadow: onClick ? 8 : 2,
                },
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={salon.images && salon.images.length > 0 ? salon.images[0] : undefined}
                alt={salon.displayName || salon.businessName}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.placeholder-gradient')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'placeholder-gradient';
                        placeholder.style.cssText = `
                            width: 100%;
                            height: 200px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 3rem;
                            font-weight: 700;
                        `;
                        placeholder.textContent = (salon.displayName || salon.businessName || 'S')[0].toUpperCase();
                        parent.insertBefore(placeholder, target);
                    }
                }}
                sx={{
                    objectFit: 'cover',
                    display: salon.images && salon.images.length > 0 ? 'block' : 'none'
                }}
            />

            {/* Placeholder for no images */}
            {(!salon.images || salon.images.length === 0) && (
                <Box sx={{
                    width: '100%',
                    height: 200,
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
                    top: 16,
                    right: 16,
                    fontWeight: 600,
                    zIndex: 1
                }}
            />

            <CardContent sx={{ flex: 1 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 800, color: '#6366f1' }}>
                    {salon.displayName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {salon.address?.city}{salon.address?.state ? `, ${salon.address.state}` : ''}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <StarIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                    <Typography variant="body2">
                        {typeof salon.rating === 'object' && salon.rating.average
                            ? `${salon.rating.average.toFixed(1)} (${salon.rating.count || 0} reviews)`
                            : typeof salon.rating === 'number' && salon.rating > 0
                                ? `${salon.rating.toFixed(1)} (${salon.totalReviews || 0} reviews)`
                                : 'No rating'}
                    </Typography>
                </Box>

                {salon.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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

            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                    disabled={!isOpen}
                    sx={{
                        background: '#4338ca',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        },
                        '&:disabled': {
                            background: '#e5e7eb',
                            color: '#9ca3af',
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
