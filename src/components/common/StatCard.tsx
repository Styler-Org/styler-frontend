import React, { ReactNode } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: ReactNode;
    prefix?: ReactNode;
    suffix?: string;
    color?: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    prefix,
    suffix,
    color = '#6366f1',
    change,
    trend = 'neutral',
    subtitle,
}) => {
    const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8';

    return (
        <Box
            component={motion.div}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            sx={{
                p: 3,
                borderRadius: '20px',
                bgcolor: 'white',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                '&:hover': {
                    boxShadow: '0 8px 28px rgba(0,0,0,0.08)',
                    borderColor: alpha(color, 0.2),
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                {icon && (
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '14px',
                            bgcolor: alpha(color, 0.1),
                            color: color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '& svg': { fontSize: '1.3rem' },
                        }}
                    >
                        {icon}
                    </Box>
                )}

                {change && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            px: 1,
                            py: 0.4,
                            borderRadius: '8px',
                            bgcolor: alpha(trendColor, 0.08),
                            color: trendColor,
                        }}
                    >
                        {trend === 'up' ? (
                            <TrendingUpIcon sx={{ fontSize: 14 }} />
                        ) : trend === 'down' ? (
                            <TrendingDownIcon sx={{ fontSize: 14 }} />
                        ) : null}
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'inherit' }}>
                            {change}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Typography
                sx={{
                    fontSize: '1.9rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.1,
                    mb: 0.5,
                    fontFamily: '"Outfit", sans-serif',
                    letterSpacing: '-0.02em',
                }}
            >
                {prefix}
                {value}
                {suffix}
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.82rem', mt: 0.25 }}>
                {title}
            </Typography>

            {subtitle && (
                <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.5, fontSize: '0.75rem' }}>
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default StatCard;
