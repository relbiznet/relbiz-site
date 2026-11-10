// In production, images uploaded via the admin (/uploads/*.png|jpg) are served as compressed WebP copies
// created by scripts/optimize-uploads.mjs after the build.
export const img = (src?: string) => {
  if (!src) return src;
  if (import.meta.env.PROD && src.startsWith('/uploads/') && /\.(png|jpe?g)$/i.test(src)) {
    return src.replace(/\.(png|jpe?g)$/i, '.webp');
  }
  return src;
};
