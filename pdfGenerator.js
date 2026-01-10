async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const PAGE_WIDTH = doc.internal.pageSize.width;
  const PAGE_HEIGHT = doc.internal.pageSize.height;
  const MARGIN = 40;
  const FOOTER_HEIGHT = 40;

  /* =============================
     COLLECT DATA
  ============================= */
  const token     = document.getElementById('token')?.value || '-';
  const country   = document.getElementById('country')?.value || '-';
  const fullname  = document.getElementById('fullname')?.value || '-';
  const gender    = document.querySelector('input[name="gender"]:checked')?.value || '-';
  const nic       = document.getElementById('nic')?.value || '-';
  const age       = document.getElementById('ageDisplay')?.textContent || '-';
  const passport  = document.querySelector('input[name="passport"]:checked')?.value || '-';
  const passportNo= document.getElementById('passportNumber')?.value || '-';
  const abroad    = document.querySelector('input[name="abroad"]:checked')?.value || '-';
  const phone     = document.getElementById('phone')?.value || '-';
  const remark    = document.getElementById('remark')?.value || '-';

  const fbrpr      = document.querySelector('input[name="fbr_pr"]:checked')?.value || '-';
  const sixMonths  = document.querySelector('input[name="six_months"]:checked')?.value || '-';
  const experience = document.querySelector('input[name="experience"]:checked')?.value || '-';
  const category   = document.querySelector('input[name="category"]:checked')?.value || '-';

  const skills = [...document.querySelectorAll('.block input[type="checkbox"]:checked')]
    .map(i => i.value).join(', ') || 'None';

  const photoImg = document.getElementById('photoPreview');
  const logoImg  = document.querySelector('.header img');

  /* =============================
     IMAGE → BASE64
  ============================= */
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

  /* =============================
     BACKGROUND
  ============================= */
  doc.setFillColor(245,245,245);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

  /* =============================
     HEADER
  ============================= */
  doc.setFillColor(16,148,31);
  doc.rect(0, 0, PAGE_WIDTH, 80, 'F');

  if (logo) doc.addImage(logo, "PNG", 20, 10, 60, 60);

  doc.setTextColor(255);
  doc.setFontSize(22);
  doc.setFont(undefined, "bold");
  doc.text("GREENWAY AGENCIES (PVT) LTD", PAGE_WIDTH / 2, 50, { align: "center" });

  /* =============================
     PHOTO
  ============================= */
  if (photo) {
    doc.setFillColor(255);
    doc.roundedRect(PAGE_WIDTH / 2 - 60, 95, 120, 150, 14, 14, 'FD');
    doc.addImage(photo, "PNG", PAGE_WIDTH / 2 - 60, 95, 120, 150);
  }

  /* =============================
     ROW HELPER
  ============================= */
  function row(label, value, x, y, w) {
    const lines = doc.splitTextToSize(String(value), w - 20);
    const boxHeight = Math.max(28, lines.length * 16 + 16);

    if (y + boxHeight + 40 > PAGE_HEIGHT - FOOTER_HEIGHT) {
      doc.addPage();
      y = MARGIN;
    }

    doc.setFontSize(11);
    doc.setTextColor(90);
    doc.text(label, x, y);

    doc.setFillColor(255);
    doc.setDrawColor(210);
    doc.roundedRect(x, y + 12, w, boxHeight, 8, 8, 'FD');

    doc.setTextColor(0);
    doc.text(lines, x + 10, y + 30);

    return y + boxHeight + 24;
  }

  /* =============================
     CONTENT
  ============================= */
  let y = 260;

  // TOKEN CARD
  doc.roundedRect(40, y, PAGE_WIDTH - 80, 100, 18, 18, 'FD');

  doc.setFillColor(34,139,34);
  doc.roundedRect(55, y + 25, 120, 50, 14, 14, 'F');

  doc.setTextColor(255);
  doc.setFontSize(14);
  doc.text("TOKEN", 115, y + 45, { align: "center" });
  doc.setFontSize(18);
  doc.text(token, 115, y + 70, { align: "center" });

  doc.setTextColor(0);
  doc.setFontSize(20);
  doc.text(fullname, PAGE_WIDTH / 2 + 80, y + 60, { align: "center" });

  y += 130;

  /* =============================
     PERSONAL DETAILS
  ============================= */
  doc.setFillColor(240,248,240);
  doc.roundedRect(40, y, PAGE_WIDTH - 80, 320, 18, 18, 'F');
  doc.setTextColor(34,139,34);
  doc.setFontSize(16);
  doc.text("Personal Details", 60, y + 30);

  let leftY = y + 60;
  let rightY = y + 60;

  leftY  = row("Gender", gender, 60, leftY, 220);
  leftY  = row("NIC", nic, 60, leftY, 220);
  leftY  = row("Age", age, 60, leftY, 220);
  leftY  = row("Country", country, 60, leftY, 220);

  rightY = row("Passport", passport, 320, rightY, 220);
  rightY = row("Passport No", passport === "Yes" ? passportNo : "-", 320, rightY, 220);
  rightY = row("Been Abroad", abroad, 320, rightY, 220);
  rightY = row("Phone", phone, 320, rightY, 220);

  y += 350;

  /* =============================
     SKILLS & ADDITIONAL INFO
  ============================= */
  const items = [
    { label: "Skills", value: skills },
    { label: "FBR & PR", value: fbrpr },
    { label: "6 Months Travel", value: sixMonths },
    { label: "Experience", value: experience },
    { label: "Category", value: category },
    { label: "Remark", value: remark }
  ];

  let tempY = y + 60;
  let totalHeight = 0;

  for (let item of items) {
    const lines = doc.splitTextToSize(item.value, PAGE_WIDTH - 120 - 20);
    totalHeight += Math.max(28, lines.length * 16 + 16) + 24;
  }

  doc.roundedRect(40, y, PAGE_WIDTH - 80, totalHeight + 50, 18, 18, 'FD');

  doc.setTextColor(34,139,34);
  doc.setFontSize(16);
  doc.text("Skills & Additional Information", 60, y + 30);

  for (let item of items) {
    tempY = row(item.label, item.value, 60, tempY, PAGE_WIDTH - 120);
  }

  /* =============================
     FOOTER
  ============================= */
  doc.setFontSize(10);
  doc.setTextColor(130);
  doc.text("© Greenway Agencies | www.greenway.lk",
    PAGE_WIDTH / 2,
    PAGE_HEIGHT - 20,
    { align: "center" }
  );

  doc.save(`${fullname}_Application.pdf`);

  /* =============================
     RESET FORM
  ============================= */
  document.getElementById("appPage").querySelectorAll("input, textarea, select").forEach(el => {
    if (el.type === "radio" || el.type === "checkbox") el.checked = false;
    else el.value = "";
  });

  document.getElementById("photoPreview").src = "";
  document.getElementById("ageDisplay").textContent = "--";
}
