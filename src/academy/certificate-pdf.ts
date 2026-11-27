function safeFilename(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "learner";
}

/**
 * Render the dedicated A4 export layout, then place it on one landscape page.
 * Both packages load only when someone asks for the PDF.
 */
export async function downloadCertificatePdf(
  element: HTMLElement,
  name: string,
): Promise<void> {
  await document.fonts?.ready;
  await Promise.all(
    [...element.querySelectorAll("img")].map((image) =>
      image.decode().catch(() => undefined),
    ),
  );

  const [{ toPng }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);
  const image = await toPng(element, {
    width: 1123,
    height: 794,
    pixelRatio: 2,
    backgroundColor: "#fffdf7",
    cacheBust: true,
  });
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  pdf.addImage(
    image,
    "PNG",
    0,
    0,
    pdf.internal.pageSize.getWidth(),
    pdf.internal.pageSize.getHeight(),
    undefined,
    "FAST",
  );
  pdf.save(
    `Rotaract-Menengai-Certificate-${safeFilename(name) || "learner"}.pdf`,
  );
}
