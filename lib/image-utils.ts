export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'File must be an image';
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image must be smaller than 5MB';
  }

  return null;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getImageUrl(imageData: string | null | undefined): string {
  if (!imageData) return '/restaurant-dish.jpg';
  return imageData;
}
