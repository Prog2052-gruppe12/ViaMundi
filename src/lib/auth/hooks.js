"use client";

import { useRouter } from "next/navigation";
import { DEFAULT_AFTER_LOGIN, DEFAULT_AFTER_LOGOUT } from "./client";

export function useAuthRedirects() {
  const router = useRouter();

  function goAfterLogin(returnTo) {
    router.replace(returnTo || DEFAULT_AFTER_LOGIN);
  }

  function goAfterLogout() {
    router.replace(DEFAULT_AFTER_LOGOUT);
  }

  return { goAfterLogin, goAfterLogout };
}

