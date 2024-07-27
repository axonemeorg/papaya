import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/auth";
import db from '@/database/client';
import { redirect } from "next/navigation";
import { UserTable } from "@/database/schemas";
import { generateIdFromEntropySize } from "lucia";

export default async function Page() {
	return (
		<>
			<h1>Create an account</h1>
			<form action={signup}>
				<label htmlFor="username">Username</label>
				<input name="username" id="username" />
				<br />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" />
				<br />
				<button>Continue</button>
			</form>
		</>
	);
}

async function signup(formData: FormData): Promise<ActionResult> {
	"use server";
	const username = formData.get("username");
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username"
		};
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password"
		};
	}

    const userId = generateIdFromEntropySize(10); // 16 characters long
	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 64,
		parallelism: 1
	});

	// TODO: check if username is already used

    const newUser = {
		id: userId,
		username,
		passwordHash
	}

    // Insert the user record
	const response = await db.insert(UserTable)
        .values(newUser)
        .returning({ id: UserTable.id });

    const user = response[0]

	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/");
}

interface ActionResult {
	error: string;
}
