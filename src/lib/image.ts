import type { Orientation, Photo } from "./types";

let counter = 0;
const uid = () => `p_${Date.now().toString(36)}_${(counter++).toString(36)}`;

function classify(width: number, height: number): Orientation {
  const ratio = width / height;
  if (ratio > 1.08) return "landscape";
  if (ratio < 0.92) return "portrait";
  return "square";
}

/**
 * Reads a File into a Photo, measuring its natural dimensions. Modern browsers
 * apply EXIF orientation to <img> automatically (and naturalWidth/Height are
 * reported post-rotation via image-orientation:from-image), so vertical iPhone
 * shots are classified correctly.
 */
export function fileToPhoto(file: File): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        id: uid(),
        url,
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 1000,
        orientation: classify(
          img.naturalWidth || 800,
          img.naturalHeight || 1000
        ),
        name: file.name,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name}`));
    };
    img.src = url;
  });
}

export async function filesToPhotos(files: FileList | File[]): Promise<Photo[]> {
  const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
  const results = await Promise.allSettled(list.map(fileToPhoto));
  return results
    .filter((r): r is PromiseFulfilledResult<Photo> => r.status === "fulfilled")
    .map((r) => r.value);
}
