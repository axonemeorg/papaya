'use client';

import { AutocompleteProps, Avatar as MuiAvatar, Box, Button, ButtonGroup, Fade, FormHelperText, Grid, Icon, InputLabel, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PaymentTypeAutocomplete from "../input/PaymentTypeAutocomplet";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { InsertEmoticon, Photo, TextFields } from "@mui/icons-material";
import AvatarPicker from "../pickers/AvatarPicker";
import { Avatar, Category, CreateCategory } from "@/types/schema";

export default function CategoryForm() {
    const { register, control, setValue, watch } = useFormContext<CreateCategory | Category>();

    const currentIcon: Avatar | null = useMemo(() => {
        const { avatar } = watch();

        if (Object.values(avatar).some(Boolean)) {
            return avatar;
        }
        return null;
    }, [watch()]);

    return (
        <Box>
            <Stack gap={2}>
                <Stack direction='row' alignItems='center' gap={2}>
                    <TextField
                        {...register('label')}
                        label='Label'
                        placeholder="Groceries"
                        fullWidth
                        multiline
                    />
                    <AvatarPicker
                        value={currentIcon}
                        onChange={(avatar) => setValue('avatar', avatar)}
                    />
                </Stack>
                <TextField
                    {...register('description')}
                    label='Description'
                    placeholder="Groceries or household foodstuffs"
                    fullWidth
                    multiline
                    rows={3}
                    // helperText=''
                />
                <FormHelperText>
                    The description is used by our AI to categorize your transactions, so be descriptive.
                </FormHelperText>
            </Stack>
        </Box>
    )
}
