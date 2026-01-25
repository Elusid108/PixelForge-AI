import JSZip from 'jszip';
import { ImageItem } from '../../types';

export const createZipFromImages = async (items: ImageItem[]): Promise<Blob> => {
  const zip = new JSZip();
  const folder = zip.folder('PixelForge_Images');

  if (!folder) {
    throw new Error('Failed to create zip folder');
  }

  items.forEach((item) => {
    const filename = item.filename ? `${item.filename}.png` : `image_${item.timestamp}.png`;
    folder.file(filename, item.base64, { base64: true });
  });

  return await zip.generateAsync({ type: 'blob' });
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
