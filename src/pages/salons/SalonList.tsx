import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, InputBase, Select, MenuItem, FormControl,
    Button, Chip, IconButton, Snackbar, Alert, alpha, useMediaQuery, useTheme,
} from '@mui/material';
import {
    Search as SearchIcon, MyLocation as MyLocationIcon, Clear as ClearIcon,
    TuneRounded as TuneIcon, LocationOn as LocationOnIcon,
    FilterList as FilterListIcon, Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { salonService } from '../../services/salonService';
import SalonCard from '../../components/salon/SalonCard';
import SalonCardSkeleton from '../../components/common/SalonCardSkeleton';
import Map, { MarkerData } from '../../components/Map';
import { Salon } from '../../types';
import { useGeolocation, calculateDistance, formatDistance } from '../../hooks/useGeolocation';

const MotionBox = motion(Box);

type SortOption = 'nearest' | 'rating' | 'reviews' | 'name';

interface SalonWithDistance extends Salon {
    distance?: number;
}

interface VenueListProps {
    fixedCategory?: string;
    labelPlural?: string;
}

const categoryOptions = [
    { label: 'All', value: '' },
    { label: '✂️ Salons', value: 'Salons' },
    { label: '✨ Skin & Derma', value: 'Dermatologists' },
    { label: '🧘 Wellness & Spa', value: 'Wellness & Spa' },
    { label: '💅 Nails & Lashes', value: 'Nails & Lashes' },
];

const SalonList: React.FC<VenueListProps> = ({ fixedCategory, labelPlural = 'venues' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const initialCategory = fixedCategory || location.state?.category || '';
    const initialQuery = location.state?.query || '';
    const initialLocation = location.state?.location || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [cityFilter, setCityFilter] = useState(initialLocation);
    const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
    const [sortBy, setSortBy] = useState<SortOption>('rating');
    const [showLocationAlert, setShowLocationAlert] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (location.state?.category !== undefined) setCategoryFilter(location.state.category);
        if (location.state?.query !== undefined) setSearchQuery(location.state.query);
        if (location.state?.location !== undefined) setCityFilter(location.state.location);
    }, [location.state]);

    const { coordinates, error: locationError, loading: locationLoading, getCurrentPosition } = useGeolocation();

    const { data, isLoading } = useQuery({
        queryKey: ['salons', searchQuery, cityFilter, categoryFilter, sortBy],
        queryFn: () => salonService.searchSalons({
            searchText: searchQuery || undefined,
            city: cityFilter || undefined,
            serviceCategory: categoryFilter || undefined,
            sortBy: sortBy !== 'nearest' ? sortBy : undefined,
        }),
    });

    const salons: Salon[] = (data?.data && Array.isArray(data.data)) ? data.data : [];

    const processedSalons = useMemo(() => {
        let processed: SalonWithDistance[] = salons.map(salon => ({
            ...salon,
            distance: coordinates
                ? calculateDistance(
                    coordinates.latitude, coordinates.longitude,
                    salon.address.location?.coordinates[1] || 0,
                    salon.address.location?.coordinates[0] || 0,
                )
                : undefined,
        }));
        if (sortBy === 'nearest' && coordinates) {
            processed = processed.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }
        return processed;
    }, [salons, coordinates, sortBy]);

    const mapMarkers: MarkerData[] = useMemo(() => processedSalons
        .filter(salon => salon.address?.location?.coordinates)
        .map(salon => ({
            id: salon._id,
            lat: salon.address.location!.coordinates[1],
            lng: salon.address.location!.coordinates[0],
            title: salon.name,
            onClick: () => navigate(`/salons/${salon._id}`),
        })), [processedSalons, navigate]);

    const handleFindNearest = () => {
        getCurrentPosition();
        if (coordinates) {
            setSortBy('nearest');
            setShowLocationAlert(true);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCityFilter('');
        if (!fixedCategory) setCategoryFilter('');
    };

    const hasActiveFilters = searchQuery || cityFilter || (!fixedCategory && categoryFilter);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', bgcolor: '#f8fafc' }}>

            {/* Navbar space */}
            <Box sx={{ pt: { xs: 8, md: 9 } }} />

            {/* ── Search & Filter Bar ── */}
            <Box sx={{
                bgcolor: 'white', zIndex: 10,
                borderBottom: '1px solid #f1f5f9',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}>
                {/* Main search row */}
                <Box sx={{ px: { xs: 2, md: 3 }, py: 1.75, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    {/* Search input */}
                    <Box sx={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 1.5,
                        bgcolor: '#f8fafc', borderRadius: '14px', px: 2, py: 1.2,
                        border: '1.5px solid #f1f5f9',
                        transition: 'all 0.2s',
                        '&:focus-within': { border: '1.5px solid #6366f1', bgcolor: 'white', boxShadow: `0 0 0 4px ${alpha('#6366f1', 0.08)}` },
                    }}>
                        <SearchIcon sx={{ color: '#94a3b8', fontSize: 18, flexShrink: 0 }} />
                        <InputBase
                            placeholder="Search salons, services, treatments..."
                            fullWidth value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            sx={{ fontSize: '0.9rem', color: '#0f172a', '& input::placeholder': { color: '#94a3b8' } }}
                        />
                        {searchQuery && (
                            <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.2, color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
                                <ClearIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                        )}
                    </Box>

                    {/* City input */}
                    <Box sx={{
                        display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1,
                        bgcolor: '#f8fafc', borderRadius: '14px', px: 2, py: 1.2, minWidth: 200,
                        border: '1.5px solid #f1f5f9',
                        transition: 'all 0.2s',
                        '&:focus-within': { border: '1.5px solid #6366f1', bgcolor: 'white', boxShadow: `0 0 0 4px ${alpha('#6366f1', 0.08)}` },
                    }}>
                        <LocationOnIcon sx={{ color: '#94a3b8', fontSize: 16, flexShrink: 0 }} />
                        <InputBase
                            placeholder="City or country..."
                            value={cityFilter}
                            onChange={e => setCityFilter(e.target.value)}
                            sx={{ fontSize: '0.9rem', color: '#0f172a', flex: 1, '& input::placeholder': { color: '#94a3b8' } }}
                        />
                        <IconButton
                            size="small" onClick={handleFindNearest}
                            title="Use my location"
                            sx={{ p: 0.3, color: coordinates ? '#6366f1' : '#94a3b8', '&:hover': { color: '#6366f1' } }}
                        >
                            <MyLocationIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Box>

                    {/* Sort */}
                    <FormControl size="small" sx={{ minWidth: 150, display: { xs: 'none', lg: 'block' } }}>
                        <Select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            displayEmpty
                            sx={{
                                borderRadius: '14px', bgcolor: '#f8fafc', fontSize: '0.88rem',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                            }}
                        >
                            <MenuItem value="rating">⭐ Highest Rated</MenuItem>
                            <MenuItem value="reviews">🔥 Most Reviews</MenuItem>
                            <MenuItem value="name">🔤 Name (A–Z)</MenuItem>
                            {coordinates && <MenuItem value="nearest">📍 Nearest First</MenuItem>}
                        </Select>
                    </FormControl>

                    {/* Mobile filter toggle */}
                    <IconButton
                        onClick={() => setShowFilters(p => !p)}
                        sx={{
                            display: { lg: 'none' }, borderRadius: '14px',
                            bgcolor: showFilters ? alpha('#6366f1', 0.08) : '#f8fafc',
                            border: `1.5px solid ${showFilters ? '#6366f1' : '#f1f5f9'}`,
                            color: showFilters ? '#6366f1' : '#64748b',
                            p: 1.2,
                        }}
                    >
                        <TuneIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>

                {/* Category pills */}
                {!fixedCategory && (
                    <Box sx={{
                        px: { xs: 2, md: 3 }, pb: 1.5, pt: 0,
                        display: 'flex', gap: 1, overflowX: 'auto', scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                    }}>
                        {categoryOptions.map(opt => (
                            <Chip
                                key={opt.value}
                                label={opt.label}
                                onClick={() => setCategoryFilter(opt.value)}
                                sx={{
                                    cursor: 'pointer', borderRadius: '10px',
                                    fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap',
                                    bgcolor: categoryFilter === opt.value ? '#6366f1' : '#f1f5f9',
                                    color: categoryFilter === opt.value ? 'white' : '#475569',
                                    border: 'none',
                                    '&:hover': { bgcolor: categoryFilter === opt.value ? '#5558e8' : '#e2e8f0' },
                                    transition: 'all 0.2s',
                                }}
                            />
                        ))}
                    </Box>
                )}

                {/* Mobile expanded filters */}
                <AnimatePresence>
                    {showFilters && (
                        <MotionBox
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                            sx={{ overflow: 'hidden', borderTop: '1px solid #f1f5f9' }}
                        >
                            <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* City on mobile */}
                                <Box sx={{
                                    display: { sm: 'none' }, alignItems: 'center', gap: 1,
                                    bgcolor: '#f8fafc', borderRadius: '14px', px: 2, py: 1.4,
                                    border: '1.5px solid #f1f5f9', flexDirection: 'row',
                                }}>
                                    <LocationOnIcon sx={{ color: '#94a3b8', fontSize: 16 }} />
                                    <InputBase
                                        placeholder="City or country..."
                                        value={cityFilter}
                                        onChange={e => setCityFilter(e.target.value)}
                                        sx={{ fontSize: '0.9rem', flex: 1 }}
                                    />
                                </Box>
                                {/* Sort on mobile */}
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value as SortOption)}
                                        sx={{ borderRadius: '14px', fontSize: '0.88rem' }}
                                    >
                                        <MenuItem value="rating">⭐ Highest Rated</MenuItem>
                                        <MenuItem value="reviews">🔥 Most Reviews</MenuItem>
                                        <MenuItem value="name">🔤 Name (A–Z)</MenuItem>
                                        {coordinates && <MenuItem value="nearest">📍 Nearest First</MenuItem>}
                                    </Select>
                                </FormControl>
                            </Box>
                        </MotionBox>
                    )}
                </AnimatePresence>

                {/* Active filter chips */}
                {hasActiveFilters && (
                    <Box sx={{ px: { xs: 2, md: 3 }, pb: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        {searchQuery && (
                            <Chip
                                label={`"${searchQuery}"`} size="small"
                                onDelete={() => setSearchQuery('')}
                                sx={{ bgcolor: alpha('#6366f1', 0.08), color: '#4f46e5', fontWeight: 600, fontSize: '0.75rem', borderRadius: '8px', '& .MuiChip-deleteIcon': { color: '#6366f1', fontSize: 14 } }}
                            />
                        )}
                        {cityFilter && (
                            <Chip
                                label={cityFilter} size="small" icon={<LocationOnIcon sx={{ fontSize: '12px !important', color: '#ec4899 !important' }} />}
                                onDelete={() => setCityFilter('')}
                                sx={{ bgcolor: alpha('#ec4899', 0.08), color: '#db2777', fontWeight: 600, fontSize: '0.75rem', borderRadius: '8px', '& .MuiChip-deleteIcon': { color: '#ec4899', fontSize: 14 } }}
                            />
                        )}
                        <Button
                            size="small" onClick={handleClearSearch}
                            sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'none', minWidth: 0, p: '2px 8px', '&:hover': { color: '#475569' } }}
                        >
                            Clear all
                        </Button>
                    </Box>
                )}
            </Box>

            {/* ── Split Screen ── */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left: List */}
                <Box sx={{
                    width: { xs: '100%', md: '48%', lg: '42%' },
                    overflowY: 'auto', p: { xs: 2, md: 2.5 },
                    bgcolor: '#f8fafc',
                    '&::-webkit-scrollbar': { width: 4 },
                    '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: 4 },
                }}>
                    {/* Results header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                            {isLoading ? (
                                <Box component="span" sx={{ color: '#94a3b8' }}>Searching...</Box>
                            ) : (
                                <>
                                    <Box component="span" sx={{ color: '#6366f1' }}>{processedSalons.length}</Box>
                                    {' '}{labelPlural} {cityFilter ? `in ${cityFilter}` : 'worldwide'}
                                </>
                            )}
                        </Typography>
                        {coordinates && (
                            <Chip
                                icon={<MyLocationIcon sx={{ fontSize: '12px !important' }} />}
                                label="Near me active"
                                size="small"
                                sx={{ bgcolor: alpha('#10b981', 0.1), color: '#059669', fontWeight: 600, fontSize: '0.72rem', borderRadius: '8px' }}
                            />
                        )}
                    </Box>

                    {isLoading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {[1, 2, 3, 4].map(i => <SalonCardSkeleton key={i} />)}
                        </Box>
                    ) : processedSalons.length === 0 ? (
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            sx={{ textAlign: 'center', pt: 8, pb: 4 }}
                        >
                            <Box sx={{
                                width: 80, height: 80, borderRadius: '24px',
                                bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                mx: 'auto', mb: 3,
                            }}>
                                <SearchIcon sx={{ fontSize: 36, color: '#94a3b8' }} />
                            </Box>
                            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#0f172a', mb: 1 }}>
                                No {labelPlural} found
                            </Typography>
                            <Typography sx={{ color: '#64748b', mb: 3, lineHeight: 1.7, fontSize: '0.9rem', px: 2 }}>
                                {cityFilter
                                    ? `We couldn't find any ${labelPlural} in "${cityFilter}". Try a different city or expand your search.`
                                    : `No ${labelPlural} match your current filters. Try adjusting your search.`
                                }
                            </Typography>
                            <Button
                                variant="outlined" onClick={handleClearSearch}
                                sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, borderColor: '#e2e8f0', color: '#475569', '&:hover': { borderColor: '#6366f1', color: '#6366f1' } }}
                            >
                                Clear filters
                            </Button>
                        </MotionBox>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {processedSalons.map((salon, index) => (
                                <MotionBox
                                    key={salon._id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: index * 0.04 }}
                                    sx={{ position: 'relative' }}
                                >
                                    {salon.distance !== undefined && (
                                        <Chip
                                            label={formatDistance(salon.distance)}
                                            size="small"
                                            icon={<MyLocationIcon sx={{ fontSize: '11px !important', color: 'white !important' }} />}
                                            sx={{
                                                position: 'absolute', top: 12, right: 12, zIndex: 2,
                                                fontWeight: 700, fontSize: '0.7rem', borderRadius: '8px',
                                                bgcolor: '#6366f1', color: 'white',
                                                boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                                            }}
                                        />
                                    )}
                                    <SalonCard salon={salon} onClick={() => navigate(`/salons/${salon._id}`)} />
                                </MotionBox>
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Right: Map */}
                <Box sx={{
                    display: { xs: 'none', md: 'block' },
                    width: { md: '52%', lg: '58%' }, height: '100%', position: 'relative',
                    borderLeft: '1px solid #f1f5f9',
                }}>
                    <Map
                        center={coordinates ? { lat: coordinates.latitude, lng: coordinates.longitude } : undefined}
                        zoom={13}
                        markers={mapMarkers}
                        height="100%"
                    />
                </Box>
            </Box>

            {/* Snackbars */}
            <Snackbar open={showLocationAlert} autoHideDuration={4000} onClose={() => setShowLocationAlert(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" onClose={() => setShowLocationAlert(false)} sx={{ borderRadius: '14px', fontWeight: 600 }}>
                    Showing venues nearest to you
                </Alert>
            </Snackbar>
            {locationError && (
                <Snackbar open={!!locationError} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity="error" variant="filled" sx={{ borderRadius: '14px', fontWeight: 600 }}>{locationError}</Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default SalonList;
