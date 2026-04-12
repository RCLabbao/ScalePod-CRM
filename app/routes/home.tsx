import { redirect } from "react-router";
import { getSession } from "../sessions/session";

export async function loader() {
  return redirect("/dashboard");
}

export default function Index() {
  return null;
}
