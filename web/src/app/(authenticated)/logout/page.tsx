import { logout } from "@/actions/auth-actions";

export default async function Page() {
	await logout();
}
