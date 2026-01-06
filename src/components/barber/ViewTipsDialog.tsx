import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Divider,
    Chip,
    Tab,
    Tabs
} from '@mui/material';
import {
    TrendingUp as TrendingIcon,
    CalendarMonth as CalendarIcon,
    AccountBalance as WalletIcon
} from '@mui/icons-material';

interface ViewTipsDialogProps {
    open: boolean;
    onClose: () => void;
}

// Mock tips data
const MOCK_TIPS = {
    today: [
        { id: 1, client: 'Rahul Sharma', amount: 50, service: 'Haircut & Beard Trim', time: '10:00 AM' },
        { id: 2, client: 'Vikram Singh', amount: 100, service: 'Hair Color', time: '02:00 PM' }
    ],
    week: [
        { id: 1, client: 'Rahul Sharma', amount: 50, service: 'Haircut & Beard Trim', time: 'Today' },
        { id: 2, client: 'Vikram Singh', amount: 100, service: 'Hair Color', time: 'Today' },
        { id: 3, client: 'Amit Patel', amount: 30, service: 'Classic Shave', time: 'Yesterday' },
        { id: 4, client: 'Suresh Kumar', amount: 40, service: 'Haircut', time: 'Jan 4' },
        { id: 5, client: 'Priya Singh', amount: 80, service: 'Hair Styling', time: 'Jan 3' }
    ],
    month: 1250
};

const ViewTipsDialog: React.FC<ViewTipsDialogProps> = ({ open, onClose }) => {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const todayTotal = MOCK_TIPS.today.reduce((sum, tip) => sum + tip.amount, 0);
    const weekTotal = MOCK_TIPS.week.reduce((sum, tip) => sum + tip.amount, 0);

    const currentTips = tabValue === 0 ? MOCK_TIPS.today : MOCK_TIPS.week;
    const currentTotal = tabValue === 0 ? todayTotal : weekTotal;

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
                    <TrendingIcon sx={{ color: '#10b981' }} />
                    <Typography variant="h6" fontWeight={700}>
                        My Tips
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Track your earnings from client tips
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {/* Summary Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                    <Box sx={{
                        p: 2.5,
                        bgcolor: '#ecfdf5',
                        borderRadius: '16px',
                        border: '1px solid #a7f3d0'
                    }}>
                        <Typography variant="caption" color="#065f46" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <CalendarIcon sx={{ fontSize: 14 }} /> THIS WEEK
                        </Typography>
                        <Typography variant="h4" fontWeight={800} color="#059669">
                            ₹{weekTotal}
                        </Typography>
                        <Typography variant="caption" color="#065f46">
                            {MOCK_TIPS.week.length} tips received
                        </Typography>
                    </Box>

                    <Box sx={{
                        p: 2.5,
                        bgcolor: '#eff6ff',
                        borderRadius: '16px',
                        border: '1px solid #bfdbfe'
                    }}>
                        <Typography variant="caption" color="#1e40af" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <WalletIcon sx={{ fontSize: 14 }} /> THIS MONTH
                        </Typography>
                        <Typography variant="h4" fontWeight={800} color="#2563eb">
                            ₹{MOCK_TIPS.month}
                        </Typography>
                        <Typography variant="caption" color="#1e40af">
                            Total earnings
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Tabs */}
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                        mb: 2,
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            minHeight: 40,
                            borderRadius: '8px',
                            mr: 1
                        },
                        '& .Mui-selected': {
                            bgcolor: '#f1f5f9',
                            color: '#0f172a'
                        },
                        '& .MuiTabs-indicator': {
                            display: 'none'
                        }
                    }}
                >
                    <Tab label="Today" />
                    <Tab label="This Week" />
                </Tabs>

                {/* Tips List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 300, overflow: 'auto' }}>
                    {currentTips.length > 0 ? (
                        currentTips.map((tip) => (
                            <Box
                                key={tip.id}
                                sx={{
                                    p: 2,
                                    bgcolor: '#f8fafc',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700}>
                                        {tip.client}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {tip.service} • {tip.time}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={`+₹${tip.amount}`}
                                    size="small"
                                    sx={{
                                        bgcolor: '#dcfce7',
                                        color: '#166534',
                                        fontWeight: 700,
                                        fontSize: '0.85rem'
                                    }}
                                />
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                No tips received yet
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Total */}
                {currentTips.length > 0 && (
                    <Box sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: '#1e293b',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="subtitle1" fontWeight={700} color="white">
                            Total {tabValue === 0 ? 'Today' : 'This Week'}
                        </Typography>
                        <Typography variant="h5" fontWeight={800} color="#4ade80">
                            ₹{currentTotal}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: '8px', py: 1.2, fontWeight: 600 }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewTipsDialog;
