import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import { ExpandMore, Email, Phone, LocationOn, Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { contactService } from '../services/contactService';
import { useToast } from '../context/ToastContext';
import './Contact.css';

const Contact: React.FC = () => {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await contactService.sendMessage(formState);
            success('Message sent successfully! We will get back to you soon.');
            setFormState({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to send message. Please try again later.';
            error(errorMessage);
            console.error('Contact form error:', err);
        } finally {
            setLoading(false);
        }
    };

    const faqs = [
        {
            question: "How do I book an appointment?",
            answer: "Booking is simple! Just go to the 'Find Salons' page, choose your preferred salon, select a service and stylist, and pick a time slot that works for you."
        },
        {
            question: "Can I cancel or reschedule my booking?",
            answer: "Yes, you can manage your appointments from the 'My Appointments' section in your profile. Cancellations made at least 24 hours in advance are fully refundable."
        },
        {
            question: "How do I pay for services?",
            answer: "We accept all major credit cards, debit cards, and digital wallets. Payment is securely processed at the time of booking to guarantee your slot."
        },
        {
            question: "Are the stylists verified?",
            answer: "Absolutely. All salons and stylists on Styler go through a rigorous vetting process to ensure they meet our high standards of quality and professionalism."
        }
    ];

    return (
        <Box className="contact-page">
            <Box className="contact-hero">
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h1" className="hero-title">
                        Get in Touch
                    </Typography>
                    <Typography variant="h5" className="hero-subtitle">
                        We'd love to hear from you. Here's how you can reach us.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -8, mb: 10, position: 'relative', zIndex: 5 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="contact-info-cards">
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                <Paper className="info-card">
                                    <div className="icon-box"><Email /></div>
                                    <Typography variant="h6">Email Us</Typography>
                                    <Typography variant="body2" color="text.secondary">support@styler.com</Typography>
                                    <Typography variant="body2" color="text.secondary">partners@styler.com</Typography>
                                </Paper>
                            </motion.div>
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <Paper className="info-card">
                                    <div className="icon-box"><Phone /></div>
                                    <Typography variant="h6">Call Us</Typography>
                                    <Typography variant="body2" color="text.secondary">+1 (555) 123-4567</Typography>
                                    <Typography variant="body2" color="text.secondary">Mon-Fri, 9am-6pm</Typography>
                                </Paper>
                            </motion.div>
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                <Paper className="info-card">
                                    <div className="icon-box"><LocationOn /></div>
                                    <Typography variant="h6">Visit Us</Typography>
                                    <Typography variant="body2" color="text.secondary">123 Style Avenue</Typography>
                                    <Typography variant="body2" color="text.secondary">New York, NY 10001</Typography>
                                </Paper>
                            </motion.div>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                            <Paper className="contact-form-paper">
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                                    Send us a Message
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Your Name"
                                                name="name"
                                                variant="outlined"
                                                value={formState.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                variant="outlined"
                                                value={formState.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Subject"
                                                name="subject"
                                                variant="outlined"
                                                value={formState.subject}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                name="message"
                                                multiline
                                                rows={4}
                                                variant="outlined"
                                                value={formState.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                                disabled={loading}
                                                sx={{
                                                    py: 1.5,
                                                    px: 4,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    boxShadow: '0 8px 20px rgba(67, 56, 202, 0.3)'
                                                }}
                                            >
                                                {loading ? 'Sending...' : 'Send Message'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 10 }}>
                    <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 6 }}>
                        Frequently Asked Questions
                    </Typography>
                    <Grid container justifyContent="center">
                        <Grid size={{ xs: 12, md: 8 }}>
                            {faqs.map((faq, index) => (
                                <Accordion key={index} sx={{
                                    mb: 2,
                                    borderRadius: '16px !important',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                    '&:before': { display: 'none' }
                                }}>
                                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3, py: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default Contact;
