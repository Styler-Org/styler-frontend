import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, Typography, TextField, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Chip, IconButton, Menu, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, CircularProgress,
    Stack, InputAdornment, Select, FormControl, InputLabel, alpha
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    Event as EventIcon,
    CancelOutlined as CancelIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending:     { bg: '#fef9c3', color: '#92400e' },
    confirmed:   { bg: '#dcfce7', color: '#166534' },
    in_progress: { bg: '#ede9fe', color: '#5b21b6' },
    completed:   { bg: '#dbeafe', color: '#1e40af' },
    cancelled:   { bg: '#fee2e2', color: '#991b1b' },
    no_show:     { bg: '#f1f5f9', color: '#475569' },
};

const statusLabel = (s: string) => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

const AppointmentsManagement: React.FC = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<any>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllAppointments({
                status: statusFilter || undefined,
                page: page + 1,
                limit: rowsPerPage,
            });
            if (res.success && res.data) {
                setAppointments(res.data.data);
                setTotal(res.data.pagination.total);
            }
        } catch {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page, rowsPerPage]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleCancel = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            await adminService.cancelAppointment(selected._id, cancelReason);
            toast.success('Appointment cancelled');
            setCancelDialogOpen(false);
            setCancelReason('');
            fetchAppointments();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}>
                    ADMIN PANEL
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">{total} total appointments</Typography>
            </Box>

            {/* Status Summary Pills */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
                {['', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(s => (
                    <Button
                        key={s}
                        size="small"
                        onClick={() => { setStatusFilter(s); setPage(0); }}
                        sx={{
                            borderRadius: '50px', px: 2.5, py: 0.8, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
                            bgcolor: statusFilter === s
                                ? (s ? STATUS_COLORS[s]?.bg : '#1e293b')
                                : '#f1f5f9',
                            color: statusFilter === s
                                ? (s ? STATUS_COLORS[s]?.color : 'white')
                                : '#64748b',
                            border: '1px solid',
                            borderColor: statusFilter === s
                                ? (s ? STATUS_COLORS[s]?.color : 'transparent')
                                : '#e2e8f0',
                        }}
                    >
                        {s ? statusLabel(s) : 'All'}
                    </Button>
                ))}
            </Stack>

            <MotionCard
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', bgcolor: '#fafafa', py: 2 } }}>
                                <TableCell>Booking ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Salon</TableCell>
                                <TableCell>Scheduled At</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                        <CircularProgress sx={{ color: '#6366f1' }} />
                                    </TableCell>
                                </TableRow>
                            ) : appointments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                        <EventIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography color="text.secondary">No appointments found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : appointments.map(appt => {
                                const colors = STATUS_COLORS[appt.status] ?? STATUS_COLORS.cancelled;
                                return (
                                    <TableRow key={appt._id} sx={{ '&:hover': { bgcolor: '#fafafa' }, '& td': { borderBottom: '1px solid #f8fafc', py: 2 } }}>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b', bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '6px' }}>
                                                #{appt._id.slice(-8).toUpperCase()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {(appt.userId as any)?.name || 'Unknown'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {(appt.userId as any)?.phone || ''}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {(appt.salonId as any)?.displayName || (appt.salonId as any)?.businessName || '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                {dayjs(appt.scheduledAt).format('MMM D, YYYY')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {dayjs(appt.scheduledAt).format('h:mm A')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{appt.duration} min</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                {appt.pricing?.total != null ? `₹${appt.pricing.total.toLocaleString('en-IN')}` : '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusLabel(appt.status)}
                                                size="small"
                                                sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700, fontSize: '0.7rem', borderRadius: '8px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={e => { setMenuAnchor(e.currentTarget); setSelected(appt); }} sx={{ color: '#64748b' }}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[10, 25, 50]}
                    sx={{ borderTop: '1px solid #f1f5f9', color: '#64748b' }}
                />
            </MotionCard>

            {/* Context Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{ elevation: 0, sx: { borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 180 } }}
            >
                <MenuItem onClick={() => setMenuAnchor(null)} sx={{ gap: 1.5, py: 1.5, color: '#334155', fontWeight: 600, fontSize: '0.875rem' }}>
                    <ViewIcon fontSize="small" sx={{ color: '#6366f1' }} /> View Details
                </MenuItem>
                {selected && !['completed', 'cancelled'].includes(selected?.status) && (
                    <MenuItem onClick={() => { setMenuAnchor(null); setCancelDialogOpen(true); }} sx={{ gap: 1.5, py: 1.5, color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                        <CancelIcon fontSize="small" /> Cancel Appointment
                    </MenuItem>
                )}
            </Menu>

            {/* Cancel Dialog */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ elevation: 0, sx: { borderRadius: '20px', p: 1, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Cancel Appointment</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Cancelling appointment <strong>#{selected?._id?.slice(-8).toUpperCase()}</strong>. The customer will be notified.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Reason for cancellation"
                        multiline
                        rows={3}
                        value={cancelReason}
                        onChange={e => setCancelReason(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setCancelDialogOpen(false)} sx={{ borderRadius: '50px', textTransform: 'none', color: '#64748b' }}>Keep</Button>
                    <Button onClick={handleCancel} variant="contained" color="error" disabled={actionLoading}
                        sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}>
                        {actionLoading ? <CircularProgress size={18} color="inherit" /> : 'Cancel Appointment'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AppointmentsManagement;
