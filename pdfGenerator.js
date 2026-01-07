async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  /* -------------------------
     COLLECT DATA
  ------------------------- */
  const fullname  = document.getElementById('fullname')?.value || '';
  const gender    = document.querySelector('input[name="gender"]:checked')?.value || '';
  const dob       = document.getElementById('dob')?.value || '';
  const marital   = document.querySelector('input[name="marital"]:checked')?.value || '';
  const passport  = document.querySelector('input[name="passport"]:checked')?.value || '';
  const religion  = document.getElementById('religion')?.value || '';

  const age = document.getElementById('ageDisplay')?.textContent || '';

  

  const skills     = [...document.querySelectorAll('#skills input:checked')].map(i=>i.value).join(', ');
  const talk       = [...document.querySelectorAll('#talk input:checked')].map(i=>i.value).join(', ');
  const understand = [...document.querySelectorAll('#understand input:checked')].map(i=>i.value).join(', ');

  const photoImg = document.getElementById('photoPreview');
  const logoImg  = document.querySelector('#header img'); // logo from page

  /* -------------------------
     SAFE IMAGE → BASE64
  ------------------------- */
  const toBase64 = (img) => new Promise(resolve => {
    if (!img || !img.src) return resolve(null);
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => resolve(null);
    image.src = img.src;
  });

  const logo  = await toBase64(logoImg);
  const photo = await toBase64(photoImg);

  /* -------------------------
     BACKGROUND
  ------------------------- */
  doc.setFillColor(245,245,245);
  doc.rect(0, 0, 595, 842, 'F');

  /* -------------------------
     HEADER
  ------------------------- */
  doc.setFillColor(16,148,31);
  doc.rect(0, 0, 595, 80, 'F');

  if (logo) doc.addImage(logo, "PNG", 20, 10, 60, 60);

  doc.setTextColor(255);
  doc.setFontSize(22);
  doc.setFont(undefined, "bold");
  doc.text("GREENWAY AGENCIES (PVT) LTD", 297, 50, null, null, "center");

  /* -------------------------
     PHOTO (TOP CENTER)
  ------------------------- */
  if (photo) {
    doc.setFillColor(255);
    doc.setDrawColor(200);
    doc.roundedRect(237, 95, 120, 150, 14, 14, 'FD');
    doc.addImage(photo, "PNG", 237, 95, 120, 150);
  }

  /* -------------------------
     HELPERS
  ------------------------- */
  function sectionTitle(text, x, y, w) {
    doc.setFillColor(34,139,34);
    doc.roundedRect(x, y, w, 26, 6, 6, 'F');
    doc.setTextColor(255);
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text(text, x + 10, y + 18);
  }

  function row(label, value, x, y, w = 250) {
  const labelFontSize = 11;
  const valueFontSize = 11;
  const paddingX = 10;
  const paddingY = 8;
  const minBoxHeight = 28;

  // LABEL
  doc.setFontSize(labelFontSize);
  doc.setTextColor(90);
  doc.text(label, x, y);

  // VALUE TEXT (wrap)
  doc.setFontSize(valueFontSize);
  doc.setTextColor(0);
  const textLines = doc.splitTextToSize(value || "-", w - paddingX * 2);

  // Calculate dynamic height
  const lineHeight = valueFontSize + 4;
  const textHeight = textLines.length * lineHeight;
  const boxHeight = Math.max(minBoxHeight, textHeight + paddingY * 2);

  // BOX
  doc.setDrawColor(210);
  doc.setFillColor(255);
  doc.roundedRect(x, y + 12, w, boxHeight, 8, 8, 'FD');

  // TEXT (perfect vertical alignment)
  doc.text(
    textLines,
    x + paddingX,
    y + 12 + paddingY + valueFontSize
  );

  // Return next Y position
  return y + boxHeight + 24;
}

  /* -------------------------
     TWO COLUMN LAYOUT
  ------------------------- */
  const leftX  = 50;
  const rightX = 315;
  let baseY = 285;

  sectionTitle("Personal Info", leftX, baseY, 260);
  sectionTitle("Skills & Language", rightX, baseY, 250);

  let yLeft  = baseY + 50;
  let yRight = baseY + 50;

   yLeft = row("Full Name", fullname, leftX, yLeft);
   yLeft = row("Gender", gender, leftX, yLeft);
   yLeft = row("Date of Birth", dob, leftX, yLeft);
   yLeft = row("Age", age, leftX, yLeft);
   yLeft = row("Marital Status", marital, leftX, yLeft);
   yLeft = row("Passport Available", passport, leftX, yLeft);
   yLeft = row("Religion", religion, leftX, yLeft);

   yRight = row("Skills", skills, rightX, yRight);
   yRight = row("Can Talk", talk, rightX, yRight);
   yRight = row("Can Understand", understand, rightX, yRight);

  /* -------------------------
     FOOTER
  ------------------------- */
  doc.setFontSize(10);
  doc.setTextColor(130);
  doc.text("© Greenway Agencies | www.greenway.lk", 297, 825, null, null, "center");

  doc.save(`${fullname || "Application"}_Application.pdf`);
}