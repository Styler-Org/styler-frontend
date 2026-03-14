/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    CircularProgress,
    Alert,
    Divider,
    Paper,
} from '@mui/material';
import { AccountBalanceWallet as WalletIcon, ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { appointmentService } from '../../services/appointmentService';
import { paymentService } from '../../services/paymentService';

const PayBill: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuthStore();
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [appointment, setAppointment] = useState<any>(null);
    const [billAmount, setBillAmount] = useState<string>('');
    const [useWallet, setUseWallet] = useState(true);

    // Initialize Razorpay
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!appointmentId) return;
            try {
                const response = await appointmentService.getAppointmentById(appointmentId);
                setAppointment(response.data);
                // Pre-fill bill amount if available from original booking estimate
                if (response.data?.pricing?.total) {
                    setBillAmount(response.data.pricing.total.toString());
                }
            } catch (err: any) {
                setError('Failed to fetch appointment details.');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointment();
    }, [appointmentId]);

    const calculateFinalAmount = () => {
        const baseAmount = parseFloat(billAmount) || 0;
        const penaltyAmount = user?.penaltyAmount || 0;
        let finalAmount = baseAmount + penaltyAmount;
        
        let discountApplied = 0;
        if (useWallet && user?.wallet?.balance) {
            discountApplied = Math.min(finalAmount, user.wallet.balance);
            finalAmount -= discountApplied;
        }
        
        return { baseAmount, penaltyAmount, discountApplied, finalAmount };
    };

    const handlePayBill = async () => {
        const { finalAmount } = calculateFinalAmount();
        if (!billAmount || parseFloat(billAmount) <= 0) {
            setError('Please enter a valid bill amount.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Initiate the "Pay Bill" logic using the new endpoint created in backend
            const response = await paymentService.payBill({
                appointmentId: appointmentId!,
                billAmount: parseFloat(billAmount),
                useWallet
            });

            const data = response.data;

            if (data.status === 'completed') {
                // If the wallet covered the full amount
                await refreshUser();
                navigate(`/payment/success?appointmentId=${appointmentId}`);
                return;
            }

            // Open Razorpay for the remaining amount
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
                amount: data.razorpayOrder.amount,
                currency: data.razorpayOrder.currency,
                name: 'Luzo Styler',
                description: 'Service Payment',
                order_id: data.razorpayOrder.id,
                handler: async function (paymentResponse: any) {
                    try {
                        await paymentService.verifyPayment(
                            data.razorpayOrder.id,
                            paymentResponse.razorpay_payment_id,
                            paymentResponse.razorpay_signature
                        );
                        await refreshUser();
                        navigate(`/payment/success?appointmentId=${appointmentId}`);
                    } catch (err) {
                        setError('Payment verification failed.');
                        navigate(`/payment/failed?appointmentId=${appointmentId}`);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone || '',
                },
                theme: { color: '#6366f1' },
                modal: {
                    ondismiss: function () {
                        setSubmitting(false);
                        setError('Payment cancelled.');
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (paymentError: any) {
                setError(paymentError.error.description);
                setSubmitting(false);
                navigate(`/payment/failed?appointmentId=${appointmentId}`);
            });
            rzp.open();

        } catch (err: any) {
            setError(err.response?.data?.message || 'Payment initiation failed.');
            setSubmitting(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;

    const { baseAmount, penaltyAmount, discountApplied, finalAmount } = calculateFinalAmount();

    return (
        <Container maxWidth="sm" sx={{ py: 12 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/appointments')} sx={{ mb: 2 }}>
                Back to Appointments
            </Button>
            
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
                <Box sx={{ bgcolor: 'primary.main', p: 4, color: 'white', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Pay at Salon</Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        {appointment?.salonId?.name || 'Complete your booking payment'}
                    </Typography>
                </Box>
                
                <CardContent sx={{ p: 4 }}>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Final Bill Amount (₹)</Typography>
                    <TextField
                        fullWidth
                        type="number"
                        placeholder="Enter the final bill amount from salon..."
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        required
                        sx={{ mb: 4 }}
                        InputProps={{
                            startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary', fontWeight: 700 }}>₹</Typography>
                        }}
                    />

                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 4, bgcolor: '#f8fafc' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography color="text.secondary">Bill Amount</Typography>
                            <Typography fontWeight={600}>₹{baseAmount.toFixed(2)}</Typography>
                        </Box>
                        
                        {penaltyAmount > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography color="error.main">Cancellation Penalties</Typography>
                                <Typography fontWeight={600} color="error.main">+ ₹{penaltyAmount.toFixed(2)}</Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {user?.wallet?.balance ? (
                            <Box 
                                onClick={() => setUseWallet(!useWallet)}
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    mb: 1.5,
                                    p: 1.5,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    bgcolor: useWallet ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    border: `1px solid ${useWallet ? '#10b981' : 'transparent'}`
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <WalletIcon sx={{ color: '#10b981' }} />
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, color: '#059669' }}>Apply Wallet Discount</Typography>
                                        <Typography variant="caption" color="text.secondary">Balance: ₹{user.wallet.balance}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {useWallet && <Typography fontWeight={600} color="#059669">- ₹{discountApplied.toFixed(2)}</Typography>}
                                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid', borderColor: useWallet ? '#10b981' : '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {useWallet && <CheckCircleIcon sx={{ fontSize: 20, color: '#10b981' }} />}
                                    </Box>
                                </Box>
                            </Box>
                        ) : null}

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Total Payable</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#4f46e5' }}>₹{finalAmount.toFixed(2)}</Typography>
                        </Box>
                    </Paper>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handlePayBill}
                        disabled={submitting || finalAmount < 0}
                        sx={{
                            py: 1.8,
                            borderRadius: '50px',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            boxShadow: '0 8px 25px -5px rgba(99, 102, 241, 0.5)',
                        }}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${finalAmount.toFixed(2)}`}
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default PayBill;
