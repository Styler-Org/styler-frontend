import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, Typography, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Chip, CircularProgress, Stack, Button,
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    initiated:  { bg: '#f1f5f9', color: '#475569' },
    processing: { bg: '#dbeafe', color: '#1e40af' },
    successful: { bg: '#dcfce7', color: '#166534' },
    failed:     { bg: '#fee2e2', color: '#991b1b' },
    refunded:   { bg: '#fef9c3', color: '#92400e' },
};

const statusLabel = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());

const PaymentsManagement: React.FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllPayments({
                status: statusFilter || undefined,
                page: page + 1,
                limit: rowsPerPage,
            });
            if (res.success && res.data) {
                setPayments(res.data.data);
                setTotal(res.data.pagination.total);
            }
        } catch {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page, rowsPerPage]);

    useEffect(() => { fetchPayments(); }, [fetchPayments]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}>
                    ADMIN PANEL
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">{total} total payments</Typography>
            </Box>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
                {['', 'initiated', 'processing', 'successful', 'failed', 'refunded'].map(s => (
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
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Method</TableCell>
                                <TableCell>Gateway</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <CircularProgress sx={{ color: '#6366f1' }} />
                                    </TableCell>
                                </TableRow>
                            ) : payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <PaymentIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography color="text.secondary">No payments found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : payments.map(payment => {
                                const colors = STATUS_COLORS[payment.status] ?? STATUS_COLORS.initiated;
                                return (
                                    <TableRow key={payment._id} sx={{ '&:hover': { bgcolor: '#fafafa' }, '& td': { borderBottom: '1px solid #f8fafc', py: 2 } }}>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b', bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '6px' }}>
                                                #{payment._id.slice(-8).toUpperCase()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                {payment.amount?.total != null ? `₹${payment.amount.total.toLocaleString('en-IN')}` : '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#334155', textTransform: 'capitalize' }}>
                                                {payment.method}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                                {payment.gateway}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                {dayjs(payment.createdAt).format('MMM D, YYYY')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {dayjs(payment.createdAt).format('h:mm A')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusLabel(payment.status)}
                                                size="small"
                                                sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700, fontSize: '0.7rem', borderRadius: '8px' }}
                                            />
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

export default PaymentsManagement;
