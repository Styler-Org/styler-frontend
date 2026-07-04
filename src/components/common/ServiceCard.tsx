import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Service } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { useTilt } from '../../hooks/useTilt';
import './ServiceCard.css';

interface ServiceCardProps {
    service: Service;
    onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
    const tilt = useTilt<HTMLDivElement>(5);

    return (
        <Card
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className="service-card"
            onClick={onClick}
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                willChange: 'transform',
            }}
        >
            <CardContent>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                    {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="service-description" sx={{ mb: 2 }}>
                    {service.description}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="service-duration">{service.duration} min</span>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatCurrency(service.price)}
                    </Typography>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ServiceCard;
