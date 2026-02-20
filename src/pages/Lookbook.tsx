import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, Grid, Card, CardMedia, Chip, IconButton, Modal, Fade, Backdrop } from '@mui/material';
import { Favorite, FavoriteBorder, Search, Close, Instagram } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import './Lookbook.css';

const MotionCard = motion(Card);

interface StyleItem {
    id: number;
    image: string;
    category: string;
    title: string;
    likes: number;
    stylist: string;
}

const styles: StyleItem[] = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800&auto=format&fit=crop',
        category: 'Haircut',
        title: 'Modern Fade with Textured Top',
        likes: 124,
        stylist: 'Alex Johnson'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop',
        category: 'Beard',
        title: 'Sharp Line Up & Beard Sculpt',
        likes: 89,
        stylist: 'Mike Chen'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',
        category: 'Haircut',
        title: 'Classic Pompadour',
        likes: 215,
        stylist: 'Sarah Davis'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800&auto=format&fit=crop',
        category: 'Color',
        title: 'Platinum Blonde Process',
        likes: 156,
        stylist: 'Emma Wilson'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=800&auto=format&fit=crop',
        category: 'Beard',
        title: 'Full Beard Grooming',
        likes: 92,
        stylist: 'David Brown'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
        category: 'Facial',
        title: 'Rejuvenating Facial Treatment',
        likes: 67,
        stylist: 'Jessica Lee'
    }
];

const categories = ['All', 'Haircut', 'Beard', 'Color', 'Facial'];

const Lookbook: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedImage, setSelectedImage] = useState<StyleItem | null>(null);
    const [likedItems, setLikedItems] = useState<number[]>([]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleLike = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (likedItems.includes(id)) {
            setLikedItems(likedItems.filter(item => item !== id));
        } else {
            setLikedItems([...likedItems, id]);
        }
    };

    const filteredStyles = activeTab === 0
        ? styles
        : styles.filter(style => style.category === categories[activeTab]);

    return (
        <Box className="lookbook-page">
            <Box className="lookbook-hero">
                <Container maxWidth="lg">
                    <Typography variant="h1" className="hero-title">
                        Style Gallery
                    </Typography>
                    <Typography variant="h5" className="hero-subtitle">
                        Discover trending looks and find your next style inspiration
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    className="category-tabs"
                    sx={{ mb: 6 }}
                >
                    {categories.map((category, index) => (
                        <Tab key={index} label={category} className="category-tab" />
                    ))}
                </Tabs>

                <Grid container spacing={4}>
                    <AnimatePresence mode='popLayout'>
                        {filteredStyles.map((style) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={style.id}>
                                <MotionCard
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="style-item-card"
                                    onClick={() => setSelectedImage(style)}
                                >
                                    <Box className="card-image-wrapper">
                                        <CardMedia
                                            component="img"
                                            height="400"
                                            image={style.image}
                                            alt={style.title}
                                            className="card-image"
                                        />
                                        <div className="card-overlay">
                                            <IconButton
                                                className="like-button"
                                                onClick={(e) => handleLike(style.id, e)}
                                                sx={{ color: likedItems.includes(style.id) ? '#ef4444' : 'white' }}
                                            >
                                                {likedItems.includes(style.id) ? <Favorite /> : <FavoriteBorder />}
                                            </IconButton>
                                            <Box className="style-info">
                                                <Chip label={style.category} size="small" className="style-chip" />
                                                <Typography variant="h6" className="style-title">
                                                    {style.title}
                                                </Typography>
                                                <Typography variant="body2" className="style-stylist">
                                                    by {style.stylist}
                                                </Typography>
                                            </Box>
                                        </div>
                                    </Box>
                                </MotionCard>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            </Container>

            {/* Image Modal */}
            <Modal
                open={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        className: 'modal-backdrop'
                    }
                }}
            >
                <Fade in={!!selectedImage}>
                    <Box className="image-modal-content">
                        {selectedImage && (
                            <>
                                <IconButton
                                    onClick={() => setSelectedImage(null)}
                                    className="modal-close-btn"
                                >
                                    <Close />
                                </IconButton>
                                <img
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    className="modal-image"
                                />
                                <Box className="modal-details">
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{selectedImage.title}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="body1" color="text.secondary">Styled by {selectedImage.stylist}</Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton size="small" color="primary"><Instagram /></IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleLike(selectedImage.id, e)}
                                                color={likedItems.includes(selectedImage.id) ? 'error' : 'default'}
                                            >
                                                {likedItems.includes(selectedImage.id) ? <Favorite /> : <FavoriteBorder />}
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default Lookbook;
