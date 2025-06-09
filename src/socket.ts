import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {useCompetition} from "./context/CompetitionContext.tsx";

interface UseSocketOptions {
    url?: string;
    autoConnect?: boolean;
}

interface SocketEventCallbacks {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onUserJoined?: (data: { username: string }) => void;
    onUserLeft?: (data: { username: string }) => void;
    onParticipantsUpdate?: (data: { participants: string[] }) => void;
    onSubmissionReceived?: (data: { username: string; submissionId: string; timestamp: number }) => void;
    onScoreUpdate?: (data: { username: string; score: number; feedback: string; rankings: unknown[] }) => void;
    onRankingsUpdate?: (data: { rankings: unknown[] }) => void;
    onCompetitionStarted?: () => void;
}

export const useSocket = (options: UseSocketOptions = {}) => {
    const { url = 'http://localhost:3001', autoConnect = true } = options;
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    const connect = () => {
        if (socketRef.current?.connected) return;

        const socket = io(url, {
            autoConnect: false,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
            setConnectionError(null);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from server:', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setConnectionError(error.message);
            setIsConnected(false);
        });

        socket.connect();
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    };

    const joinRoom = (roomId: string, username: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('join-room', { roomId, username });
        }
    };

    const leaveRoom = (roomId: string, username: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('leave-room', { roomId, username });
        }
    };

    const startCompetition = (roomId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('start-competition', { roomId });
        }
    };

    const setupEventListeners = (callbacks: SocketEventCallbacks) => {
        if (!socketRef.current) return;

        const socket = socketRef.current;

        if (callbacks.onConnect) {
            socket.on('connect', callbacks.onConnect);
        }

        if (callbacks.onDisconnect) {
            socket.on('disconnect', callbacks.onDisconnect);
        }

        if (callbacks.onUserJoined) {
            socket.on('user-joined', callbacks.onUserJoined);
        }

        if (callbacks.onUserLeft) {
            socket.on('user-left', callbacks.onUserLeft);
        }

        if (callbacks.onParticipantsUpdate) {
            socket.on('participants-update', callbacks.onParticipantsUpdate);
        }

        if (callbacks.onSubmissionReceived) {
            socket.on('submission-received', callbacks.onSubmissionReceived);
        }

        if (callbacks.onScoreUpdate) {
            socket.on('score-update', callbacks.onScoreUpdate);
        }

        if (callbacks.onRankingsUpdate) {
            socket.on('rankings-update', callbacks.onRankingsUpdate);
        }

        if (callbacks.onCompetitionStarted) {
            socket.on('competition-started', callbacks.onCompetitionStarted);
        }

        // Return cleanup function
        return () => {
            if (callbacks.onConnect) socket.off('connect', callbacks.onConnect);
            if (callbacks.onDisconnect) socket.off('disconnect', callbacks.onDisconnect);
            if (callbacks.onUserJoined) socket.off('user-joined', callbacks.onUserJoined);
            if (callbacks.onUserLeft) socket.off('user-left', callbacks.onUserLeft);
            if (callbacks.onParticipantsUpdate) socket.off('participants-update', callbacks.onParticipantsUpdate);
            if (callbacks.onSubmissionReceived) socket.off('submission-received', callbacks.onSubmissionReceived);
            if (callbacks.onScoreUpdate) socket.off('score-update', callbacks.onScoreUpdate);
            if (callbacks.onRankingsUpdate) socket.off('rankings-update', callbacks.onRankingsUpdate);
            if (callbacks.onCompetitionStarted) socket.off('competition-started', callbacks.onCompetitionStarted);
        };
    };

    const emit = (event: string, data: unknown) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit(event, data);
        }
    };

    const on = (event: string, callback: (...args: unknown[]) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    const off = (event: string, callback?: (...args: unknown[]) => void) => {
        if (socketRef.current) {
            socketRef.current.off(event, callback);
        }
    };

    // Auto-connect on mount if enabled
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, url]);

    return {
        socket: socketRef.current,
        isConnected,
        connectionError,
        connect,
        disconnect,
        joinRoom,
        leaveRoom,
        startCompetition,
        setupEventListeners,
        emit,
        on,
        off,
    };
};