'use server';

import { Paper, Stack } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import Header from '@/components/header/Header'
import BaseContainer from "./BaseContainer";

interface BaseLayoutProps extends PropsWithChildren {
	headerChildren: ReactNode;
}

export default async (props: BaseLayoutProps) => {
	return (
		<>
			<Header>
				{props.headerChildren}
			</Header>
			<Stack component={Paper} square variant="outlined" sx={{ flex: 1, pt: 3, borderLeft: 0, borderRight: 0 }}>
				<BaseContainer sx={{ flex: 1, display: 'flex', flexFlow: 'column nowrap' }}>
					{props.children}
				</BaseContainer>
			</Stack>
		</>
	)
}
