"use client";

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Box, Button, ButtonProps, Grid2 as Grid, Grow, IconButton, Paper, Stack, TextareaAutosize } from "@mui/material";
import { green } from "@mui/material/colors";

interface ScreenCalculatorProps {
    open: boolean
}

const CalculatorButton = (props: ButtonProps) => {
    const { children, sx, ...rest } = props;

    return (
        <Button
            sx={{
                ...sx,
                borderRadius: '50%',
                aspectRatio: 1,
                padding: 1,
                width: '22px',
                height: '22px',
                boxSizing: 'content-box',
                minWidth: 'unset',
            }}
            size='large'
            variant='contained'
            {...rest}
        >
            {children}
        </Button>
    )
}

export function ScreenCalculator(props: ScreenCalculatorProps) {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const audioRef = useRef(typeof Audio !== "undefined" ? new Audio('/sound/frog2.mp3') : undefined)

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (props.open) {
            croak()
        }
    }, [props.open])

    const croak = () => {
        audioRef.current?.play()
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        // Allow TextField clicks to focus properly
        if (e.target instanceof HTMLElement && ['BUTTON', 'TEXTAREA'].includes(e.target.tagName)) {
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
        croak()
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

    if (!mounted) {
        return null;
    }

    return createPortal(
        (
            <Grow in={props.open} timeout={100}>
                <Box
                    ref={containerRef}
                    className="cursor-move"
                    sx={{
                        position: 'fixed',
                        zIndex: 99999,
                        left: position.x,
                        top: position.y,
                        padding: 2,
                        userSelect: 'none',
                        filter: 'drop-shadow(0 5px 10px rgba(13, 13, 14, 0.05))',

                        // Left leg
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            bottom: "-15px",
                            left: "-40px",
                            width: "100px",
                            height: "100px",
                            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g transform="translate(0, -10)" fill="%234CC24F" ><ellipse transform="translate(46.538193, 57.026578) rotate(-27.000000) translate(-46.538193, -57.026578)" cx="46.5381931" cy="57.0265777" rx="26.5" ry="50.5"></ellipse><rect x="13" y="89" width="56" height="15" rx="9"></rect></g></svg>')`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                        },

                        // Right leg
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: "-15px",
                            right: "-40px",
                            width: "100px",
                            height: "100px",
                            scale: '-1 1',
                            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g transform="translate(0, -10)" fill="%234CC24F"><ellipse transform="translate(46.538193, 57.026578) rotate(-27.000000) translate(-46.538193, -57.026578)" cx="46.5381931" cy="57.0265777" rx="26.5" ry="50.5"></ellipse><rect x="13" y="89" width="56" height="15" rx="9"></rect></g></svg>')`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            zIndex: -1,
                        },
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation()

                        handleMouseDown(e)
                    }}
                    onClick={(e) => {
                        e.preventDefault()
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            backgroundColor: 'rgb(105, 218, 107)',
                            position: 'relative',
                            borderRadius: '8px',
                            padding: '32px 16px',
                            // zIndex: 1000000,

                            "&::before": {
                                content: '""',
                                position: "absolute",
                                top: "-22px",
                                left: "0px",
                                width: "48px",
                                height: "48px",
                                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g><circle id="Oval-29" fill="%2369DA6B" cx="24" cy="24" r="24"></circle><circle id="Oval-37" stroke="%23FFFFFF" stroke-width="5" fill="%23000000" cx="24" cy="24" r="12"></circle></g></svg>')`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                            },
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                top: "-22px",
                                right: "0px",
                                width: "48px",
                                height: "48px",
                                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g><circle id="Oval-29" fill="%2369DA6B" cx="24" cy="24" r="24"></circle><circle id="Oval-37" stroke="%23FFFFFF" stroke-width="5" fill="%23000000" cx="24" cy="24" r="12"></circle></g></svg>')`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                            },

                        }}
                    >
                            <TextareaAutosize
                                style={{
                                    background: 'none'
                                }}
                                // label='Math'
                                // variant='filled'
                                
                            />
                            <Stack direction='row'>
                                <Grid columns={3} spacing={1} container justifyContent='center' sx={{ width: 'auto' }}>
                                    <Grid size={1}>
                                        <CalculatorButton color="forestGreen">7</CalculatorButton>
                                    </Grid>
                                    <Grid size={1} >
                                        <CalculatorButton color="forestGreen">8</CalculatorButton>
                                    </Grid>
                                    <Grid size={1} >
                                        <CalculatorButton color="forestGreen">9</CalculatorButton>
                                    </Grid>
                                    <Grid size={1}>
                                        <CalculatorButton color="forestGreen">4</CalculatorButton>
                                    </Grid>
                                    <Grid size={1} >
                                        <CalculatorButton color="forestGreen">5</CalculatorButton>
                                    </Grid>
                                    <Grid size={1} >
                                        <CalculatorButton color="forestGreen">6</CalculatorButton>
                                    </Grid>
                                    <Grid size={1}>
                                        <CalculatorButton color="forestGreen">1</CalculatorButton>
                                    </Grid>
                                    <Grid size={1} >
                                        <CalculatorButton color="forestGreen">2</CalculatorButton>
                                    </Grid>
                                    <Grid size={1} >
                                        <CalculatorButton color="forestGreen">3</CalculatorButton>
                                    </Grid>
                                </Grid>
                            </Stack>
                    </Paper>
                </Box>
            </Grow>
        ),
        document.body
    );
}
