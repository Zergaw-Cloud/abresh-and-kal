import { describe, it, expect } from 'vitest';
import { getOptimizedImageProps } from '../imageUtils';

describe('getOptimizedImageProps', () => {
  it('should return empty src and base dimensions when url is empty', () => {
    const result = getOptimizedImageProps('');
    expect(result).toEqual({
      src: '',
      srcSet: undefined,
      width: 800,
      height: 600,
    });
  });

  it('should format Unsplash URLs correctly and define srcSet offsets', () => {
    const unsplashUrl = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80';
    const result = getOptimizedImageProps(unsplashUrl, 1000, 750);

    expect(result.src).toContain('images.unsplash.com/photo-1511285560929-80b456fea0bc');
    expect(result.src).toContain('w=1000');
    expect(result.src).toContain('auto=format');
    expect(result.src).toContain('fit=crop');
    
    expect(result.srcSet).toBeDefined();
    expect(result.srcSet).toContain('w=400');
    expect(result.srcSet).toContain('w=800');
    expect(result.srcSet).toContain('w=1200');
    expect(result.srcSet).toContain('w=1600');
    
    expect(result.width).toBe(1000);
    expect(result.height).toBe(750);
  });

  it('should preserve non-Unsplash URLs intact without appending Unsplash parameters or srcSet', () => {
    const customUrl = 'https://myweddingassets.com/photo.png';
    const result = getOptimizedImageProps(customUrl, 500, 400);

    expect(result).toEqual({
      src: 'https://myweddingassets.com/photo.png',
      srcSet: undefined,
      width: 500,
      height: 400,
    });
  });
});
