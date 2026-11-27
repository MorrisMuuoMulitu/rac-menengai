import { CERTIFICATE_PHOTO_MAX_LENGTH } from "../../shared/rotaract-academy/progress";

const ACCEPTED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const PORTRAIT_WIDTH = 560;
const PORTRAIT_HEIGHT = 700;

async function loadPortrait(
  file: File,
): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
    } catch {
      /* Safari and older browsers can reject the options overload. */
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The selected photo could not be read."));
    };
    image.src = url;
  });
}

/**
 * Crop and resize locally before the photo ever reaches the club server.
 * Canvas re-encoding also removes camera metadata such as GPS location.
 */
export async function prepareCertificatePhoto(file: File): Promise<string> {
  if (!ACCEPTED_PHOTO_TYPES.has(file.type))
    throw new Error("Choose a JPEG, PNG or WebP photo.");
  if (file.size > MAX_INPUT_BYTES)
    throw new Error("Choose a photo smaller than 12 MB.");

  const image = await loadPortrait(file);
  const sourceWidth = image.width;
  const sourceHeight = image.height;
  if (!sourceWidth || !sourceHeight)
    throw new Error("The selected photo could not be read.");

  const scale = Math.max(
    PORTRAIT_WIDTH / sourceWidth,
    PORTRAIT_HEIGHT / sourceHeight,
  );
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const offsetX = (PORTRAIT_WIDTH - drawWidth) / 2;
  const offsetY = (PORTRAIT_HEIGHT - drawHeight) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = PORTRAIT_WIDTH;
  canvas.height = PORTRAIT_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not prepare the photo.");

  context.fillStyle = "#fffdf7";
  context.fillRect(0, 0, PORTRAIT_WIDTH, PORTRAIT_HEIGHT);
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  if ("close" in image) image.close();

  let quality = 0.84;
  let photo = canvas.toDataURL("image/jpeg", quality);
  while (photo.length > CERTIFICATE_PHOTO_MAX_LENGTH && quality > 0.58) {
    quality -= 0.06;
    photo = canvas.toDataURL("image/jpeg", quality);
  }
  if (photo.length > CERTIFICATE_PHOTO_MAX_LENGTH)
    throw new Error("That photo is too detailed. Try a smaller crop.");
  return photo;
}
