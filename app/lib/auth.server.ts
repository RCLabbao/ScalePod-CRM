import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import pkg from "bcryptjs";
const { compare, hash } = pkg;
import { prisma } from "./prisma.server";
import { sessionStorage } from "../sessions/session";

export const authenticator = new Authenticator<string>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    return user.id;
  }),
  "user-pass"
);

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}
