import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography, TextField, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Chip, IconButton, Menu, MenuItem, Dialog,
    DialogTitle, DialogContent, DialogActions, CircularProgress,
    Avatar, Stack, InputAdornment, alpha
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    Store as StoreIcon,
    LocationOn as LocationIcon,
    Block as BlockIcon,
    DeleteOutline as DeleteIcon,
    Visibility as ViewIcon,
    CheckCircle as ActiveIcon,
    Cancel as SuspendedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

const statusChip = (isActive: boolean) => (
    <Chip
        icon={isActive ? <ActiveIcon sx={{ fontSize: '14px !important' }} /> : <SuspendedIcon sx={{ fontSize: '14px !important' }} />}
        label={isActive ? 'Active' : 'Suspended'}
        size="small"
        sx={{
            bgcolor: isActive ? '#dcfce7' : '#fee2e2',
            color: isActive ? '#16a34a' : '#dc2626',
            fontWeight: 700,
            fontSize: '0.7rem',
            borderRadius: '8px',
        }}
    />
);

const SalonsManagement: React.FC = () => {
    const [salons, setSalons] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<any>(null);
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchSalons = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllSalons({
                search: search || undefined,
                city: cityFilter || undefined,
                page: page + 1,
                limit: rowsPerPage,
            });
            if (res.success && res.data) {
                setSalons(res.data.data);
                setTotal(res.data.pagination.total);
            }
        } catch {
            toast.error('Failed to fetch salons');
        } finally {
            setLoading(false);
        }
    }, [search, cityFilter, page, rowsPerPage]);

    useEffect(() => {
        const t = setTimeout(fetchSalons, 300);
        return () => clearTimeout(t);
    }, [fetchSalons]);

    const openMenu = (e: React.MouseEvent<HTMLElement>, salon: any) => {
        setMenuAnchor(e.currentTarget);
        setSelected(salon);
    };

    const handleSuspend = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            await adminService.suspendSalon(selected._id, suspendReason);
            toast.success(`Salon "${selected.displayName || selected.businessName}" suspended`);
            setSuspendDialogOpen(false);
            setSuspendReason('');
            fetchSalons();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to suspend salon');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            await adminService.deleteSalon(selected._id);
            toast.success('Salon deleted');
            setDeleteDialogOpen(false);
            fetchSalons();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete salon');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}>
                    ADMIN PANEL
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Salons Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {total} salons registered on the platform
                </Typography>
            </Box>

            <MotionCard
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}
            >
                {/* Filters Bar */}
                <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Search salons..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(0); }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                            sx: { borderRadius: '12px', bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } }
                        }}
                        sx={{ minWidth: 260 }}
                    />
                    <TextField
                        size="small"
                        placeholder="Filter by city..."
                        value={cityFilter}
                        onChange={e => { setCityFilter(e.target.value); setPage(0); }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LocationIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                            sx: { borderRadius: '12px', bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } }
                        }}
                        sx={{ minWidth: 200 }}
                    />
                </Box>

                {/* Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', bgcolor: '#fafafa', py: 2 } }}>
                                <TableCell>Salon</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Owner</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Rating</TableCell>
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
                            ) : salons.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <StoreIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography color="text.secondary">No salons found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : salons.map((salon) => (
                                <TableRow
                                    key={salon._id}
                                    sx={{ '&:hover': { bgcolor: '#fafafa' }, '& td': { borderBottom: '1px solid #f8fafc', py: 2 } }}
                                >
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                src={salon.images?.[0] || salon.coverImage}
                                                sx={{ borderRadius: '10px', width: 44, height: 44, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', fontWeight: 700 }}
                                            >
                                                {(salon.displayName || salon.businessName || 'S').charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                    {salon.displayName || salon.businessName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                                                    #{salon._id.slice(-6).toUpperCase()}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#334155' }}>
                                            {salon.address?.city || '—'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                            {salon.address?.country || ''}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#334155' }}>
                                            {salon.ownerId?.name || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={salon.category || 'Salon'}
                                            size="small"
                                            sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600, borderRadius: '6px', fontSize: '0.7rem' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                                            ★ {salon.averageRating?.toFixed(1) ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{statusChip(salon.isActive !== false)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={e => openMenu(e, salon)} sx={{ color: '#64748b' }}>
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

            {/* Context Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{ elevation: 0, sx: { borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 180 } }}
            >
                <MenuItem onClick={() => { setMenuAnchor(null); }} sx={{ gap: 1.5, py: 1.5, color: '#334155', fontWeight: 600, fontSize: '0.875rem' }}>
                    <ViewIcon fontSize="small" sx={{ color: '#6366f1' }} /> View Details
                </MenuItem>
                <MenuItem onClick={() => { setMenuAnchor(null); setSuspendDialogOpen(true); }} sx={{ gap: 1.5, py: 1.5, color: '#334155', fontWeight: 600, fontSize: '0.875rem' }}>
                    <BlockIcon fontSize="small" sx={{ color: '#f59e0b' }} /> Suspend Salon
                </MenuItem>
                <MenuItem onClick={() => { setMenuAnchor(null); setDeleteDialogOpen(true); }} sx={{ gap: 1.5, py: 1.5, color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                    <DeleteIcon fontSize="small" /> Delete Salon
                </MenuItem>
            </Menu>

            {/* Suspend Dialog */}
            <Dialog open={suspendDialogOpen} onClose={() => setSuspendDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ elevation: 0, sx: { borderRadius: '20px', p: 1, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Suspend Salon</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        You are about to suspend <strong>{selected?.displayName || selected?.businessName}</strong>. This will prevent customers from booking.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Reason (optional)"
                        multiline
                        rows={3}
                        value={suspendReason}
                        onChange={e => setSuspendReason(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setSuspendDialogOpen(false)} sx={{ borderRadius: '50px', textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button onClick={handleSuspend} variant="contained" disabled={actionLoading}
                        sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' }, boxShadow: 'none' }}>
                        {actionLoading ? <CircularProgress size={18} color="inherit" /> : 'Suspend'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth
                PaperProps={{ elevation: 0, sx: { borderRadius: '20px', p: 1, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Delete Salon?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        This action is permanent and cannot be undone. All data for <strong>{selected?.displayName || selected?.businessName}</strong> will be removed.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '50px', textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error" disabled={actionLoading}
                        sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}>
                        {actionLoading ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SalonsManagement;
