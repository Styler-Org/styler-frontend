import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, Typography, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Chip, IconButton, Menu, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, CircularProgress, Stack,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    RateReview as ReviewIcon,
    DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

const ReviewsManagement: React.FC = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [targetTypeFilter, setTargetTypeFilter] = useState<'' | 'salon' | 'barber'>('');
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllReviews({
                targetType: targetTypeFilter || undefined,
                page: page + 1,
                limit: rowsPerPage,
            });
            if (res.success && res.data) {
                setReviews(res.data);
                setTotal(res.pagination?.total ?? 0);
            }
        } catch {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    }, [targetTypeFilter, page, rowsPerPage]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    const handleDelete = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            await adminService.deleteReview(selected._id);
            toast.success('Review deleted');
            setDeleteDialogOpen(false);
            fetchReviews();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete review');
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
                    Reviews
                </Typography>
                <Typography variant="body2" color="text.secondary">{total} total reviews</Typography>
            </Box>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
                {(['', 'salon', 'barber'] as const).map(t => (
                    <Button
                        key={t}
                        size="small"
                        onClick={() => { setTargetTypeFilter(t); setPage(0); }}
                        sx={{
                            borderRadius: '50px', px: 2.5, py: 0.8, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
                            bgcolor: targetTypeFilter === t ? '#1e293b' : '#f1f5f9',
                            color: targetTypeFilter === t ? 'white' : '#64748b',
                            border: '1px solid',
                            borderColor: targetTypeFilter === t ? 'transparent' : '#e2e8f0',
                        }}
                    >
                        {t ? `${t.charAt(0).toUpperCase()}${t.slice(1)} Reviews` : 'All'}
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
                                <TableCell>Rating</TableCell>
                                <TableCell>Comment</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <CircularProgress sx={{ color: '#6366f1' }} />
                                    </TableCell>
                                </TableRow>
                            ) : reviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <ReviewIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography color="text.secondary">No reviews found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : reviews.map(review => (
                                <TableRow key={review._id} sx={{ '&:hover': { bgcolor: '#fafafa' }, '& td': { borderBottom: '1px solid #f8fafc', py: 2 } }}>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                            {review.rating} ★
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 320 }}>
                                        <Typography variant="body2" sx={{ color: '#334155' }} noWrap title={review.comment}>
                                            {review.comment || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#334155', textTransform: 'capitalize' }}>
                                            {review.barberId ? 'Barber' : 'Salon'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                                            #{String(review.barberId || review.salonId).slice(-8).toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#334155' }}>
                                            {dayjs(review.createdAt).format('MMM D, YYYY')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={review.isVerified ? 'Verified' : 'Unverified'}
                                            size="small"
                                            sx={{
                                                bgcolor: review.isVerified ? '#dcfce7' : '#f1f5f9',
                                                color: review.isVerified ? '#166534' : '#64748b',
                                                fontWeight: 700, fontSize: '0.7rem', borderRadius: '8px',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={e => { setMenuAnchor(e.currentTarget); setSelected(review); }} sx={{ color: '#64748b' }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
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
                <MenuItem onClick={() => { setMenuAnchor(null); setDeleteDialogOpen(true); }} sx={{ gap: 1.5, py: 1.5, color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                    <DeleteIcon fontSize="small" /> Delete Review
                </MenuItem>
            </Menu>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ elevation: 0, sx: { borderRadius: '20px', p: 1, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Delete Review</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        This permanently deletes the review. This can't be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '50px', textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error" disabled={actionLoading}
                        sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}>
                        {actionLoading ? <CircularProgress size={18} color="inherit" /> : 'Delete Review'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReviewsManagement;
