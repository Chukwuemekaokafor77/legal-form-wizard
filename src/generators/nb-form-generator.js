import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { NBFamilyLawForms, determineRequiredForms, mapUserDataToForm } from '../mappings/nb-form-mapper';

class NBFamilyLawFormGenerator {
  constructor() {
    this.doc = new jsPDF();
    this.currentPage = 1;
    this.maxY = 270; // Maximum Y position before new page, reduced for footer
    this.margin = 15; // Standard margin
    this.headerY = 60; // Initial Y position after header
    this.baseFontSize = 10;
    this.headerFontSize = 16;
    this.sectionFontSize = 14;
    this.labelFontSize = 12;
    this.valueFontSize = 10;

    this.setFontStyles();
  }

  setFontStyles() {
    this.doc.setFont('helvetica', 'normal'); // Standard font
  }

  addPage() {
    this.doc.addPage();
    this.currentPage++;
    this.addFooter(); // Ensure footer on every page
    return this.headerY; // Return initial Y position for new page
  }

  checkPageBreak(y, requiredHeight = 10) {
    if (y + requiredHeight > this.maxY) {
      return this.addPage();
    }
    return y;
  }

  addHeader(formId, formTemplate) {
    this.doc.setFontSize(this.headerFontSize);
    this.doc.text("Province of New Brunswick", 105, 20, { align: "center" });
    this.doc.text("Court of King's Bench", 105, 30, { align: "center" });
    this.doc.text("Family Division", 105, 40, { align: "center" });
    this.doc.text(`Form ${formId}: ${formTemplate.title}`, 105, 50, { align: "center" });

    this.addFooter();
  }

  addFooter() {
    this.doc.setFontSize(this.baseFontSize);
    this.doc.setTextColor(128, 128, 128); // Gray color
    this.doc.text(`Page ${this.currentPage}`, 105, 285, { align: "center" });
    this.doc.setTextColor(0, 0, 0); // Reset text color
  }

  // Enhanced text function for wrapping and page breaks
  addWrappedText(text, x, y, width, fontSize = this.valueFontSize) {
    this.doc.setFontSize(fontSize);
    let textLines = this.doc.splitTextToSize(text, width);
    let currentY = y;

    textLines.forEach(line => {
      currentY = this.checkPageBreak(currentY);
      this.doc.text(line, x, currentY);
      currentY += 5; // Line height
    });

    return currentY;
  }

  async generateForm(formId, formData) {
    try {
      const formTemplate = NBFamilyLawForms[formId];
      this.addHeader(formId, formTemplate);

      // Add court file number if available
      let y = this.headerY;
      if (formData.courtFileNumber) {
        this.doc.setFontSize(this.valueFontSize);
        this.doc.text(`Court File Number: ${formData.courtFileNumber}`, this.margin, y);
        y += 10;
      }

      switch (formId) {
        case "72A":
          y = await this.generateForm72A(formData, y);
          break;
        case "72B":
          y = await this.generateForm72B(formData, y);
          break;
        case "72J":
          y = await this.generateForm72J(formData, y);
          break;
        case "72U":
          y = await this.generateForm72U(formData, y);
          break;
        default:
          throw new Error(`Unknown form type: ${formId}`);
      }

      return this.doc;
    } catch (error) {
      console.error(`Error generating form ${formId}:`, error);
      throw error;
    }
  }

  async generateForm72A(formData, startY) {
    let y = startY;
    this.doc.setFontSize(this.labelFontSize);

    y = this.checkPageBreak(y);
    this.doc.text("BETWEEN:", this.margin, y);
    y += 8;
    this.doc.setFontSize(this.valueFontSize);
    this.doc.text(formData.applicantName?.toUpperCase() || "", this.margin * 2, y);
    this.doc.setFontSize(this.labelFontSize);
    this.doc.text("APPLICANT", 150, y);

    y = this.checkPageBreak(y + 12);
    this.doc.setFontSize(this.labelFontSize);
    this.doc.text("AND:", this.margin, y);
    y += 8;
    this.doc.setFontSize(this.valueFontSize);
    this.doc.text(formData.respondentName?.toUpperCase() || "", this.margin * 2, y);
    this.doc.setFontSize(this.labelFontSize);
    this.doc.text("RESPONDENT", 150, y);

    y = this.checkPageBreak(y + 20);
    return y;
  }

  async generateForm72B(formData, startY) {
    let y = startY;
    this.doc.setFontSize(this.labelFontSize);

    y = this.checkPageBreak(y);
    this.doc.text("BETWEEN:", this.margin, y);
    y += 8;
    this.doc.setFontSize(this.valueFontSize);
    this.doc.text(formData.petitionerName?.toUpperCase() || "", this.margin * 2, y);
    this.doc.setFontSize(this.labelFontSize);
    this.doc.text("PETITIONER", 150, y);

    y = this.checkPageBreak(y + 12);
    this.doc.setFontSize(this.labelFontSize);
    this.doc.text("AND:", this.margin, y);
    y += 8;
    this.doc.setFontSize(this.valueFontSize);
    this.doc.text(formData.respondentName?.toUpperCase() || "", this.margin * 2, y);
    this.doc.setFontSize(this.labelFontSize);
    this.doc.text("RESPONDENT", 150, y);

    y = this.checkPageBreak(y + 20);
    return y;
  }

  async generateForm72J(formData, startY) {
    let y = startY;
    this.doc.setFontSize(this.sectionFontSize);

    y = this.checkPageBreak(y + 5);
    this.doc.text("FINANCIAL STATEMENT", 105, y, { align: "center" });

    y = this.checkPageBreak(y + 15);
    this.doc.setFontSize(this.sectionFontSize);
    this.doc.text("A. PERSONAL INFORMATION", this.margin, y);

    y = this.checkPageBreak(y + 10);
    this.doc.setFontSize(this.labelFontSize);
    this.doc.text("Name:", this.margin, y);
    this.doc.setFontSize(this.valueFontSize);
    this.doc.text(formData.name || "", this.margin + 20, y);

    y = this.checkPageBreak(y + 15);
    return y;
  }

  async generateForm72U(formData, startY) {
    let y = startY;
    this.doc.setFontSize(this.sectionFontSize);

    y = this.checkPageBreak(y + 5);
    this.doc.text("AFFIDAVIT OF SERVICE", 105, y, { align: "center" });

    y = this.checkPageBreak(y + 15);
    this.doc.setFontSize(this.labelFontSize);
    this.doc.text("I,", this.margin, y);
    this.doc.setFontSize(this.valueFontSize);
    this.doc.text(`${formData.deponentName || ""}, of ${formData.deponentAddress || ""},`, this.margin + 5, y);

    y = this.checkPageBreak(y + 15);
    return y;
  }
}

// Form generation function
export const generateCourtForms = async (userData, circumstances) => {
  try {
    // Determine which forms are needed
    const requiredForms = determineRequiredForms(userData.caseType, circumstances);
    const generatedForms = [];

    // Generate each required form
    for (const formId of requiredForms) {
      // Map user data to form fields
      const mappedData = mapUserDataToForm(formId, userData);

      // Generate the form
      const generator = new NBFamilyLawFormGenerator();
      const pdfDoc = await generator.generateForm(formId, mappedData);

      // Add to generated forms array
      generatedForms.push({
        formId,
        title: NBFamilyLawForms[formId].title,
        pdf: pdfDoc.output('datauristring') // Changed to datauristring
      });
    }

    return generatedForms;

  } catch (error) {
    console.error('Error generating court forms:', error);
    throw error;
  }
};

export { NBFamilyLawFormGenerator };
