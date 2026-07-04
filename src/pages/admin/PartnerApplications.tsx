import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, Typography, TextField, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Chip, IconButton, Menu, MenuItem, Dialog,
    DialogTitle, DialogContent, DialogActions, CircularProgress,
    Stack, MenuItem as SelectMenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    CheckCircle as ApproveIcon,
    PhoneInTalk as ContactedIcon,
    Cancel as RejectIcon,
    Business as BusinessIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import adminService, { PartnerApplication, PartnerApplicationStatus } from '../../services/adminService';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

const STATUS_STYLES: Record<PartnerApplicationStatus, { bg: string; color: string }> = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    contacted: { bg: '#dbeafe', color: '#1e40af' },
    approved: { bg: '#dcfce7', color: '#16a34a' },
    rejected: { bg: '#fee2e2', color: '#dc2626' },
};

const statusChip = (status: PartnerApplicationStatus) => (
    <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        sx={{ bgcolor: STATUS_STYLES[status].bg, color: STATUS_STYLES[status].color, fontWeight: 700, fontSize: '0.7rem', borderRadius: '8px' }}
    />
);

const PartnerApplications: React.FC = () => {
    const [applications, setApplications] = useState<PartnerApplication[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState<PartnerApplicationStatus | ''>('');
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<PartnerApplication | null>(null);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getPartnerApplications({
                status: statusFilter || undefined,
                page: page + 1,
                limit: rowsPerPage,
            });
            if (res.success && res.data) {
                setApplications(res.data.applications);
                setTotal(res.data.total);
            }
        } catch {
            toast.error('Failed to fetch partner applications');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page, rowsPerPage]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    const openMenu = (e: React.MouseEvent<HTMLElement>, app: PartnerApplication) => {
        setMenuAnchor(e.currentTarget);
        setSelected(app);
    };

    const handleApprove = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            const res = await adminService.approvePartnerApplication(selected._id, adminNotes || undefined);
            toast.success(`Approved — invite email sent to ${selected.email}`);
            if (res.data?.onboardUrl) {
                // eslint-disable-next-line no-console
                console.info('Onboarding link:', res.data.onboardUrl);
            }
            setApproveDialogOpen(false);
            setAdminNotes('');
            fetchApplications();
        } catch (err: any) {
            toast.error(err.response?.data?.error?.message || 'Failed to approve application');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkContacted = async (app: PartnerApplication) => {
        try {
            await adminService.updatePartnerApplicationStatus(app._id, 'contacted');
            toast.success('Marked as contacted');
            fetchApplications();
        } catch (err: any) {
            toast.error(err.response?.data?.error?.message || 'Failed to update status');
        }
    };

    const handleReject = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            await adminService.updatePartnerApplicationStatus(selected._id, 'rejected', adminNotes || undefined);
            toast.success('Application rejected');
            setRejectDialogOpen(false);
            setAdminNotes('');
            fetchApplications();
        } catch (err: any) {
            toast.error(err.response?.data?.error?.message || 'Failed to reject application');
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
                    Partner Applications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {total} businesses have applied to join Styler
                </Typography>
            </Box>

            <MotionCard
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}
            >
                <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value as PartnerApplicationStatus | ''); setPage(0); }}
                            sx={{ borderRadius: '12px', bgcolor: '#f8fafc' }}
                        >
                            <SelectMenuItem value="">All statuses</SelectMenuItem>
                            <SelectMenuItem value="pending">Pending</SelectMenuItem>
                            <SelectMenuItem value="contacted">Contacted</SelectMenuItem>
                            <SelectMenuItem value="approved">Approved</SelectMenuItem>
                            <SelectMenuItem value="rejected">Rejected</SelectMenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', bgcolor: '#fafafa', py: 2 } }}>
                                <TableCell>Business</TableCell>
                                <TableCell>Owner</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Category</TableCell>
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
                            ) : applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <BusinessIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography color="text.secondary">No applications found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : applications.map((app) => (
                                <TableRow key={app._id} sx={{ '&:hover': { bgcolor: '#fafafa' }, '& td': { borderBottom: '1px solid #f8fafc', py: 2 } }}>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{app.businessName}</Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                            {app.numberOfLocations ? `${app.numberOfLocations} location(s)` : ''}
                                        </Typography>
                                    </TableCell>
                                    <TableCell><Typography variant="body2" sx={{ color: '#334155' }}>{app.ownerName}</Typography></TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#334155' }}>{app.phone}</Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{app.email}</Typography>
                                    </TableCell>
                                    <TableCell><Typography variant="body2" sx={{ color: '#334155' }}>{app.city}</Typography></TableCell>
                                    <TableCell>
                                        <Chip label={app.category} size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600, borderRadius: '6px', fontSize: '0.7rem' }} />
                                    </TableCell>
                                    <TableCell>{statusChip(app.status)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => openMenu(e, app)} sx={{ color: '#64748b' }}>
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
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[10, 25, 50]}
                    sx={{ borderTop: '1px solid #f1f5f9', color: '#64748b' }}
                />
            </MotionCard>

            <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{ elevation: 0, sx: { borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 200 } }}
            >
                <MenuItem
                    disabled={selected?.status === 'approved'}
                    onClick={() => { setMenuAnchor(null); setApproveDialogOpen(true); }}
                    sx={{ gap: 1.5, py: 1.5, color: '#334155', fontWeight: 600, fontSize: '0.875rem' }}
                >
                    <ApproveIcon fontSize="small" sx={{ color: '#16a34a' }} /> Approve & Invite
                </MenuItem>
                <MenuItem
                    disabled={selected?.status !== 'pending'}
                    onClick={() => { const app = selected; setMenuAnchor(null); if (app) handleMarkContacted(app); }}
                    sx={{ gap: 1.5, py: 1.5, color: '#334155', fontWeight: 600, fontSize: '0.875rem' }}
                >
                    <ContactedIcon fontSize="small" sx={{ color: '#1e40af' }} /> Mark Contacted
                </MenuItem>
                <MenuItem
                    disabled={selected?.status === 'approved' || selected?.status === 'rejected'}
                    onClick={() => { setMenuAnchor(null); setRejectDialogOpen(true); }}
                    sx={{ gap: 1.5, py: 1.5, color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}
                >
                    <RejectIcon fontSize="small" /> Reject
                </MenuItem>
            </Menu>

            <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ elevation: 0, sx: { borderRadius: '20px', p: 1, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Approve Application</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        This creates (or promotes) a <strong>salon_owner</strong> account for <strong>{selected?.ownerName}</strong> and
                        emails an onboarding link to <strong>{selected?.email}</strong>.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Admin notes (optional)"
                        multiline
                        rows={3}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setApproveDialogOpen(false)} sx={{ borderRadius: '50px', textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button onClick={handleApprove} variant="contained" disabled={actionLoading}
                        sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, boxShadow: 'none' }}>
                        {actionLoading ? <CircularProgress size={18} color="inherit" /> : 'Approve & Send Invite'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ elevation: 0, sx: { borderRadius: '20px', p: 1, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>Reject Application</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Reject <strong>{selected?.businessName}</strong>'s application.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Reason (optional)"
                        multiline
                        rows={3}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setRejectDialogOpen(false)} sx={{ borderRadius: '50px', textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button onClick={handleReject} variant="contained" color="error" disabled={actionLoading}
                        sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}>
                        {actionLoading ? <CircularProgress size={18} color="inherit" /> : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PartnerApplications;
