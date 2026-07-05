import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, Typography, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Chip, CircularProgress, Stack, Button,
} from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import adminService, { AuditLogEntry } from '../../services/adminService';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
    deleted:     { bg: '#fee2e2', color: '#991b1b' },
    suspended:   { bg: '#fee2e2', color: '#991b1b' },
    cancelled:   { bg: '#fee2e2', color: '#991b1b' },
    rejected:    { bg: '#fee2e2', color: '#991b1b' },
    deactivated: { bg: '#fef9c3', color: '#92400e' },
    activated:   { bg: '#dcfce7', color: '#166534' },
    approved:    { bg: '#dcfce7', color: '#166534' },
    updated:     { bg: '#dbeafe', color: '#1e40af' },
};

const actionColor = (action: string) => {
    const suffix = action.split('.')[1] || '';
    return ACTION_COLORS[suffix] ?? { bg: '#f1f5f9', color: '#475569' };
};

const actionLabel = (action: string) => action.replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const TARGET_TYPES = ['', 'user', 'salon', 'barber', 'appointment', 'review'];

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [targetTypeFilter, setTargetTypeFilter] = useState('');

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getAuditLogs({
                targetType: targetTypeFilter || undefined,
                page: page + 1,
                limit: rowsPerPage,
            });
            if (res.success && res.data) {
                setLogs(res.data);
                setTotal(res.pagination?.total ?? 0);
            }
        } catch {
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    }, [targetTypeFilter, page, rowsPerPage]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}>
                    ADMIN PANEL
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Audit Log
                </Typography>
                <Typography variant="body2" color="text.secondary">{total} recorded admin actions</Typography>
            </Box>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5, alignItems: 'center' }}>
                {TARGET_TYPES.map(t => (
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
                        {t ? t.charAt(0).toUpperCase() + t.slice(1) + 's' : 'All'}
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
                                <TableCell>When</TableCell>
                                <TableCell>Admin</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>IP</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <CircularProgress sx={{ color: '#6366f1' }} />
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <HistoryIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography color="text.secondary">No admin actions recorded yet</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : logs.map(log => {
                                const colors = actionColor(log.action);
                                return (
                                    <TableRow key={log._id} sx={{ '&:hover': { bgcolor: '#fafafa' }, '& td': { borderBottom: '1px solid #f8fafc', py: 2 } }}>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                {dayjs(log.createdAt).format('MMM D, YYYY')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {dayjs(log.createdAt).format('h:mm A')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {log.adminName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {log.adminEmail}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={actionLabel(log.action)}
                                                size="small"
                                                sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700, fontSize: '0.7rem', borderRadius: '8px' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#334155', textTransform: 'capitalize' }}>
                                                {log.targetType}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                                                #{log.targetId.slice(-8).toUpperCase()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                {log.metadata && Object.keys(log.metadata).length > 0
                                                    ? Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(', ')
                                                    : '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                                                {log.ipAddress || '—'}
                                            </Typography>
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
        </Box>
    );
};

export default AuditLogs;
