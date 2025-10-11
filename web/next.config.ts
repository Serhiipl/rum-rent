import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: "/**",
  },
];

const seenHosts = new Set(remotePatterns.map((pattern) => pattern.hostname));

const addHost = (rawHost: string | null | undefined) => {
  const hostname = (rawHost ?? "").trim();
  if (!hostname || seenHosts.has(hostname)) return;
  seenHosts.add(hostname);
  remotePatterns.push({ protocol: "https", hostname, pathname: "/**" });
};

try {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl) {
    const { hostname } = new URL(baseUrl);
    addHost(hostname);
  }
} catch (error) {
  console.warn("Invalid NEXT_PUBLIC_BASE_URL provided:", error);
}

const extraHosts = process.env.NEXT_PUBLIC_IMAGE_HOSTS?.split(",") ?? [];
extraHosts.forEach((host) => addHost(host));

const nextConfig: NextConfig = {
  /* config options here */
  images: { remotePatterns },
  output: "standalone",
};

export default nextConfig;
