import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
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
    Snackbar,
    IconButton,
    Alert,
} from '@mui/material';
import {
    Search as SearchIcon,
    MyLocation as MyLocationIcon,
    Clear as ClearIcon,
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

interface VenueListProps {
    fixedCategory?: string;
    labelPlural?: string;
}

const SalonList: React.FC<VenueListProps> = ({ fixedCategory, labelPlural = 'venues' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialCategory = fixedCategory || location.state?.category || '';
    const initialQuery = location.state?.query || '';
    const initialLocation = location.state?.location || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [countryFilter, setCountryFilter] = useState('India');
    const [cityFilter, setCityFilter] = useState('Lucknow');
    const [placeFilter, setPlaceFilter] = useState(initialLocation);
    const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
    const [sortBy, setSortBy] = useState<SortOption>('rating');
    const [showLocationAlert, setShowLocationAlert] = useState(false);

    // Sync category filter when location state changes
    useEffect(() => {
        if (location.state && location.state.category !== undefined) {
            setCategoryFilter(location.state.category);
        }
        if (location.state && location.state.query !== undefined) {
            setSearchQuery(location.state.query);
        }
        if (location.state && location.state.location !== undefined) {
            setPlaceFilter(location.state.location);
        }
    }, [location.state]);

    const { coordinates, error: locationError, loading: locationLoading, getCurrentPosition } = useGeolocation();

    const lucknowPlaces = [
        'Gomti Nagar', 'Aliganj', 'Hazratganj', 'Indira Nagar', 'Aminabad', 'Chowk', 'Mahanagar',
    ];

    const serviceCategories = [
        'Salons', 'Dermatologists', 'Wellness & Spa', 'Nails & Lashes'
    ];

    const { data, isLoading } = useQuery({
        queryKey: ['salons', searchQuery, placeFilter, cityFilter, categoryFilter, sortBy],
        queryFn: () => {
            const combinedSearch = [searchQuery, placeFilter].filter(Boolean).join(' ');
            return salonService.searchSalons({
                searchText: combinedSearch || undefined,
                city: cityFilter,
                serviceCategory: categoryFilter || undefined,
                sortBy: sortBy !== 'nearest' ? sortBy : undefined
            });
        },
    });

    const salons: Salon[] = (data?.data && Array.isArray(data.data)) ? data.data : [];

    const processedSalons = useMemo(() => {
        let processed: SalonWithDistance[] = salons.map(salon => ({
            ...salon,
            distance: coordinates
                ? calculateDistance(
                    coordinates.latitude,
                    coordinates.longitude,
                    salon.address.location?.coordinates[1] || 0,
                    salon.address.location?.coordinates[0] || 0
                )
                : undefined,
        }));

        if (sortBy === 'nearest' && coordinates) {
            processed = processed.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }

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
        <Box className="salon-list-page" sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            
            {/* Top Navigation Space (to sit under fixed navbar) */}
            <Box sx={{ pt: 10 }} />

            {/* Top Search & Filter Bar */}
            <Box sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: 'white', py: 2, px: 3, zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField 
                            fullWidth 
                            placeholder="Search treatments or venues" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            size="small" 
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                                endAdornment: searchQuery && (
                                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                )
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                         <TextField 
                            fullWidth 
                            placeholder="Location (e.g. Gomti Nagar)" 
                            value={placeFilter} 
                            onChange={(e) => setPlaceFilter(e.target.value)} 
                            size="small" 
                            InputProps={{
                                startAdornment: (
                                    <IconButton size="small" onClick={handleFindNearest} title="Use My Location">
                                        <MyLocationIcon fontSize="small" color={coordinates ? "primary" : "inherit"} />
                                    </IconButton>
                                ),
                                endAdornment: placeFilter && (
                                    <IconButton size="small" onClick={() => setPlaceFilter('')}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                )
                            }}
                        />
                    </Grid>
                    {!fixedCategory && (
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select 
                                value={categoryFilter} 
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                label="Category"
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {serviceCategories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    )}
                    <Grid size={{ xs: 12, md: fixedCategory ? 5 : 2 }}>
                        <FormControl fullWidth size="small">
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
                    </Grid>
                </Grid>
                
                {hasActiveFilters && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        {searchQuery && <Chip label={`Search: ${searchQuery}`} onDelete={() => setSearchQuery('')} size="small" />}
                        {placeFilter && <Chip label={`Place: ${placeFilter}`} onDelete={() => setPlaceFilter('')} size="small" />}
                        {!fixedCategory && categoryFilter && <Chip label={`Category: ${categoryFilter}`} onDelete={() => setCategoryFilter('')} size="small" />}
                        <Button size="small" onClick={handleClearSearch} sx={{ ml: 1, color: 'text.secondary' }}>Clear All</Button>
                    </Box>
                )}
            </Box>
            
            {/* Split Screen Content */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Panel: List */}
                <Box sx={{ width: { xs: '100%', md: '50%', lg: '40%' }, overflowY: 'auto', p: { xs: 2, md: 3 }, bgcolor: '#f8fafc' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                            {isLoading ? 'Searching...' : `${processedSalons.length} ${labelPlural} found`}
                        </Typography>
                    </Box>
                    
                    {isLoading ? (
                        <Grid container spacing={3}>
                            {[1, 2, 3, 4].map(i => (
                                <Grid size={{ xs: 12 }} key={i}>
                                    <SalonCardSkeleton />
                                </Grid>
                            ))}
                        </Grid>
                    ) : processedSalons.length === 0 ? (
                        <Box sx={{ textAlign: 'center', mt: 8 }}>
                            <Box
                                component="img"
                                src="/images/styler-logo-purple.png"
                                sx={{ width: 80, height: 'auto', mb: 3, opacity: 0.5, filter: 'grayscale(1)' }}
                                alt="No results"
                            />
                            <Typography variant="h5" gutterBottom fontWeight={700}>
                                No {labelPlural.charAt(0).toUpperCase() + labelPlural.slice(1)} Found
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                We couldn't find any {labelPlural} matching your filters in this area.
                            </Typography>
                            <Button variant="outlined" onClick={handleClearSearch} sx={{ borderRadius: '50px', mt: 2 }}>
                                Clear Filters
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {processedSalons.map((salon, index) => (
                                <Grid size={{ xs: 12 }} key={salon._id}>
                                    <MotionBox
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <Box sx={{ position: 'relative' }}>
                                            {salon.distance !== undefined && (
                                                <Chip
                                                    label={formatDistance(salon.distance)}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2, fontWeight: 600 }}
                                                />
                                            )}
                                            <SalonCard salon={salon} onClick={() => navigate(`/salons/${salon._id}`)} />
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
                
                {/* Right Panel: Sticky Map */}
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: { md: '50%', lg: '60%' }, height: '100%', position: 'relative' }}>
                    <Map
                        center={coordinates ? { lat: coordinates.latitude, lng: coordinates.longitude } : undefined}
                        zoom={13}
                        markers={mapMarkers}
                        height="100%"
                    />
                </Box>
            </Box>

            {/* Location Alerts */}
            <Snackbar open={showLocationAlert} autoHideDuration={4000} onClose={() => setShowLocationAlert(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" onClose={() => setShowLocationAlert(false)} sx={{ borderRadius: '12px' }}>
                    📍 Showing venues near you
                </Alert>
            </Snackbar>

            {locationError && (
                <Snackbar open={!!locationError} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity="error" variant="filled" sx={{ borderRadius: '12px' }}>
                        {locationError}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default SalonList;
