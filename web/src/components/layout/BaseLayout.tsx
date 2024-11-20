import { ContainerProps, Paper, Stack } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import Header from '@/components/header/Header'
import BaseContainer from "./BaseContainer";
import { User } from "lucia";

interface BaseLayoutProps extends PropsWithChildren<ContainerProps> {
	headerChildren: ReactNode;
}

export default function BaseLayout(props: BaseLayoutProps) {
	const { headerChildren, sx, ...rest } = props;
	return (
		<>
			<Header user={undefined}>
				{props.headerChildren}
			</Header>
			<Stack component={Paper} square variant="outlined" sx={{ flex: 1, borderLeft: 0, borderRight: 0 }}>
				<BaseContainer
					sx={{
						flex: 1,
						display: 'flex',
						flexFlow: 'column nowrap',
						...sx,
						
					}}
					{...rest}
				>
					{props.children}
				</BaseContainer>
			</Stack>
		</>
	)
}
