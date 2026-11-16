/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Photos from Supabase Storage (signed links to private buckets)
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/**`)]
      : [],
  },
};

export default nextConfig;
