import React from 'react';
import { Box, Skeleton } from '@mui/material';

const SalonCardSkeleton: React.FC = () => {
    return (
        <Box
            sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                bgcolor: 'white',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
        >
            {/* Image area */}
            <Skeleton
                variant="rectangular"
                height={210}
                animation="wave"
                sx={{ bgcolor: '#f1f5f9', '&::after': { background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' } }}
            />

            {/* Content */}
            <Box sx={{ p: 3 }}>
                {/* Title */}
                <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.75, borderRadius: '8px' }} animation="wave" />

                {/* Location + Rating row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Skeleton variant="text" width="45%" height={18} sx={{ borderRadius: '6px' }} animation="wave" />
                    <Skeleton variant="text" width="25%" height={18} sx={{ borderRadius: '6px' }} animation="wave" />
                </Box>

                {/* Description lines */}
                <Skeleton variant="text" width="100%" height={16} sx={{ borderRadius: '6px', mb: 0.5 }} animation="wave" />
                <Skeleton variant="text" width="85%" height={16} sx={{ borderRadius: '6px', mb: 2 }} animation="wave" />

                {/* Tags */}
                <Box sx={{ display: 'flex', gap: 0.75, mb: 2.5 }}>
                    {[60, 50, 70].map((w, i) => (
                        <Skeleton key={i} variant="rectangular" width={w} height={24} sx={{ borderRadius: '8px' }} animation="wave" />
                    ))}
                </Box>

                {/* Button */}
                <Skeleton variant="rectangular" width="100%" height={44} sx={{ borderRadius: '12px' }} animation="wave" />
            </Box>
        </Box>
    );
};

export default SalonCardSkeleton;
