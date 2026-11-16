/** @type {import('next').NextConfig} */

// Billeder fra Supabase Storage (minder) må vises med <Image>
const supabaseImages = [];
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  supabaseImages.push(new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/**`));
}

const nextConfig = {
  images: {
    remotePatterns: supabaseImages,
  },
};

export default nextConfig;
