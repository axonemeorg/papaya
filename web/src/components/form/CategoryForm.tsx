'use client';

import { AutocompleteProps, Avatar, Box, Button, ButtonGroup, Fade, FormHelperText, Grid, Icon, InputLabel, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CreateCategory, CreateTransactionMethod } from "@/types/post";
import PaymentTypeAutocomplete from "../input/PaymentTypeAutocomplet";
import { PaymentType } from "@/types/enum";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { InsertEmoticon, Photo, TextFields } from "@mui/icons-material";
import { UpdateCategory } from "@/types/put";
import AvatarPicker from "../pickers/AvatarPicker";
import { Avatar } from "@/types/get";

export default function CategoryForm() {
    const { register, control, setValue, watch } = useFormContext<CreateCategory | UpdateCategory>();

    const currentIcon: Avatar | null = useMemo(() => {
        const {
            avatarContent,
            avatarPrimaryColor,
            avatarVariant,
            avatarSecondaryColor
        } = watch();

        const avatar: Avatar = {
            avatarContent,
            avatarPrimaryColor,
            avatarVariant,
            avatarSecondaryColor,
        }
        if (Object.values(avatar).some(Boolean)) {
            return avatar;
        }
        return null;
    }, [watch()]);

    const handleChangeIcon = (avatar: Avatar) => {
        setValue('avatarContent', avatar.avatarContent);
        setValue('avatarPrimaryColor', avatar.avatarPrimaryColor);
        setValue('avatarVariant', avatar.avatarVariant);
        setValue('avatarSecondaryColor', avatar.avatarSecondaryColor);
    }

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
                        onChange={handleChangeIcon}
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
