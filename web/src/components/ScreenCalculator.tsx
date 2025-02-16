"use client";

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button, Paper, TextField } from "@mui/material";

interface ScreenCalculatorProps {
    open: boolean
}

export function ScreenCalculator(props: ScreenCalculatorProps) {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Allow TextField clicks to focus properly
        if (e.target instanceof HTMLElement && e.target.tagName === 'INPUT') {
            return; 
        } 
    
        if (!containerRef.current) {
            return;
        }
    
        setIsDragging(true);
        const rect = containerRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        setPosition({
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const calculator = (
        <Paper
            ref={containerRef}
            className="cursor-move"
            sx={{
                position: 'fixed',
                zIndex: 99999,
                left: position.x,
                top: position.y,
                padding: 2,
                userSelect: 'none',
                display: props.open ? 'block' : 'none',
            }}
            onMouseDown={(e) => {
                e.stopPropagation()
                
                handleMouseDown(e)
            }}
            onClick={(e) => {
                e.preventDefault()
            }}
            elevation={3}
        >
            <div className="p-4">
                <div className="mb-4">Calculator</div>
                <TextField className="pointer-events-auto" />
                <Button onClick={() => alert('hello')}>Test</Button>
            </div>
        </Paper>
    );

    if (!mounted) return null;
    
    return createPortal(calculator, document.body);
}
