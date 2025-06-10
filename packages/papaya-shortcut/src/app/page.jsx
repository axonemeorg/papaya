import { redirect } from "next/navigation";

const SHORTCUT_REDIRECT_URL = process.env.SHORTCUT_REDIRECT_URL;

export default function Page() {
  redirect(SHORTCUT_REDIRECT_URL);
}
