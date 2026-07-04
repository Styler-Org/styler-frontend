import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box, Container, Typography, Button, TextField, CircularProgress,
    Grid, alpha, LinearProgress,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    ContentCut as ScissorsIcon,
    Spa as SpaIcon,
    MedicalServices as DermIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    ArrowForward as NextIcon,
    ArrowBack as BackIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from '../components/common/Logo';
import { onboardService, OnboardTokenData, ServicePayload, OperatingHoursPayload } from '../services/onboardService';
import authService from '../services/authService';
import { useAuthStore } from '../stores/authStore';

const MotionBox = motion(Box);
const ease = [0.25, 0.1, 0.25, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

// ── Service templates per business type ─────────────────────────────────────

type BizType = 'salon' | 'spa' | 'dermatology';

interface ServiceTemplate {
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    gender: 'male' | 'female' | 'unisex';
}

const SERVICE_TEMPLATES: Record<BizType, ServiceTemplate[]> = {
    salon: [
        { name: "Men's Haircut", description: 'Professional haircut for men', category: 'Hair', price: 300, duration: 30, gender: 'male' },
        { name: "Women's Haircut", description: 'Haircut with styling', category: 'Hair', price: 600, duration: 45, gender: 'female' },
        { name: 'Beard Trim & Style', description: 'Beard grooming and shaping', category: 'Hair', price: 150, duration: 20, gender: 'male' },
        { name: 'Hair Colour', description: 'Full hair colouring service', category: 'Hair', price: 1500, duration: 90, gender: 'unisex' },
        { name: 'Blow Dry & Styling', description: 'Professional blow dry finish', category: 'Hair', price: 400, duration: 30, gender: 'female' },
        { name: 'Smoothening / Rebonding', description: 'Chemical hair straightening', category: 'Hair', price: 3000, duration: 120, gender: 'female' },
        { name: 'Head Massage', description: 'Relaxing scalp and head massage', category: 'Massage', price: 300, duration: 20, gender: 'unisex' },
    ],
    spa: [
        { name: 'Full Body Massage', description: 'Deep relaxation full body massage', category: 'Massage', price: 1800, duration: 60, gender: 'unisex' },
        { name: 'Swedish Massage', description: 'Gentle relaxing Swedish technique', category: 'Massage', price: 2000, duration: 60, gender: 'unisex' },
        { name: 'Head & Neck Massage', description: 'Targeted stress relief massage', category: 'Massage', price: 700, duration: 30, gender: 'unisex' },
        { name: 'Gold Facial', description: 'Luxury gold anti-aging facial', category: 'Facial', price: 1500, duration: 60, gender: 'female' },
        { name: 'Full Body Waxing', description: 'Complete body hair removal', category: 'Waxing', price: 2500, duration: 90, gender: 'female' },
        { name: 'Manicure', description: 'Complete nail care for hands', category: 'Nail Care', price: 500, duration: 30, gender: 'unisex' },
        { name: 'Pedicure', description: 'Complete nail care for feet', category: 'Nail Care', price: 600, duration: 45, gender: 'unisex' },
    ],
    dermatology: [
        { name: 'Skin Consultation', description: 'One-on-one skin assessment', category: 'Consultation', price: 800, duration: 30, gender: 'unisex' },
        { name: 'HydraFacial', description: 'Advanced multi-step facial treatment', category: 'Facial', price: 3000, duration: 60, gender: 'unisex' },
        { name: 'Chemical Peel', description: 'Exfoliating chemical peel', category: 'Treatment', price: 2500, duration: 45, gender: 'unisex' },
        { name: 'Laser Hair Removal', description: 'Permanent hair reduction', category: 'Laser', price: 5000, duration: 60, gender: 'unisex' },
        { name: 'Acne Treatment', description: 'Targeted acne and scar treatment', category: 'Treatment', price: 1500, duration: 45, gender: 'unisex' },
        { name: 'Anti-Ageing PRP', description: 'Platelet-rich plasma therapy', category: 'Treatment', price: 8000, duration: 60, gender: 'unisex' },
    ],
};

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
type Day = typeof DAYS[number];

const DAY_LABELS: Record<Day, string> = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

// ── Types ────────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'invalid' | 'phone' | 'otp' | 'wizard' | 'submitting' | 'done';

interface SelectedService extends ServiceTemplate {
    selected: boolean;
    editPrice: string;
    editDuration: string;
}

interface DayHours {
    day: Day;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
}

// ── Shared input style ───────────────────────────────────────────────────────

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.04)',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1' },
        '& input, & textarea': { color: 'white', backgroundColor: 'transparent' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
};

// ── Main component ───────────────────────────────────────────────────────────

const Onboard: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const token = params.get('token') || '';

    // Auth phase state
    const [phase, setPhase] = useState<Phase>('loading');
    const [tokenData, setTokenData] = useState<OnboardTokenData | null>(null);
    const [otp, setOtp] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Wizard step state (1-4)
    const [step, setStep] = useState(1);

    // Step 1: Business type
    const [bizType, setBizType] = useState<BizType | null>(null);

    // Step 2: Business details
    const [details, setDetails] = useState({
        businessName: '', displayName: '', description: '',
        phone: '', email: '', street: '', city: '', state: '', pincode: '',
    });

    // Step 3: Services
    const [services, setServices] = useState<SelectedService[]>([]);

    // Step 4: Operating hours
    const [hours, setHours] = useState<DayHours[]>(
        DAYS.map(day => ({
            day,
            isOpen: day !== 'sunday',
            openTime: '09:00',
            closeTime: '20:00',
        }))
    );

    // ── Validate token on mount ──────────────────────────────────────────

    useEffect(() => {
        if (!token) { setPhase('invalid'); return; }
        onboardService.validateToken(token)
            .then(data => {
                setTokenData(data);
                setDetails(prev => ({
                    ...prev,
                    businessName: data.businessName,
                    displayName: data.businessName,
                    phone: data.phone,
                    email: data.email,
                    city: data.city,
                }));
                setPhase('phone');
            })
            .catch(() => setPhase('invalid'));
    }, [token]);

    // Load service templates when bizType is selected
    useEffect(() => {
        if (!bizType) return;
        setServices(
            SERVICE_TEMPLATES[bizType].map(t => ({
                ...t,
                selected: true,
                editPrice: String(t.price),
                editDuration: String(t.duration),
            }))
        );
    }, [bizType]);

    // ── Auth handlers ────────────────────────────────────────────────────

    const handleSendOtp = async () => {
        if (!tokenData) return;
        setAuthLoading(true);
        try {
            await authService.requestOtp({ phone: tokenData.phone });
            toast.success('OTP sent to your phone');
            setPhase('otp');
        } catch {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!tokenData || otp.length < 6) {
            toast.error('Enter the 6-digit OTP');
            return;
        }
        setAuthLoading(true);
        try {
            const res = await authService.verifyOtp({
                phone: tokenData.phone,
                otp,
            });
            if (res.success && res.data) {
                const { user, tokens } = res.data as any;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Phone verified!');
                setPhase('wizard');
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.error?.message || 'Invalid OTP');
        } finally {
            setAuthLoading(false);
        }
    };

    // ── Wizard submit ────────────────────────────────────────────────────

    const handleSubmit = useCallback(async () => {
        if (!bizType) return;
        setPhase('submitting');

        const selectedServices: ServicePayload[] = services
            .filter(s => s.selected)
            .map(s => ({
                name: s.name,
                description: s.description,
                category: s.category,
                price: Math.max(1, parseInt(s.editPrice, 10) || s.price),
                duration: Math.max(15, parseInt(s.editDuration, 10) || s.duration),
                gender: s.gender,
                isActive: true,
            }));

        const operatingHours: OperatingHoursPayload[] = hours.map(h => ({
            day: h.day,
            isOpen: h.isOpen,
            slots: h.isOpen ? [{ start: h.openTime, end: h.closeTime }] : [],
        }));

        try {
            // 1 — Create salon
            const salon = await onboardService.createSalon({
                businessName: details.businessName,
                displayName: details.displayName || details.businessName,
                businessType: bizType,
                description: details.description || `${details.businessName} — your Styler partner`,
                phone: details.phone,
                email: details.email,
                address: {
                    street: details.street || details.city,
                    city: details.city,
                    state: details.state || details.city,
                    pincode: details.pincode || '000000',
                    latitude: 0,
                    longitude: 0,
                },
            });

            // 2 — Add services
            if (selectedServices.length > 0) {
                await onboardService.addServices(salon._id || salon.id, selectedServices);
            }

            // 3 — Set operating hours
            await onboardService.setOperatingHours(salon._id || salon.id, operatingHours);

            // 4 — Consume the onboard token (single-use)
            await onboardService.consumeToken(token).catch(() => {
                // Non-fatal if this fails — token will expire naturally
            });

            setPhase('done');
        } catch (err: any) {
            const message = err?.response?.data?.error?.message || 'Something went wrong. Please try again.';
            toast.error(message);
            setPhase('wizard');
        }
    }, [bizType, services, hours, details, token]);

    // ── Render helpers ───────────────────────────────────────────────────

    const progress = phase === 'wizard' ? (step / 4) * 100 : 0;

    const canProceed = () => {
        if (step === 1) return bizType !== null;
        if (step === 2) return !!(details.businessName && details.phone && details.email && details.city);
        if (step === 3) return services.some(s => s.selected);
        return true;
    };

    // ── Page shell ───────────────────────────────────────────────────────

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#09090b', color: 'white' }}>
            {/* Header */}
            <Box sx={{
                position: 'sticky', top: 0, zIndex: 10, px: { xs: 2, md: 6 }, height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Logo variant="light" size="small" />
                {phase === 'wizard' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                            Step {step} of 4
                        </Typography>
                        <Box sx={{ width: 120 }}>
                            <LinearProgress variant="determinate" value={progress}
                                sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>

            <Container maxWidth="sm" sx={{ py: 6 }}>
                <AnimatePresence mode="wait">

                    {/* ── LOADING ── */}
                    {phase === 'loading' && (
                        <MotionBox key="loading" variants={fadeUp} initial="hidden" animate="show"
                            sx={{ textAlign: 'center', py: 10 }}>
                            <CircularProgress sx={{ color: '#6366f1' }} />
                            <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                                Validating your invite link…
                            </Typography>
                        </MotionBox>
                    )}

                    {/* ── INVALID TOKEN ── */}
                    {phase === 'invalid' && (
                        <MotionBox key="invalid" variants={fadeUp} initial="hidden" animate="show"
                            sx={{ textAlign: 'center', py: 10 }}>
                            <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>⏰</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Link expired or invalid</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', mb: 3, lineHeight: 1.7 }}>
                                This onboarding link has expired (48-hour limit) or has already been used.<br />
                                Email us to get a fresh one.
                            </Typography>
                            <Button component="a" href="mailto:partners@stylerapp.com" variant="outlined"
                                sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '50px', textTransform: 'none' }}>
                                Contact partners@stylerapp.com
                            </Button>
                        </MotionBox>
                    )}

                    {/* ── PHONE CONFIRMATION ── */}
                    {phase === 'phone' && tokenData && (
                        <MotionBox key="phone" variants={fadeUp} initial="hidden" animate="show">
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
                                Welcome, {tokenData.ownerName.split(' ')[0]}! 👋
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', mb: 4, lineHeight: 1.7 }}>
                                You've been approved to join Styler as a partner. Let's get <strong style={{ color: 'white' }}>{tokenData.businessName}</strong> live on the platform.
                            </Typography>

                            <Box sx={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', p: 3, mb: 4 }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#818cf8', mb: 1.5 }}>
                                    Verify your identity
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', mb: 2.5, lineHeight: 1.6 }}>
                                    We'll send a 6-digit OTP to your registered number:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography sx={{ fontSize: '1rem' }}>📱</Typography>
                                    </Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}>
                                        {tokenData.phone}
                                    </Typography>
                                </Box>
                                <Button fullWidth onClick={handleSendOtp} disabled={authLoading} variant="contained"
                                    sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, textTransform: 'none', fontSize: '0.9375rem', bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}>
                                    {authLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Send OTP'}
                                </Button>
                            </Box>
                        </MotionBox>
                    )}

                    {/* ── OTP VERIFICATION ── */}
                    {phase === 'otp' && tokenData && (
                        <MotionBox key="otp" variants={fadeUp} initial="hidden" animate="show">
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
                                Enter OTP
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', mb: 4, lineHeight: 1.7 }}>
                                We sent a 6-digit code to <strong style={{ color: 'white' }}>{tokenData.phone}</strong>
                            </Typography>

                            <TextField
                                fullWidth label="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                                sx={{ ...fieldSx, mb: 2 }}
                                onKeyDown={e => { if (e.key === 'Enter') handleVerifyOtp(); }}
                            />
                            <Button fullWidth onClick={handleVerifyOtp} disabled={authLoading || otp.length < 6} variant="contained"
                                sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, textTransform: 'none', fontSize: '0.9375rem', bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}>
                                {authLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Verify & Continue'}
                            </Button>
                            <Button fullWidth onClick={() => setPhase('phone')}
                                sx={{ mt: 1.5, color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontSize: '0.8125rem' }}>
                                ← Change number
                            </Button>
                        </MotionBox>
                    )}

                    {/* ── WIZARD ── */}
                    {phase === 'wizard' && (
                        <MotionBox key={`wizard-${step}`} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}>

                            {/* STEP 1 — Business Type */}
                            {step === 1 && (
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
                                        What type of business?
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', mb: 4 }}>
                                        This sets the service templates and how you appear in search.
                                    </Typography>

                                    {([
                                        { type: 'salon' as BizType, icon: <ScissorsIcon sx={{ fontSize: 32 }} />, label: 'Salon / Barbershop', desc: 'Haircuts, colouring, styling, beard grooming' },
                                        { type: 'spa' as BizType, icon: <SpaIcon sx={{ fontSize: 32 }} />, label: 'Spa & Wellness', desc: 'Massages, facials, waxing, nail care, body treatments' },
                                        { type: 'dermatology' as BizType, icon: <DermIcon sx={{ fontSize: 32 }} />, label: 'Dermatology / Skin Clinic', desc: 'Skin consultations, laser, facials, chemical peels' },
                                    ] as const).map(({ type, icon, label, desc }) => {
                                        const selected = bizType === type;
                                        return (
                                            <Box key={type} onClick={() => setBizType(type)} sx={{
                                                display: 'flex', alignItems: 'flex-start', gap: 2, p: 2.5, mb: 1.5,
                                                borderRadius: '16px', cursor: 'pointer',
                                                border: `2px solid ${selected ? '#6366f1' : 'rgba(255,255,255,0.07)'}`,
                                                bgcolor: selected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': { borderColor: selected ? '#6366f1' : 'rgba(255,255,255,0.2)', bgcolor: selected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)' },
                                            }}>
                                                <Box sx={{ color: selected ? '#818cf8' : 'rgba(255,255,255,0.4)', mt: 0.25 }}>{icon}</Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontWeight: 700, mb: 0.25 }}>{label}</Typography>
                                                    <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</Typography>
                                                </Box>
                                                {selected && <CheckIcon sx={{ color: '#6366f1', mt: 0.25 }} />}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}

                            {/* STEP 2 — Business Details */}
                            {step === 2 && (
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
                                        Business details
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', mb: 3 }}>
                                        This is what customers will see on your Styler profile.
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {[
                                            { key: 'businessName', label: 'Business Name *', fullWidth: true },
                                            { key: 'displayName', label: 'Display Name (on app)', fullWidth: true },
                                            { key: 'description', label: 'About your business', fullWidth: true, multiline: true, rows: 3 },
                                            { key: 'phone', label: 'Contact Phone *', fullWidth: false },
                                            { key: 'email', label: 'Business Email *', fullWidth: false },
                                            { key: 'street', label: 'Street Address', fullWidth: true },
                                            { key: 'city', label: 'City *', fullWidth: false },
                                            { key: 'state', label: 'State', fullWidth: false },
                                            { key: 'pincode', label: 'Pincode', fullWidth: false },
                                        ].map(field => (
                                            <Grid key={field.key} size={field.fullWidth ? 12 : 6}>
                                                <TextField
                                                    fullWidth
                                                    label={field.label}
                                                    value={(details as any)[field.key]}
                                                    onChange={e => setDetails(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    multiline={field.multiline}
                                                    rows={field.rows}
                                                    sx={fieldSx}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Typography sx={{ mt: 2, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
                                        📍 Exact map coordinates can be set from your dashboard after setup to enable the "Nearby" feature.
                                    </Typography>
                                </Box>
                            )}

                            {/* STEP 3 — Services */}
                            {step === 3 && (
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
                                        Services
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', mb: 3 }}>
                                        We've pre-filled suggestions for your business type. Toggle, price, and customise — add more from your dashboard any time.
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                            {services.filter(s => s.selected).length} of {services.length} selected
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button size="small" onClick={() => setServices(s => s.map(x => ({ ...x, selected: true })))}
                                                sx={{ fontSize: '0.7rem', color: '#818cf8', textTransform: 'none', minWidth: 0 }}>All</Button>
                                            <Button size="small" onClick={() => setServices(s => s.map(x => ({ ...x, selected: false })))}
                                                sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'none', minWidth: 0 }}>None</Button>
                                        </Box>
                                    </Box>

                                    {services.map((svc, idx) => (
                                        <Box key={idx} sx={{
                                            p: 2, mb: 1, borderRadius: '12px',
                                            border: `1px solid ${svc.selected ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                            bgcolor: svc.selected ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
                                            transition: 'all 0.15s ease',
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: svc.selected ? 1.5 : 0 }}>
                                                <Box onClick={() => setServices(s => s.map((x, i) => i === idx ? { ...x, selected: !x.selected } : x))}
                                                    sx={{
                                                        width: 20, height: 20, borderRadius: '6px', cursor: 'pointer', flexShrink: 0,
                                                        border: `2px solid ${svc.selected ? '#6366f1' : 'rgba(255,255,255,0.2)'}`,
                                                        bgcolor: svc.selected ? '#6366f1' : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                    {svc.selected && <CheckIcon sx={{ fontSize: 14, color: 'white' }} />}
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{svc.name}</Typography>
                                                    <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{svc.category}</Typography>
                                                </Box>
                                            </Box>

                                            {svc.selected && (
                                                <Grid container spacing={1.5}>
                                                    <Grid size={6}>
                                                        <TextField
                                                            fullWidth size="small" label="Price (₹)"
                                                            value={svc.editPrice}
                                                            onChange={e => setServices(s => s.map((x, i) => i === idx ? { ...x, editPrice: e.target.value } : x))}
                                                            inputProps={{ inputMode: 'numeric' }}
                                                            sx={{ ...fieldSx, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }}
                                                        />
                                                    </Grid>
                                                    <Grid size={6}>
                                                        <TextField
                                                            fullWidth size="small" label="Duration (min)"
                                                            value={svc.editDuration}
                                                            onChange={e => setServices(s => s.map((x, i) => i === idx ? { ...x, editDuration: e.target.value } : x))}
                                                            inputProps={{ inputMode: 'numeric' }}
                                                            sx={{ ...fieldSx, '& .MuiInputBase-input': { fontSize: '0.8125rem' } }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* STEP 4 — Operating Hours */}
                            {step === 4 && (
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
                                        Operating hours
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', mb: 1.5 }}>
                                        Set when your business is open. You can update this from your dashboard anytime.
                                    </Typography>

                                    {/* Quick preset */}
                                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                                        {[
                                            { label: 'Mon–Sat 9am–8pm', fn: () => setHours(h => h.map(d => ({ ...d, isOpen: d.day !== 'sunday', openTime: '09:00', closeTime: '20:00' }))) },
                                            { label: 'Mon–Sun 10am–9pm', fn: () => setHours(h => h.map(d => ({ ...d, isOpen: true, openTime: '10:00', closeTime: '21:00' }))) },
                                            { label: 'Mon–Fri only', fn: () => setHours(h => h.map(d => ({ ...d, isOpen: !['saturday', 'sunday'].includes(d.day) }))) },
                                        ].map(({ label, fn }) => (
                                            <Button key={label} size="small" onClick={fn} variant="outlined"
                                                sx={{ fontSize: '0.72rem', textTransform: 'none', borderRadius: '8px', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#6366f1', color: '#818cf8' } }}>
                                                {label}
                                            </Button>
                                        ))}
                                    </Box>

                                    {hours.map((h, idx) => (
                                        <Box key={h.day} sx={{
                                            display: 'flex', alignItems: 'center', gap: 2, mb: 1,
                                            p: 1.5, borderRadius: '12px',
                                            border: `1px solid ${h.isOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                                            bgcolor: h.isOpen ? 'rgba(255,255,255,0.03)' : 'transparent',
                                            opacity: h.isOpen ? 1 : 0.5, transition: 'all 0.2s ease',
                                        }}>
                                            {/* Toggle */}
                                            <Box onClick={() => setHours(hh => hh.map((x, i) => i === idx ? { ...x, isOpen: !x.isOpen } : x))}
                                                sx={{
                                                    width: 36, height: 20, borderRadius: '10px', cursor: 'pointer', flexShrink: 0,
                                                    bgcolor: h.isOpen ? '#6366f1' : 'rgba(255,255,255,0.1)',
                                                    position: 'relative', transition: 'bgcolor 0.2s',
                                                }}>
                                                <Box sx={{
                                                    position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', bgcolor: 'white',
                                                    transition: 'left 0.2s ease', left: h.isOpen ? 18 : 2,
                                                }} />
                                            </Box>

                                            <Typography sx={{ width: 36, fontSize: '0.8125rem', fontWeight: 600, color: h.isOpen ? 'white' : 'rgba(255,255,255,0.4)' }}>
                                                {DAY_LABELS[h.day]}
                                            </Typography>

                                            {h.isOpen ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                                    <input type="time" value={h.openTime}
                                                        onChange={e => setHours(hh => hh.map((x, i) => i === idx ? { ...x, openTime: e.target.value } : x))}
                                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: 'white', fontSize: 13, outline: 'none' }}
                                                    />
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>to</Typography>
                                                    <input type="time" value={h.closeTime}
                                                        onChange={e => setHours(hh => hh.map((x, i) => i === idx ? { ...x, closeTime: e.target.value } : x))}
                                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: 'white', fontSize: 13, outline: 'none' }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.25)' }}>Closed</Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* Navigation */}
                            <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                                {step > 1 && (
                                    <Button onClick={() => setStep(s => s - 1)} startIcon={<BackIcon />} variant="outlined"
                                        sx={{ flex: 1, py: 1.5, borderRadius: '12px', fontWeight: 600, textTransform: 'none', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                                        Back
                                    </Button>
                                )}
                                {step < 4 ? (
                                    <Button onClick={() => setStep(s => s + 1)} endIcon={<NextIcon />} variant="contained"
                                        disabled={!canProceed()}
                                        sx={{ flex: 1, py: 1.5, borderRadius: '12px', fontWeight: 700, textTransform: 'none', bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, '&:disabled': { bgcolor: 'rgba(99,102,241,0.3)', color: 'rgba(255,255,255,0.4)' } }}>
                                        Continue
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmit} variant="contained"
                                        sx={{ flex: 1, py: 1.75, borderRadius: '12px', fontWeight: 700, textTransform: 'none', fontSize: '1rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
                                        Go Live on Styler 🚀
                                    </Button>
                                )}
                            </Box>
                        </MotionBox>
                    )}

                    {/* ── SUBMITTING ── */}
                    {phase === 'submitting' && (
                        <MotionBox key="submitting" variants={fadeUp} initial="hidden" animate="show"
                            sx={{ textAlign: 'center', py: 10 }}>
                            <CircularProgress size={48} sx={{ color: '#6366f1', mb: 2 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Setting up your business…</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                                Creating your salon profile and services
                            </Typography>
                        </MotionBox>
                    )}

                    {/* ── DONE ── */}
                    {phase === 'done' && (
                        <MotionBox key="done" variants={fadeUp} initial="hidden" animate="show"
                            sx={{ textAlign: 'center', py: 8 }}>
                            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                                <CheckIcon sx={{ fontSize: 40, color: '#10b981' }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                                You're live! 🎉
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4, lineHeight: 1.7, maxWidth: 420, mx: 'auto' }}>
                                <strong style={{ color: 'white' }}>{details.businessName}</strong> is now on Styler. Customers can discover and book with you. Head to your dashboard to manage bookings, update services, and track revenue.
                            </Typography>
                            <Button onClick={() => navigate('/salon-owner/dashboard')} variant="contained" size="large"
                                sx={{ px: 5, py: 1.75, borderRadius: '50px', fontWeight: 700, textTransform: 'none', fontSize: '1rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                                Go to Dashboard →
                            </Button>
                        </MotionBox>
                    )}

                </AnimatePresence>
            </Container>
        </Box>
    );
};

export default Onboard;
