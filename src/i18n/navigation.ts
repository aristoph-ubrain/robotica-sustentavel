import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Versões de Link/redirect/usePathname/useRouter que já incluem o prefixo
// de idioma. Use sempre estas no lugar das de "next/link" e "next/navigation".
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
