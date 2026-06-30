import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, IconButton, alpha } from '@mui/material';
import {
    LocationOn as LocationIcon,
    Star as StarIcon,
    ChevronLeft,
    ChevronRight,
    ArrowForward as ArrowForwardIcon,
    FiberManualRecord as DotIcon,
    ContentCut as ScissorsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Salon } from '../../types';

interface SalonCardProps {
    salon: Salon;
    onClick?: () => void;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon, onClick }) => {
    const isOpen = salon.isOpen !== undefined ? salon.isOpen : true;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [hovered, setHovered] = useState(false);

    const images = salon.images?.length ? salon.images : [];
    const hasMultiple = images.length > 1;

    const avgRating = (() => {
        if (typeof salon.rating === 'object' && salon.rating?.average) return salon.rating.average;
        if (typeof salon.rating === 'number' && salon.rating > 0) return salon.rating;
        return null;
    })();

    const reviewCount = (() => {
        if (typeof salon.rating === 'object' && salon.rating?.count) return salon.rating.count;
        return salon.totalReviews || 0;
    })();

    // Auto-advance carousel
    useEffect(() => {
        if (!hasMultiple || !hovered) return;
        const t = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 2200);
        return () => clearInterval(t);
    }, [hasMultiple, images.length, hovered]);

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(p => (p - 1 + images.length) % images.length);
    };

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(p => (p + 1) % images.length);
    };

    // Gradient placeholder colors per first letter
    const gradients: Record<string, string> = {
        A: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        B: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        C: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
        D: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        default: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
    };
    const firstLetter = (salon.displayName || salon.businessName || 'S')[0].toUpperCase();
    const placeholderGradient = gradients[firstLetter] || gradients.default;

    return (
        <Box
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                bgcolor: 'white',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                cursor: onClick ? 'pointer' : 'default',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': onClick ? {
                    boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                    borderColor: '#e0e7ff',
                    transform: 'translateY(-4px)',
                } : {},
            }}
        >
            {/* ── Image Area ── */}
            <Box sx={{ position: 'relative', height: 210, overflow: 'hidden', bgcolor: '#f8fafc', flexShrink: 0 }}>
                {images.length > 0 && !imageError ? (
                    <>
                        {/* Carousel track */}
                        <Box
                            sx={{
                                display: 'flex',
                                height: '100%',
                                transition: hovered ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                                transform: `translateX(-${currentImageIndex * 100}%)`,
                                willChange: 'transform',
                            }}
                        >
                            {images.map((img, i) => (
                                <Box
                                    key={i}
                                    component="img"
                                    src={img}
                                    alt={`${salon.displayName || salon.businessName} ${i + 1}`}
                                    onError={() => setImageError(true)}
                                    sx={{ minWidth: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ))}
                        </Box>

                        {/* Navigation arrows — show on hover */}
                        {hasMultiple && hovered && (
                            <>
                                <IconButton
                                    onClick={prev}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        left: 10,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.6)',
                                        width: 32,
                                        height: 32,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        '&:hover': { bgcolor: 'white', transform: 'translateY(-50%) scale(1.05)' },
                                        zIndex: 2,
                                    }}
                                >
                                    <ChevronLeft sx={{ fontSize: 18, color: '#334155' }} />
                                </IconButton>
                                <IconButton
                                    onClick={next}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        right: 10,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.6)',
                                        width: 32,
                                        height: 32,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        '&:hover': { bgcolor: 'white', transform: 'translateY(-50%) scale(1.05)' },
                                        zIndex: 2,
                                    }}
                                >
                                    <ChevronRight sx={{ fontSize: 18, color: '#334155' }} />
                                </IconButton>
                            </>
                        )}

                        {/* Dot indicators */}
                        {hasMultiple && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: 0.5,
                                    zIndex: 2,
                                }}
                            >
                                {images.map((_, i) => (
                                    <Box
                                        key={i}
                                        onClick={e => { e.stopPropagation(); setCurrentImageIndex(i); }}
                                        sx={{
                                            width: i === currentImageIndex ? 16 : 6,
                                            height: 6,
                                            borderRadius: '3px',
                                            bgcolor: i === currentImageIndex ? 'white' : 'rgba(255,255,255,0.55)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </>
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            background: placeholderGradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <ScissorsIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 36 }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.5rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
                            {firstLetter}
                        </Typography>
                    </Box>
                )}

                {/* Status badge */}
                <Chip
                    label={isOpen ? 'Open' : 'Closed'}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 24,
                        zIndex: 2,
                        bgcolor: isOpen ? alpha('#10b981', 0.9) : alpha('#64748b', 0.85),
                        color: 'white',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '& .MuiChip-label': { px: '8px' },
                    }}
                />

                {/* Subtle bottom gradient for readability */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 48,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)',
                        pointerEvents: 'none',
                    }}
                />
            </Box>

            {/* ── Content ── */}
            <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                {/* Name */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: '#0f172a',
                        mb: 1,
                        lineHeight: 1.3,
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '1.05rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {salon.displayName || salon.businessName}
                </Typography>

                {/* Location + Rating row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                        <LocationIcon sx={{ fontSize: 15, color: '#94a3b8', flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {salon.address?.city}{salon.address?.state ? `, ${salon.address.state}` : ''}
                        </Typography>
                    </Box>

                    {/* Rating */}
                    {avgRating ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexShrink: 0 }}>
                            <StarIcon sx={{ fontSize: 15, color: '#fbbf24' }} />
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                                {avgRating.toFixed(1)}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                ({reviewCount})
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexShrink: 0 }}>
                            <StarIcon sx={{ fontSize: 15, color: '#e2e8f0' }} />
                            <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>New</Typography>
                        </Box>
                    )}
                </Box>

                {/* Description */}
                {salon.description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#64748b',
                            fontSize: '0.825rem',
                            lineHeight: 1.65,
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {salon.description}
                    </Typography>
                )}

                {/* Specialties */}
                {salon.specialties && salon.specialties.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2.5 }}>
                        {salon.specialties.slice(0, 3).map((s, i) => (
                            <Chip
                                key={i}
                                label={s}
                                size="small"
                                sx={{
                                    height: 24,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    bgcolor: '#f1f5f9',
                                    color: '#64748b',
                                    border: 'none',
                                    '& .MuiChip-label': { px: '8px' },
                                }}
                            />
                        ))}
                    </Box>
                )}

                {/* CTA Button */}
                <Box sx={{ mt: 'auto' }}>
                    <Button
                        fullWidth
                        variant={isOpen ? 'contained' : 'outlined'}
                        disabled={!isOpen}
                        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                        endIcon={isOpen ? <ArrowForwardIcon sx={{ fontSize: '1rem !important' }} /> : undefined}
                        sx={{
                            py: 1.2,
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            ...(isOpen ? {} : {
                                borderColor: '#e2e8f0',
                                color: '#94a3b8',
                                '&.Mui-disabled': { bgcolor: 'transparent', borderColor: '#e2e8f0', color: '#94a3b8' },
                            }),
                        }}
                    >
                        {isOpen ? 'Book Now' : 'Currently Closed'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default SalonCard;
