import io from 'socket.io-client';
import React, { useEffect, useRef } from 'react';

const useSocket = () => {

    const socketRef = useRef()

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGFiaW11amVlYkB5YWhvby5jb20iLCJ1c2VyX3R5cGUiOiJ1c2VyIiwiZmlyc3RfbmFtZSI6Ik11amVlYiIsImxhc3RfbmFtZSI6IkF5b2t1bmxlIiwiaWF0IjoxNjkwODE1NzgxfQ.J9jmG4eP0LCqSjUgiuKO5gno-7nzTb8WJTvMxohAW60"

    const connectSocket = () => {
        socketRef.current = io(`http://localhost:8080/user`, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
            .on('connect', () => {
                console.log("connected to socket server")
                // socketRef?.current?.emit('admin/notification', {});
                // socketRef?.current?.on('admin/notification', data => {
                //     console.log('admin message', data);
                // });
                socketRef?.current?.emit('minutes_watched', { profile_id: 12, movie_id: 20, series_id: 1, minutes_watched: 50, total_movie_length: 200 });
            })
            .on('disconnect', () => {
                console.log("disconnected")
            })
            .on('error', () => {
                console.log("disconnected")
            })

    }

    useEffect(() => {
        connectSocket()

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    return {
        socketRef
    }

}

export default useSocket