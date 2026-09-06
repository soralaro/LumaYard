type GeoLocation = { countryCode: string | null; countryName: string | null; regionName: string | null; city: string | null };
const emptyLocation: GeoLocation = { countryCode: null, countryName: null, regionName: null, city: null };

function isPrivateIp(ip: string | null) {
  if (!ip) return true;
  const normalized = ip.replace(/^::ffff:/, "");
  return normalized === "::1" || normalized === "127.0.0.1" || normalized.startsWith("10.") || normalized.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized);
}

export async function lookupGeoLocation(ip: string | null): Promise<GeoLocation> {
  if (isPrivateIp(ip)) return emptyLocation;
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip!)}`, { signal: AbortSignal.timeout(2_000), cache: "no-store" });
    if (!response.ok) return emptyLocation;
    const data = await response.json() as { success?: boolean; country_code?: string; country?: string; region?: string; city?: string };
    if (data.success === false) return emptyLocation;
    return { countryCode: data.country_code || null, countryName: data.country || null, regionName: data.region || null, city: data.city || null };
  } catch { return emptyLocation; }
}
