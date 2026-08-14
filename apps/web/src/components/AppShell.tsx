"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearTokens, getToken, api } from "@/lib/api";
import { useEffect, useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/persons", label: "Persons" },
  { href: "/documents", label: "Documents" },
  { href: "/search", label: "Search" },
  { href: "/travel-pack", label: "Travel Pack" },
  { href: "/compare", label: "Compare" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    // Validate token with API — clears stale/expired JWTs that cause 401s
    api("/auth/me")
      .then(() => setReady(true))
      .catch(() => {
        clearTokens();
        router.replace("/login");
      });
  }, [router]);

  if (!ready) return null;

  return (
    <>
      <nav className="nav">
        <Link href="/dashboard" className="brand">
          Doc Vault
        </Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={pathname.startsWith(l.href) ? "active" : ""}>
            {l.label}
          </Link>
        ))}
        <button
          className="btn secondary"
          onClick={() => {
            clearTokens();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </nav>
      <main className="container">{children}</main>
    </>
  );
}
