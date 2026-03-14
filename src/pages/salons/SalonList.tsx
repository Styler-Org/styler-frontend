import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Chip,
    InputAdornment,
    ToggleButtonGroup,
    ToggleButton,
    Snackbar,
    IconButton,
    Alert,
} from '@mui/material';
import {
    Search as SearchIcon,
    MyLocation as MyLocationIcon,
    Clear as ClearIcon,
    GridView as GridViewIcon,
    ViewList as ViewListIcon,
    Map as MapIcon,
    Sort as SortIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { salonService } from '../../services/salonService';
import SalonCard from '../../components/salon/SalonCard';
import SalonCardSkeleton from '../../components/common/SalonCardSkeleton';
import Map, { MarkerData } from '../../components/Map';
import { Salon } from '../../types';
import { useGeolocation, calculateDistance, formatDistance } from '../../hooks/useGeolocation';
import './SalonList.css';

const MotionBox = motion(Box);

type SortOption = 'nearest' | 'rating' | 'reviews' | 'name';
type ViewMode = 'grid' | 'list' | 'map';

interface SalonWithDistance extends Salon {
    distance?: number;
}

const SalonList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialCategory = location.state?.category || '';

    const [searchQuery, setSearchQuery] = useState('');
    const [countryFilter, setCountryFilter] = useState('India');
    const [cityFilter, setCityFilter] = useState('Lucknow');
    const [placeFilter, setPlaceFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
    const [sortBy, setSortBy] = useState<SortOption>('rating');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [showLocationAlert, setShowLocationAlert] = useState(false);

    // Sync category filter when location state changes (e.g., clicking navbar links while already on /salons)
    useEffect(() => {
        if (location.state && location.state.category !== undefined) {
            setCategoryFilter(location.state.category);
        } else if (location.state === null) {
            // Optional: reset category if navigating explicitly without state
            // setCategoryFilter(''); 
        }
    }, [location.state]);

    const { coordinates, error: locationError, loading: locationLoading, getCurrentPosition } = useGeolocation();

    // Places in Lucknow mapping
    const lucknowPlaces = [
        'Gomti Nagar',
        'Aliganj',
        'Hazratganj',
        'Indira Nagar',
        'Aminabad',
        'Chowk',
        'Mahanagar',
    ];

    const serviceCategories = [
        'Salons',
        'Dermatologists',
        'Wellness & Spa',
        'Nails & Lashes'
    ];

    const { data, isLoading } = useQuery({
        queryKey: ['salons', searchQuery, placeFilter, cityFilter, categoryFilter, sortBy],
        queryFn: () => {
            const combinedSearch = [searchQuery, placeFilter].filter(Boolean).join(' ');
            return salonService.searchSalons({
                searchText: combinedSearch || undefined,
                city: cityFilter,
                serviceCategory: categoryFilter || undefined,
                sortBy: sortBy !== 'nearest' ? sortBy : undefined // Don't send 'nearest' to API
            });
        },
    });

    const salons: Salon[] = (data?.data && Array.isArray(data.data)) ? data.data : [];

    // Add distance to salons for "nearest" sorting (client-side for geolocation)
    const processedSalons = useMemo(() => {
        let processed: SalonWithDistance[] = salons.map(salon => ({
            ...salon,
            distance: coordinates
                ? calculateDistance(
                    coordinates.latitude,
                    coordinates.longitude,
                    salon.address.location?.coordinates[1] || 0, // latitude
                    salon.address.location?.coordinates[0] || 0  // longitude
                )
                : undefined,
        }));

        // Only sort on client-side for "nearest" (requires user location)
        if (sortBy === 'nearest' && coordinates) {
            processed = processed.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }
        // All other sorting is handled by the API

        return processed;
    }, [salons, coordinates, sortBy]);

    const mapMarkers: MarkerData[] = useMemo(() => {
        return processedSalons
            .filter(salon => salon.address?.location?.coordinates)
            .map(salon => ({
                id: salon._id,
                lat: salon.address.location!.coordinates[1],
                lng: salon.address.location!.coordinates[0],
                title: salon.name,
                onClick: () => navigate(`/salons/${salon._id}`),
            }));
    }, [processedSalons, navigate]);

    const handleFindNearest = () => {
        getCurrentPosition();
        if (coordinates) {
            setSortBy('nearest');
            setShowLocationAlert(true);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setPlaceFilter('');
        setCategoryFilter('');
    };

    const hasActiveFilters = searchQuery || placeFilter || categoryFilter;

    return (
        <Box className="salon-list-page">
            {/* Hero Section */}
            <Box className="salon-list-hero" sx={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(/images/hero-salon.png)` }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h1" className="salon-list-title" gutterBottom>
                            Find Your Perfect Salon
                        </Typography>
                        <Typography variant="h5" className="salon-list-subtitle" sx={{ mb: 6 }}>
                            Discover top-rated salons near you and book your next appointment
                        </Typography>

                        {/* Search Bar in Hero */}
                        <Box className="hero-search-bar" sx={{ maxWidth: 700, mx: 'auto', position: 'relative' }}>
                            <TextField
                                fullWidth
                                placeholder="Search specifically for salons, services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'white',
                                        borderRadius: '50px !important',
                                        height: 64,
                                        fontSize: '1.1rem',
                                        pl: 3,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                        '& fieldset': { border: 'none' },
                                        '&:hover fieldset': { border: 'none' },
                                        '&.Mui-focused fieldset': { border: 'none' },
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ mr: 1 }}>
                                            {searchQuery && (
                                                <IconButton onClick={() => setSearchQuery('')} edge="end" sx={{ mr: 1 }}>
                                                    <ClearIcon />
                                                </IconButton>
                                            )}
                                            <Button
                                                variant="contained"
                                                onClick={handleFindNearest}
                                                size="large"
                                                className="near-me-btn"
                                                startIcon={locationLoading ? null : <MyLocationIcon />}
                                                disabled={locationLoading}
                                            >
                                                {locationLoading ? 'Locating...' : 'Near Me'}
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </MotionBox>
                </Container>
            </Box>

            {/* Filter Bar */}
            <Box className="filter-bar-sticky">
                <Container maxWidth="lg">
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Box className="filter-scroll-wrapper">
                                <Box className="filter-scroll-container">
                                    <FormControl size="small" className="premium-select" sx={{ minWidth: 120 }}>
                                        <InputLabel>Country</InputLabel>
                                        <Select
                                            value={countryFilter}
                                            disabled
                                            label="Country"
                                        >
                                            <MenuItem value="India">India</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" className="premium-select" sx={{ minWidth: 120 }}>
                                        <InputLabel>City</InputLabel>
                                        <Select
                                            value={cityFilter}
                                            disabled
                                            label="City"
                                        >
                                            <MenuItem value="Lucknow">Lucknow</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" className="premium-select" sx={{ minWidth: 180 }}>
                                        <InputLabel>Place in Lucknow</InputLabel>
                                        <Select
                                            value={placeFilter}
                                            onChange={(e) => setPlaceFilter(e.target.value)}
                                            label="Place in Lucknow"
                                        >
                                            <MenuItem value="">All Places</MenuItem>
                                            {lucknowPlaces.map((place) => (
                                                <MenuItem key={place} value={place}>{place}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" className="premium-select" sx={{ minWidth: 180 }}>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            label="Category"
                                        >
                                            <MenuItem value="">All Categories</MenuItem>
                                            {serviceCategories.map((cat) => (
                                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" className="premium-select" sx={{ minWidth: 180 }}>
                                        <InputLabel>Sort By</InputLabel>
                                        <Select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            label="Sort By"
                                            startAdornment={<SortIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />}
                                        >
                                            <MenuItem value="rating">Highest Rated</MenuItem>
                                            <MenuItem value="reviews">Most Reviews</MenuItem>
                                            <MenuItem value="name">Name (A-Z)</MenuItem>
                                            {coordinates && <MenuItem value="nearest">Nearest First</MenuItem>}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {isLoading ? 'Searching...' : `${processedSalons.length} results`}
                            </Typography>
                            <Box className="view-mode-container">
                                <ToggleButtonGroup
                                    value={viewMode}
                                    exclusive
                                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                                    size="small"
                                    sx={{ p: 0.5 }}
                                >
                                    <ToggleButton value="grid" className="view-mode-toggle">
                                        <GridViewIcon fontSize="small" />
                                    </ToggleButton>
                                    <ToggleButton value="list" className="view-mode-toggle">
                                        <ViewListIcon fontSize="small" />
                                    </ToggleButton>
                                    <ToggleButton value="map" className="view-mode-toggle">
                                        <MapIcon fontSize="small" />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                            {searchQuery && (
                                <Chip label={`Search: ${searchQuery}`} onDelete={() => setSearchQuery('')} size="small" sx={{ borderRadius: '8px' }} />
                            )}
                            {placeFilter && (
                                <Chip label={`Place: ${placeFilter}`} onDelete={() => setPlaceFilter('')} size="small" sx={{ borderRadius: '8px' }} />
                            )}
                            {categoryFilter && (
                                <Chip label={`Category: ${categoryFilter}`} onDelete={() => setCategoryFilter('')} size="small" sx={{ borderRadius: '8px' }} />
                            )}
                            <Button size="small" onClick={handleClearSearch} sx={{ ml: 1, color: 'text.secondary' }}>
                                Clear All
                            </Button>
                        </Box>
                    )}
                </Container>
            </Box>

            {/* Main Content Grid */}
            <Container maxWidth="lg" sx={{ py: 6, minHeight: '60vh' }}>
                {isLoading ? (
                    <Grid container spacing={4}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Grid size={{ xs: 12, sm: 6, md: viewMode === 'grid' ? 4 : 12 }} key={i}>
                                <SalonCardSkeleton />
                            </Grid>
                        ))}
                    </Grid>
                ) : processedSalons.length === 0 ? (
                    <Box className="empty-state">
                        <Box
                            component="img"
                            src="/images/styler-logo-purple.png"
                            sx={{ width: 80, height: 'auto', mb: 3, opacity: 0.5, filter: 'grayscale(1)' }}
                            alt="No results"
                        />
                        <Typography variant="h4" gutterBottom fontWeight={700} color="text.primary">
                            No Salons Found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 400, mx: 'auto' }}>
                            {hasActiveFilters
                                ? "We couldn't find any salons matching your current filters. Try removing some filters or searching for something else."
                                : "There are no salons available at the moment. Please check back later."}
                        </Typography>
                        {hasActiveFilters && (
                            <Button variant="outlined" onClick={handleClearSearch} size="large" sx={{ mt: 2, borderRadius: '50px' }}>
                                Clear All Filters
                            </Button>
                        )}
                    </Box>
                ) : viewMode === 'map' ? (
                    <Box sx={{ width: '100%', height: '600px', borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                        <Map
                            center={coordinates ? { lat: coordinates.latitude, lng: coordinates.longitude } : undefined}
                            zoom={13}
                            markers={mapMarkers}
                            height="100%"
                        />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {processedSalons.map((salon, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: viewMode === 'grid' ? 4 : 12 }} key={salon._id}>
                                <MotionBox
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <Box className="salon-card-wrapper" sx={{ position: 'relative' }}>
                                        {salon.distance !== undefined && (
                                            <Chip
                                                label={formatDistance(salon.distance)}
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    right: 16,
                                                    zIndex: 2,
                                                    fontWeight: 600,
                                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                                                }}
                                            />
                                        )}
                                        <SalonCard
                                            salon={salon}
                                            onClick={() => navigate(`/salons/${salon._id}`)}
                                        />
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Location Alerts */}
            <Snackbar
                open={showLocationAlert}
                autoHideDuration={4000}
                onClose={() => setShowLocationAlert(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" onClose={() => setShowLocationAlert(false)} sx={{ borderRadius: '12px' }}>
                    📍 Showing salons nearest to your location
                </Alert>
            </Snackbar>

            {locationError && (
                <Snackbar
                    open={!!locationError}
                    autoHideDuration={6000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="error" variant="filled" sx={{ borderRadius: '12px' }}>
                        {locationError}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default SalonList;
