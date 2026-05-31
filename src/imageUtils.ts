/**
 * Image optimization utilities for the Wedding Webpage.
 * Re-formats Unsplash URLs to request specific dimensions, generates optimal srcset,
 * and tracks performance statistics.
 */

export function getOptimizedImageProps(url: string, baseWidth = 800, baseHeight = 600) {
  if (!url) {
    return {
      src: '',
      width: baseWidth,
      height: baseHeight,
    };
  }

  const isUnsplash = url.includes('images.unsplash.com');
  let src = url;
  let srcSet: string | undefined = undefined;

  if (isUnsplash) {
    const baseUrl = url.split('?')[0];
    src = `${baseUrl}?auto=format&fit=crop&q=80&w=${baseWidth}`;
    srcSet = [
      `${baseUrl}?auto=format&fit=crop&q=80&w=400 400w`,
      `${baseUrl}?auto=format&fit=crop&q=80&w=800 800w`,
      `${baseUrl}?auto=format&fit=crop&q=80&w=1200 1200w`,
      `${baseUrl}?auto=format&fit=crop&q=80&w=1600 1600w`
    ].join(', ');
  }

  return {
    src,
    srcSet,
    width: baseWidth,
    height: baseHeight,
  };
}
