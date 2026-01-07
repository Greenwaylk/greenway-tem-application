async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  /* -------------------------
     COLLECT DATA
  ------------------------- */
  const token     = document.getElementById('token')?.value || '';
  const fullname  = document.getElementById('fullname')?.value || '';
  const gender    = document.querySelector('input[name="gender"]:checked')?.value || '';
  const nic       = document.getElementById('nic')?.value || '';
  const age       = document.getElementById('ageDisplay')?.textContent || '';
  const passport  = document.querySelector('input[name="passport"]:checked')?.value || '';
  const passportNo= document.getElementById('passportNo')?.value || '';
  const abroad    = document.querySelector('input[name="abroad"]:checked')?.value || '';
  const phone     = document.getElementById('phone')?.value || '';
  const skills    = [...document.querySelectorAll('input[type="checkbox"]:checked')]
                    .map(i => i.value).join(', ');

  const photoImg = document.getElementById('photoPreview');
  const logoImg  = document.querySelector('.header img');

  /* -------------------------
     IMAGE → BASE64
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
     PHOTO
  ------------------------- */
  if (photo) {
    doc.roundedRect(237, 95, 120, 150, 14, 14, 'FD');
    doc.addImage(photo, "PNG", 237, 95, 120, 150);
  }

  /* -------------------------
     HELPERS
  ------------------------- */
  function row(label, value, x, y, w = 250) {
    doc.setFontSize(11);
    doc.setTextColor(90);
    doc.text(label, x, y);

    const lines = doc.splitTextToSize(value || "-", w - 20);
    const boxHeight = Math.max(28, lines.length * 16 + 16);

    doc.setDrawColor(210);
    doc.setFillColor(255);
    doc.roundedRect(x, y + 12, w, boxHeight, 8, 8, 'FD');

    doc.setTextColor(0);
    doc.text(lines, x + 10, y + 30);

    return y + boxHeight + 24;
  }

  /* -------------------------
     CONTENT - UPGRADED DESIGN
  ------------------------- */
  let y = 260;

  // ===== HIGHLIGHT CARD: Token + Name =====
  doc.setFillColor(255);
  doc.roundedRect(40, y, 515, 100, 18, 18, 'F');
  doc.setDrawColor(220);
  doc.roundedRect(40, y, 515, 100, 18, 18);

  // Token badge
  doc.setFillColor(34,139,34);
  doc.roundedRect(55, y + 25, 120, 50, 14, 14, 'F');
  doc.setTextColor(255);
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("TOKEN", 115, y + 45, null, null, "center");
  doc.setFontSize(18);
  doc.text(token || "--", 115, y + 70, null, null, "center");

  // Full Name
  doc.setTextColor(0);
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text(fullname || "FULL NAME", 315, y + 55, null, null, "center");

  y += 130;

  // ===== SECTION 1 : PERSONAL DETAILS =====
  doc.setFillColor(240,248,240);
  doc.roundedRect(40, y, 515, 260, 18, 18, 'F');

  doc.setTextColor(34,139,34);
  doc.setFontSize(16);
  doc.text("Personal Details", 60, y + 30);

  let leftX = 60;
  let rightX = 320;
  let rowY = y + 60;

  rowY = row("Gender", gender, leftX, rowY, 220);
  rowY = row("NIC", nic, leftX, rowY, 220);
  rowY = row("Age", age, leftX, rowY, 220);

  let rowY2 = y + 60;
  rowY2 = row("Passport Available", passport, rightX, rowY2, 220);
  rowY2 = row("Been Abroad", abroad, rightX, rowY2, 220);
  rowY2 = row("Phone Number", phone, rightX, rowY2, 220);

  y += 280;

  // ===== SECTION 2 : SKILLS & ADDITIONAL INFO =====
  doc.setFillColor(255);
  doc.roundedRect(40, y, 515, 150, 18, 18, 'F');
  doc.setDrawColor(220);
  doc.roundedRect(40, y, 515, 150, 18, 18);

  doc.setTextColor(34,139,34);
  doc.setFontSize(16);
  doc.text("Skills & Additional Information", 60, y + 30);

  let infoY = y + 60;
  infoY = row("Skills", skills || "None", 60, infoY, 460);

  if (passport === "Yes") {
    infoY = row("Passport Number", passportNo, 60, infoY, 460);
  }

  /* -------------------------
     FOOTER
  ------------------------- */
  doc.setFontSize(10);
  doc.setTextColor(130);
  doc.text("© Greenway Agencies | www.greenway.lk", 297, 825, null, null, "center");

  doc.save(`${fullname || "Application"}_Application.pdf`);
}
