// Bilder vor Upload komprimieren (4MB → ~200KB)
export function compressImage(file, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve) => {
    // PDFs nicht komprimieren
    if (file.type === 'application/pdf') {
      resolve(file);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;

        // Nur verkleinern wenn nötig
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressed = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            console.log(`Compressed: ${(file.size/1024).toFixed(0)}KB → ${(compressed.size/1024).toFixed(0)}KB`);
            resolve(compressed);
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
