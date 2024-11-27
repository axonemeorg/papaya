import { Insights, ReceiptLong } from "@mui/icons-material";
import { ReactNode } from "react";
import { string } from "zod";

type NavMenuItem = {
    icon: ReactNode;
    label: string;
    description: string;
    disabled?: boolean;
    hidden?: boolean;
    pathPattern: RegExp;
};

export const APP_MENU: Record<string, NavMenuItem> = {
    '/journal': {
        icon: <ReceiptLong />,
        label: 'Journal',
        description: 'Organize your expenses',
        pathPattern: /\/journal(\/\d+){0,2}\/?$/,
    },
    '/analyze': {
        icon: <Insights />,
        label: 'Analyze',
        description: 'Understand your spending',
        disabled: true,
        pathPattern: /\/analyze$/,
    },
};
