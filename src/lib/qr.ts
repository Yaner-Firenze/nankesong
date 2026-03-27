import QRCode from "qrcode";

import { getAppUrl } from "@/lib/env";

export function buildPassUrl(id: string) {
  const baseUrl = getAppUrl();

  return `${baseUrl}/pass/${id}`;
}

export async function buildPassQrDataUrl(id: string) {
  return QRCode.toDataURL(buildPassUrl(id), {
    margin: 1,
    width: 280,
  });
}
