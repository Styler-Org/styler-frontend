import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import {
    CheckCircle as CheckInIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    MoreVert as MoreIcon
} from '@mui/icons-material';

interface CheckInOutButtonProps {
    onCheckIn?: () => void;
    onCheckOut?: () => void;
}

interface ActiveSession {
    appointmentId: string;
    clientName: string;
    service: string;
    startTime: Date;
}

const CheckInOutButton: React.FC<CheckInOutButtonProps> = ({ onCheckIn, onCheckOut }) => {
    const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Timer effect
    useEffect(() => {
        if (!activeSession) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000);
            setElapsedTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    const handleCheckIn = () => {
        // Mock check-in - replace with actual API call
        const mockSession: ActiveSession = {
            appointmentId: '1',
            clientName: 'Rahul Sharma',
            service: 'Haircut & Beard Trim',
            startTime: new Date()
        };
        setActiveSession(mockSession);
        setElapsedTime(0);
        onCheckIn?.();
    };

    const handleCheckOut = () => {
        setActiveSession(null);
        setElapsedTime(0);
        onCheckOut?.();
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    if (!activeSession) {
        return (
            <Button
                variant="contained"
                size="large"
                startIcon={<CheckInIcon />}
                onClick={handleCheckIn}
                sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
                    }
                }}
            >
                Check In
            </Button>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'white',
            p: 1.5,
            pr: 1,
            borderRadius: '16px',
            border: '2px solid #10b981',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
        }}>
            {/* Session Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#10b981',
                    animation: 'pulse 2s infinite'
                }} />
                <Box>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                        {activeSession.clientName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {activeSession.service}
                    </Typography>
                </Box>
            </Box>

            {/* Timer */}
            <Chip
                label={formatTime(elapsedTime)}
                size="small"
                sx={{
                    bgcolor: '#dcfce7',
                    color: '#166534',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    minWidth: 60
                }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Complete Session">
                    <IconButton
                        size="small"
                        onClick={handleCheckOut}
                        sx={{
                            bgcolor: '#10b981',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#059669'
                            }
                        }}
                    >
                        <StopIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="More Options">
                    <IconButton size="small" onClick={handleMenuOpen}>
                        <MoreIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => { handleMenuClose(); }}>
                    Add Note
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); }}>
                    Extend Time
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleMenuClose(); handleCheckOut(); }} sx={{ color: 'error.main' }}>
                    Cancel Session
                </MenuItem>
            </Menu>

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.5;
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default CheckInOutButton;
