import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook for managing Socket.IO connection
 */
export const useSocket = (): Socket | null => {
    const socketRef = useRef<Socket | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        // Only connect if user is logged in
        if (!user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        // Socket.IO lives on the backend monolith itself (not routed through
        // local-gateway's REST proxy), so this needs the backend's own origin,
        // not VITE_API_BASE_URL (which includes the /api/v1 path and, in dev,
        // points at the gateway rather than the backend directly).
        const socketUrl = (import.meta as any).env.VITE_SOCKET_URL || 'http://localhost:9168';
        const socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            // Authenticate user with their ID
            socket.emit('authenticate', user._id);
        });

        socket.on('authenticated', (data: { userId: string; socketId: string }) => {
            console.log('✅ Socket authenticated for user:', data.userId);
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('reconnect', (attemptNumber) => {
            console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
        });

        socketRef.current = socket;

        // Cleanup on unmount or user change
        return () => {
            if (socket) {
                console.log('Disconnecting socket...');
                socket.disconnect();
            }
        };
    }, [user]);

    return socketRef.current;
};
