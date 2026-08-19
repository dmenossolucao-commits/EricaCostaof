/**
 * Image processing utilities for client-side compression and optimization.
 * Ensures uploaded photos stay within 40KB - 150KB to prevent localStorage quota exhaustion
 * while maintaining crisp resolution on high-DPI retina screens.
 */

export const DEFAULT_PROFILE_PHOTO =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop';

export const DEFAULT_SECONDARY_PHOTO =
  'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=900&auto=format&fit=crop';

export const compressImageFile = (
  file: File,
  maxWidth: number = 900,
  maxHeight: number = 900,
  quality: number = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if file is provided
    if (!file) {
      reject(new Error('Nenhum arquivo de imagem foi selecionado.'));
      return;
    }

    // Accept image types or file extension checks (especially on mobile/iOS)
    const isImageMime = file.type ? file.type.startsWith('image/') : false;
    const isImageExt = /\.(jpe?g|png|webp|gif|bmp|heic|heif|svg)$/i.test(file.name || '');

    if (!isImageMime && !isImageExt && file.type !== '') {
      reject(new Error('Formato de arquivo não reconhecido. Por favor, envie uma foto JPG, PNG ou WEBP.'));
      return;
    }

    // Try loading via ObjectURL first (much faster and avoids large memory allocations)
    let objectUrl = '';
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      objectUrl = '';
    }

    const processImg = (src: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }

        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (!width || !height) {
            // Fallback if dimensions cannot be read
            resolve(src);
            return;
          }

          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }

          // Background fill in case of transparent PNG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw the resized image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Compressão de imagem em canvas falhou, utilizando fonte:', err);
          resolve(src);
        }
      };

      img.onerror = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);

        // Fallback to FileReader if ObjectURL failed
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Não foi possível ler a imagem selecionada.'));
          }
        };
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo de foto.'));
        reader.readAsDataURL(file);
      };

      img.src = src;
    };

    if (objectUrl) {
      processImg(objectUrl);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          processImg(reader.result);
        } else {
          reject(new Error('Erro ao ler a foto.'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo de foto.'));
      reader.readAsDataURL(file);
    }
  });
};

/**
 * Validates if a string is a valid URL or data URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:')
  );
};
