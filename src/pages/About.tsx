import React, { useRef } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Avatar, Chip } from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    CheckCircle as CheckIcon,
    People as PeopleIcon,
    Timer as TimerIcon,
    Star as StarIcon,
    Favorite as HeartIcon,
    Lightbulb as IdeaIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './About.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const About: React.FC = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);
    const stats = [
        { value: '20+', label: 'Salon Partners', icon: <PeopleIcon />, color: '#f59e0b' },
        { value: '5K+', label: 'Happy Clients', icon: <StarIcon />, color: '#14b8a6' },
        { value: '150+', label: 'Expert Stylists', icon: <TrophyIcon />, color: '#8b5cf6' },
        { value: '10K+', label: 'Appointments', icon: <CheckIcon />, color: '#4338ca' },
    ];

    const values = [
        {
            icon: <HeartIcon />,
            title: 'Customer First',
            description: 'Your satisfaction and comfort are our top priorities',
        },
        {
            icon: <TrophyIcon />,
            title: 'Excellence',
            description: 'We strive for perfection in every service we provide',
        },
        {
            icon: <IdeaIcon />,
            title: 'Innovation',
            description: 'Always adopting latest trends and technologies',
        },
        {
            icon: <SecurityIcon />,
            title: 'Trust & Safety',
            description: 'Your safety and hygiene are never compromised',
        },
    ];

    const team = [
        {
            name: 'Ankit Singh',
            role: 'Founder & CEO',
            avatar: 'R',
            description: '15+ years in grooming industry',
        },
        {
            name: 'Mohd Umar Siddiqui',
            role: 'Head of Operations',
            avatar: 'P',
            description: 'Operations excellence expert',
        },
        {
            name: 'Kunwar Prakash Singh',
            role: 'Technology Lead',
            avatar: 'A',
            description: 'Building seamless experiences',
        },
    ];

    const timeline = [
        { year: '2019', event: 'StylerApp Founded', description: 'Started with a vision to revolutionize salon bookings' },
        { year: '2020', event: '10 Salon Partners', description: 'Expanded to 10 premium salons across the city' },
        { year: '2022', event: '5000+ Appointments', description: 'Reached milestone of 5000 successful bookings' },
        { year: '2024', event: '20+ Locations', description: 'Now serving customers at 20+ locations' },
    ];

    return (
        <Box className="about-page">
            {/* Hero Section */}
            <Box className="about-hero" sx={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(/images/hero-salon.png)` }}>
                <Container maxWidth="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
                    >
                        <Chip
                            label="Our Story"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                mb: 3,
                                px: 1,
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        />
                        <Typography variant="h1" sx={{
                            color: 'white',
                            mb: 3,
                            fontSize: { xs: '2.5rem', md: '4.5rem' },
                            fontWeight: 800,
                            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}>
                            Redefining Grooming
                        </Typography>
                        <Typography variant="h5" sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 0,
                            maxWidth: 800,
                            mx: 'auto',
                            lineHeight: 1.6,
                            fontSize: { xs: '1.1rem', md: '1.4rem' }
                        }}>
                            We are seamless connecting you with the finest salons and stylists for an unmatched experience.
                        </Typography>
                    </MotionBox>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container
                maxWidth="lg"
                className="stats-section"
                sx={{
                    mt: -8,
                    position: 'relative',
                    zIndex: 10,
                    mb: 10,
                }}
            >
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 6, md: 3 }} key={index}>
                            <MotionCard
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="stat-card-about"
                                elevation={0}
                            >
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Box className="stat-icon" sx={{
                                        color: stat.color,
                                        mb: 2,
                                        bgcolor: `${stat.color}15`,
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto'
                                    }}>
                                        {React.cloneElement(stat.icon as React.ReactElement, { sx: { fontSize: 30 } })}
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Mission Section */}
            <Container maxWidth="lg" sx={{ py: 4, mb: 8 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                                OUR MISSION
                            </Typography>
                            <Typography variant="h2" gutterBottom sx={{ fontWeight: 800, mb: 3 }}>
                                Making Premium <br />Grooming Accessible
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                At StylerApp, we believe everyone deserves access to premium grooming services. We're on a mission
                                to connect clients with the best salons and stylists, making it easy to book, convenient to visit,
                                and delightful to experience.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                Through our platform, we're empowering local salons with digital tools while providing customers with transparency,
                                convenience, and confidence in their grooming choices.
                            </Typography>
                        </MotionBox>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            sx={{
                                height: { xs: 300, md: 500 },
                                borderRadius: '30px',
                                backgroundImage: 'url(/images/womens-styling.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                navigate: 'relative',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                overflow: 'hidden'
                            }}
                        >
                        </MotionBox>
                    </Grid>
                </Grid>
            </Container>

            {/* Values Section */}
            <Box sx={{ bgcolor: 'white', py: 10, position: 'relative' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" color="secondary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                            OUR CORE VALUES
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                            What Drives Us
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            The principles that guide everything we do at StylerApp.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {values.map((value, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <MotionCard
                                    className="value-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        borderRadius: '24px',
                                        bgcolor: '#f8fafc',
                                        border: '1px solid transparent',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <CardContent sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        p: 4
                                    }}>
                                        <Box
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: '20px',
                                                background: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 3,
                                                color: 'primary.main',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {React.cloneElement(value.icon as React.ReactElement, { sx: { fontSize: 32 } })}
                                        </Box>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                            {value.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Timeline Section */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                        HISTORY
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 800 }}>
                        Our Journey
                    </Typography>
                </Box>

                <Box
                    className="timeline-container"
                    sx={{
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: { xs: 20, md: '50%' },
                            transform: { xs: 'none', md: 'translateX(-50%)' },
                            width: 2,
                            height: '100%',
                            background: 'linear-gradient(180deg, #6366f1 0%, #4338ca 100%)',
                            opacity: 0.3
                        },
                    }}
                >
                    {timeline.map((item, index) => (
                        <MotionBox
                            key={index}
                            className="timeline-item"
                            initial={{ opacity: 0, x: 0, y: 30 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            sx={{
                                display: 'flex',
                                justifyContent: { xs: 'flex-start', md: index % 2 === 0 ? 'flex-start' : 'flex-end' },
                                mb: 6,
                                position: 'relative',
                                pl: { xs: 6, md: 0 }
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: { xs: 20, md: '50%' },
                                    top: 20,
                                    transform: 'translateX(-50%)',
                                    width: 16,
                                    height: 16,
                                    bgcolor: 'white',
                                    border: '4px solid #6366f1',
                                    borderRadius: '50%',
                                    zIndex: 2
                                }}
                            />

                            <Card
                                elevation={0}
                                sx={{
                                    width: { xs: '100%', md: '45%' },
                                    position: 'relative',
                                    borderRadius: '20px',
                                    bgcolor: '#f8fafc',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    mr: { xs: 0, md: index % 2 === 0 ? 4 : 0 },
                                    ml: { xs: 0, md: index % 2 !== 0 ? 4 : 0 },
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Chip
                                        label={item.year}
                                        color="primary"
                                        size="small"
                                        sx={{
                                            mb: 2,
                                            fontWeight: 700,
                                            borderRadius: '8px',
                                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                                            color: 'primary.main'
                                        }}
                                    />
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                        {item.event}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </MotionBox>
                    ))}
                </Box>
            </Container>

            {/* Team Section */}
            <Box sx={{ bgcolor: 'white', py: 10, borderTop: '1px solid', borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" color="secondary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                            LEADERSHIP
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                            Meet Our Team
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Passionate people building the future of grooming
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                        {team.map((member, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <MotionCard
                                    className="team-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    elevation={0}
                                    sx={{
                                        textAlign: 'center',
                                        p: 4,
                                        borderRadius: '24px',
                                        bgcolor: '#f8fafc',
                                        height: '100%'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            margin: '0 auto 1.5rem',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '3rem',
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                                            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                                        }}
                                    >
                                        {member.avatar}
                                    </Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                        {member.role}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {member.description}
                                    </Typography>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default About;
