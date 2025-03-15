// src/services/forms/FormTemplateService.js
import { PDFDocument } from 'pdf-lib';

class FormTemplateService {
  async loadFormTemplate(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Get form fields
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      
      return {
        pdfDoc,
        fields: fields.map(field => ({
          name: field.getName(),
          type: field.constructor.name,
          isRequired: false // You can set this based on your requirements
        }))
      };
    } catch (error) {
      console.error('Error loading form template:', error);
      throw new Error('Failed to load form template');
    }
  }

  async fillFormTemplate(pdfDoc, mappedData) {
    try {
      const form = pdfDoc.getForm();
      
      // Fill in each field
      for (const [fieldName, value] of Object.entries(mappedData)) {
        const field = form.getField(fieldName);
        if (field) {
          switch (field.constructor.name) {
            case 'PDFTextField':
              field.setText(value?.toString() || '');
              break;
            case 'PDFCheckBox':
              if (value === true) {
                field.check();
              } else {
                field.uncheck();
              }
              break;
            case 'PDFRadioGroup':
              field.select(value?.toString() || '');
              break;
            default:
              console.warn(`Unsupported field type for ${fieldName}`);
          }
        }
      }

      // Flatten form (optional - makes it non-editable)
      // form.flatten();

      return pdfDoc;
    } catch (error) {
      console.error('Error filling form template:', error);
      throw new Error('Failed to fill form template');
    }
  }

  async downloadFilledForm(pdfDoc, fileName) {
    try {
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading filled form:', error);
      throw new Error('Failed to download filled form');
    }
  }
}

export default new FormTemplateService();