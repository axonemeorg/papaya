import Header from "@/components/header/Header";
import { PropsWithChildren } from "react";

export const MainLayout = (props: PropsWithChildren) => {
    const { children } = props;
	return (
		<>
			<Header />
			{children}
		</>
	)
}
