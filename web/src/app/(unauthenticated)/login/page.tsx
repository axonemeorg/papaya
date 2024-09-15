import AuthFlowModal from "@/components/modal/AuthFlowModal";
import LoginForm from "@/components/form/LoginForm";


export default function LoginPage() {
	return (
		<AuthFlowModal title='Sign in' description="Start using Zisk">
			<LoginForm />
		</AuthFlowModal>
	);
}
