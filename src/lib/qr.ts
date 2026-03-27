import QRCode from "qrcode";

import { getEnv } from "@/lib/env";

export function buildPassUrl(id: string) {
  const baseUrl = getEnv().APP_URL.replace(/\/$/, "");

  return `${baseUrl}/pass/${id}`;
}

export async function buildPassQrDataUrl(id: string) {
  return QRCode.toDataURL(buildPassUrl(id), {
    margin: 1,
    width: 280,
  });
}
