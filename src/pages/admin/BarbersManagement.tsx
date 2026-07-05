import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, Typography, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Chip, IconButton, Menu, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, CircularProgress,
    Stack, TextField,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    ContentCut as ContentCutIcon,
    CheckCircleOutline as ApproveIcon,
    CancelOutlined as RejectIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending:   { bg: '#fef9c3', color: '#92400e' },
    approved:  { bg: '#dcfce7', color: '#166534' },
    rejected:  { bg: '#fee2e2', color: '#991b1b' },
    suspended: { bg: '#f1f5f9', color: '#475569' },
};

const statusLabel = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());

const BarbersManagement: React.FC = () => {
    const [barbers, setBarbers] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<any>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchBarbers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllBarbers({
                status: statusFilter || undefined,
                page: page + 1,
                limit: rowsPerPage,
            });
            if (res.success && res.data) {
                setBarbers(res.data.data);
                setTotal(res.data.pagination.total);
            }
        } catch {
            toast.error('Failed to load barbers');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page, rowsPerPage]);

    useEffect(() => { fetchBarbers(); }, [fetchBarbers]);

    const handleApprove = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            await adminService.approveBarber(selected._id);
            toast.success('Barber approved');
            setMenuAnchor(null);
            fetchBarbers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to approve');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            await adminService.rejectBarber(selected._id, rejectReason);
            toast.success('Barber rejected');
            setRejectDialogOpen(false);
            setRejectReason('');
            fetchBarbers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reject');
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
                    Barbers
                </Typography>
                <Typography variant="body2" color="text.secondary">{total} total barbers</Typography>
            </Box>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
                {['', 'pending', 'approved', 'rejected', 'suspended'].map(s => (
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
                                <TableCell>Barber</TableCell>
                                <TableCell>Salon</TableCell>
                                <TableCell>Experience</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <CircularProgress sx={{ color: '#6366f1' }} />
                                    </TableCell>
                                </TableRow>
                            ) : barbers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <ContentCutIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography color="text.secondary">No barbers found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : barbers.map(barber => {
                                const colors = STATUS_COLORS[barber.status] ?? STATUS_COLORS.pending;
                                return (
                                    <TableRow key={barber._id} sx={{ '&:hover': { bgcolor: '#fafafa' }, '& td': { borderBottom: '1px solid #f8fafc', py: 2 } }}>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {barber.displayName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {(barber.specializations || []).join(', ') || '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b', bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '6px' }}>
                                                #{String(barber.salonId).slice(-8).toUpperCase()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{barber.experience} yrs</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                {barber.rating?.average ? `${barber.rating.average.toFixed(1)} ★` : '—'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {barber.rating?.count || 0} reviews
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#334155' }}>
                                                {dayjs(barber.createdAt).format('MMM D, YYYY')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusLabel(barber.status)}
                                                size="small"
                                                sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700, fontSize: '0.7rem', borderRadius: '8px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={e => { setMenuAnchor(e.currentTarget); setSelected(barber); }} sx={{ color: '#64748b' }}>
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

            <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{ elevation: 0, sx: { borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 180 } }}
            >
                {selected?.status === 'pending' && [
                    <MenuItem key="approve" onClick={handleApprove} disabled={actionLoading} sx={{ gap: 1.5, py: 1.5, color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
                        <ApproveIcon fontSize="small" /> Approve
                    </MenuItem>,
                    <MenuItem key="reject" onClick={() => { setMenuAnchor(null); setRejectDialogOpen(true); }} sx={{ gap: 1.5, py: 1.5, color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                        <RejectIcon fontSize="small" /> Reject
                    </MenuItem>,
                ]}
                {selected?.status !== 'pending' && (
                    <MenuItem disabled sx={{ py: 1.5, fontSize: '0.875rem' }}>No actions available</MenuItem>
                )}
            </Menu>

            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ elevation: 0, sx: { borderRadius: '20px', p: 1, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Reject Barber</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Rejecting <strong>{selected?.displayName}</strong>. They'll be notified with your reason.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Reason for rejection"
                        multiline
                        rows={3}
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setRejectDialogOpen(false)} sx={{ borderRadius: '50px', textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button onClick={handleReject} variant="contained" color="error" disabled={actionLoading}
                        sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}>
                        {actionLoading ? <CircularProgress size={18} color="inherit" /> : 'Reject Barber'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BarbersManagement;
