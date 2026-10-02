import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function DocumentsLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return children;
}