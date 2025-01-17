export const extractImagePath = (imageUrl: string | null): string | null => {
    if (!imageUrl) return null;
    return imageUrl.replace('http://localhost:5000', '');
  };

