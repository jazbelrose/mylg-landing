import React, { useState, useEffect } from 'react';
import './progressive-image.css';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  placeholder?: string;
  cacheImage?: boolean; // Whether to cache in localStorage
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  width = "100%",
  height = "100%",
  className = "",
  onClick,
  style,
  aspectRatio = "16/9",
  placeholder,
  cacheImage = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cachedSrc, setCachedSrc] = useState<string | null>(null);

  // Check localStorage cache on mount
  useEffect(() => {
    if (cacheImage) {
      const cacheKey = `img_cache_${btoa(src)}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setCachedSrc(cached);
        setImageLoaded(true);
      }
    }
  }, [src, cacheImage]);

  // Preload image and cache if needed
  useEffect(() => {
    if (cachedSrc) return; // Already cached

    const img = new Image();
    
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
      
      // Cache the image data URL if caching is enabled
      if (cacheImage) {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg', 0.8);
            const cacheKey = `img_cache_${btoa(src)}`;
            
            // Only cache if under 2MB to avoid localStorage limits
            if (dataURL.length < 2 * 1024 * 1024) {
              localStorage.setItem(cacheKey, dataURL);
              setCachedSrc(dataURL);
            }
          }
        } catch (error) {
          console.warn('Failed to cache image:', error);
        }
      }
    };

    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };

    img.src = src;
  }, [src, cacheImage, cachedSrc]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    aspectRatio,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease-in-out',
    opacity: imageLoaded ? 1 : 0,
  };

  const loaderStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: imageLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    pointerEvents: 'none',
  };

  return (
    <div 
      className={`progressive-image-container ${className}`}
      style={containerStyle}
      onClick={onClick}
    >
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div style={loaderStyle} className="image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div style={loaderStyle} className="image-error">
          <span>Failed to load image</span>
        </div>
      )}

      {/* Placeholder image if provided */}
      {placeholder && !imageLoaded && !imageError && (
        <img
          src={placeholder}
          alt=""
          style={{
            ...imgStyle,
            opacity: 0.3,
            filter: 'blur(5px)',
          }}
        />
      )}

      {/* Main image */}
      <img
        src={cachedSrc || src}
        alt={alt}
        style={imgStyle}
        loading="lazy"
      />
    </div>
  );
};