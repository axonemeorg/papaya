'use client';

import { AutocompleteProps, Avatar, Box, Button, ButtonGroup, Fade, Grid, Icon, InputLabel, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CreateCategory, CreateTransactionMethod } from "@/types/post";
import PaymentTypeAutocomplete from "../input/PaymentTypeAutocomplet";
import { PaymentType } from "@/types/enum";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { InsertEmoticon, Photo, TextFields } from "@mui/icons-material";
import { UpdateCategory } from "@/types/put";
import AvatarPicker from "../pickers/AvatarPicker";

export default function CategoryForm() {
    const { register, control, setValue, watch } = useFormContext<CreateCategory | UpdateCategory>();

    return (
        <Box>
            {/* <Controller<CreateTransactionMethod>
                name='iconVariant'
                control={control}
                render={({ field }) => (
                    <ToggleButtonGroup
                        {...field}
                        exclusive
                        orientation="horizontal"
                        onChange={(_event, value) => {
                            setValue(field.name, value);
                        }}
                    >
                        <ToggleButton value={TransactionMethodIconVariant.Enum.PICTORIAL}>
                            <InsertEmoticon />
                        </ToggleButton>
                        <ToggleButton value={TransactionMethodIconVariant.Enum.TEXT}>
                            <TextFields />
                        </ToggleButton>
                        <ToggleButton disabled value={TransactionMethodIconVariant.Enum.IMAGE}>
                            <Photo />
                        </ToggleButton>
                    </ToggleButtonGroup>
                )}
            /> */}
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
    
                    />
                </Stack>
                <TextField
                    {...register('description')}
                    label='Description'
                    placeholder="Groceries and household foodstuffs"
                    fullWidth
                    multiline
                    rows={3}
                />
            </Stack>
        </Box>
    )
}
