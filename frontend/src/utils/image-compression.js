export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const loadImageBitmap = async (file) => {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const canvasToWebp = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to compress this image."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });

export const compressImageFile = async (file) => {
  if (
    typeof File === "undefined" ||
    !(file instanceof File) ||
    !file.type.startsWith("image/") ||
    file.size <= MAX_IMAGE_SIZE
  ) {
    return file;
  }

  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    throw new Error(
      `${file.name} is too large to compress safely. Please choose an image under 2 MB.`,
    );
  }

  let image;
  try {
    image = await loadImageBitmap(file);
    let width = image.width;
    let height = image.height;
    const initialScale = Math.min(
      1,
      4096 / Math.max(image.width, image.height),
    );
    width *= initialScale;
    height *= initialScale;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image compression is unavailable.");

    for (let scaleAttempt = 0; scaleAttempt < 10; scaleAttempt += 1) {
      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.86, 0.74, 0.62, 0.5, 0.4]) {
        const blob = await canvasToWebp(canvas, quality);
        if (blob.type === "image/webp" && blob.size <= MAX_IMAGE_SIZE) {
          const name = file.name.replace(/\.[^.]+$/, "") || "image";
          return new File([blob], `${name}.webp`, {
            type: "image/webp",
            lastModified: file.lastModified,
          });
        }
      }

      width *= 0.78;
      height *= 0.78;
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("too large")) {
      throw error;
    }
    throw new Error(
      `Unable to compress ${file.name}. Please choose a different image.`,
      { cause: error },
    );
  } finally {
    image?.close?.();
  }

  throw new Error(
    `${file.name} could not be compressed below 2 MB. Please choose a smaller image.`,
  );
};

export const compressFormDataImages = async (formData) => {
  const compressed = new FormData();
  for (const [key, value] of formData.entries()) {
    if (typeof File !== "undefined" && value instanceof File) {
      compressed.append(key, await compressImageFile(value));
    } else {
      compressed.append(key, value);
    }
  }
  return compressed;
};
