// src/services/documents/DocumentAnalysisService.js

/**
 * Service for analyzing uploaded documents and extracting relevant information
 * through OCR and AI-based detection to prefill form fields
 */
class DocumentAnalysisService {
  /**
   * Analyze a document and extract relevant information based on document type
   * @param {File} file - The document file to analyze
   * @param {string} documentType - Type of document (e.g., marriage_certificate, birth_certificate)
   * @returns {Promise<Object>} Extracted field values
   */
  async analyzeDocument(file, documentType) {
    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(file);
      
      // Send to OCR service
      const ocrResult = await this.performOCR(base64);
      
      // Extract fields based on document type
      return this.extractFields(ocrResult, documentType);
    } catch (error) {
      console.error('Document analysis error:', error);
      throw new Error('Failed to analyze document');
    }
  }
  
  /**
   * Convert file to base64 encoding for processing
   * @param {File} file - The file to convert
   * @returns {Promise<string>} Base64 encoded file
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }
  
  /**
   * Perform OCR on the document
   * @param {string} base64Image - Base64 encoded image
   * @returns {Promise<Object>} OCR results
   */
  async performOCR(base64Image) {
    // In production, this would call an actual OCR service API like Google Vision, AWS Textract, or Tesseract
    // For now, we'll mock the OCR results
    return this.mockOCRService(base64Image);
  }
  
  /**
   * Mock OCR service for development and testing
   * @param {string} base64Image - Base64 encoded image
   * @returns {Promise<Object>} Mocked OCR results
   */
  async mockOCRService(base64Image) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock OCR results based on the file size to simulate different documents
    const sizeHint = base64Image.length % 3;
    
    switch (sizeHint) {
      case 0:
        return {
          text: `
            CERTIFICATE OF MARRIAGE
            
            This is to certify that
            
            JOHN MICHAEL SMITH
            and
            SARAH ELIZABETH JONES
            
            were united in marriage on the
            15th day of June, 2018
            
            at SAINT JOHN, NEW BRUNSWICK
            
            Officiant: Rev. Robert Wilson
            Witnesses: James Thompson, Maria Garcia
          `,
          confidence: 0.92
        };
        
      case 1:
        return {
          text: `
            BIRTH CERTIFICATE
            
            Name: EMILY ROSE SMITH
            
            Date of Birth: March 12, 2020
            
            Place of Birth: Moncton, New Brunswick
            
            Sex: Female
            
            Mother's Name: SARAH ELIZABETH SMITH
            Father's Name: JOHN MICHAEL SMITH
            
            Registration Number: 202067890
          `,
          confidence: 0.89
        };
        
      case 2:
        return {
          text: `
            FINANCIAL STATEMENT
            
            Name: JOHN MICHAEL SMITH
            
            Date: November 10, 2022
            
            Annual Income: $78,500
            
            Monthly Expenses: $4,200
            
            Assets:
            - Home: $350,000
            - Savings: $45,000
            - Investments: $120,000
            
            Liabilities:
            - Mortgage: $220,000
            - Car Loan: $15,000
            - Credit Cards: $3,500
          `,
          confidence: 0.85
        };
        
      default:
        return {
          text: "Unrecognized document format",
          confidence: 0.4
        };
    }
  }
  
  /**
   * Extract fields from OCR results based on document type
   * @param {Object} ocrResult - The OCR processing results
   * @param {string} documentType - Type of document
   * @returns {Object} Extracted field values
   */
  extractFields(ocrResult, documentType) {
    switch(documentType) {
      case 'marriage_certificate':
        return this.extractMarriageCertificateFields(ocrResult);
      case 'birth_certificate':
        return this.extractBirthCertificateFields(ocrResult);
      case 'financial_statement':
        return this.extractFinancialFields(ocrResult);
      case 'separation_agreement':
        return this.extractSeparationAgreementFields(ocrResult);
      case 'proof_of_income':
        return this.extractIncomeFields(ocrResult);
      default:
        console.warn(`No specific extraction method for document type: ${documentType}`);
        return {};
    }
  }
  
  /**
   * Extract marriage certificate fields
   * @param {Object} ocrResult - OCR result containing document text
   * @returns {Object} Extracted marriage certificate fields
   */
  extractMarriageCertificateFields(ocrResult) {
    const text = ocrResult.text;
    
    // Use regex to extract key information
    const nameMatch = text.match(/([A-Z\s]+)\s+and\s+([A-Z\s]+)\s+were united/i);
    const dateMatch = text.match(/(\d+)(st|nd|rd|th)?\s+day\s+of\s+([A-Za-z]+),?\s+(\d{4})/i);
    const placeMatch = text.match(/at\s+([A-Z\s,]+)/i);
    
    // Format extracted data
    const spouseNames = nameMatch ? [
      nameMatch[1].trim(), 
      nameMatch[2].trim()
    ] : [];
    
    let marriageDate = null;
    if (dateMatch) {
      const day = dateMatch[1];
      const month = dateMatch[3];
      const year = dateMatch[4];
      
      // Convert month name to number
      const months = {
        'january': '01', 'february': '02', 'march': '03', 'april': '04',
        'may': '05', 'june': '06', 'july': '07', 'august': '08',
        'september': '09', 'october': '10', 'november': '11', 'december': '12'
      };
      
      const monthNum = months[month.toLowerCase()];
      if (monthNum) {
        marriageDate = `${year}-${monthNum}-${day.padStart(2, '0')}`;
      }
    }
    
    return {
      spouseNames,
      marriageDate,
      marriagePlace: placeMatch ? placeMatch[1].trim() : null,
      confidence: ocrResult.confidence,
      formFields: {
        'personalInfo.fullName': spouseNames[0] || '',
        'respondentInfo.fullName': spouseNames[1] || '',
        'marriageInfo.date': marriageDate || '',
        'marriageInfo.place': placeMatch ? placeMatch[1].trim() : ''
      }
    };
  }
  
  /**
   * Extract birth certificate fields
   * @param {Object} ocrResult - OCR result containing document text
   * @returns {Object} Extracted birth certificate fields
   */
  extractBirthCertificateFields(ocrResult) {
    const text = ocrResult.text;
    
    // Use regex to extract information
    const nameMatch = text.match(/Name:\s+([A-Z\s]+)/i);
    const dobMatch = text.match(/Date of Birth:\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
    const pobMatch = text.match(/Place of Birth:\s+([A-Za-z\s,]+)/i);
    const sexMatch = text.match(/Sex:\s+([A-Za-z]+)/i);
    const motherMatch = text.match(/Mother's Name:\s+([A-Z\s]+)/i);
    const fatherMatch = text.match(/Father's Name:\s+([A-Z\s]+)/i);
    
    // Parse date of birth to standard format
    let formattedDob = null;
    if (dobMatch) {
      const dobStr = dobMatch[1];
      try {
        const date = new Date(dobStr);
        formattedDob = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } catch (e) {
        console.warn('Could not parse date:', dobStr);
      }
    }
    
    return {
      childName: nameMatch ? nameMatch[1].trim() : null,
      dateOfBirth: formattedDob,
      placeOfBirth: pobMatch ? pobMatch[1].trim() : null,
      sex: sexMatch ? sexMatch[1].trim() : null,
      motherName: motherMatch ? motherMatch[1].trim() : null,
      fatherName: fatherMatch ? fatherMatch[1].trim() : null,
      confidence: ocrResult.confidence,
      formFields: {
        'childrenInfo[0].name': nameMatch ? nameMatch[1].trim() : '',
        'childrenInfo[0].dateOfBirth': formattedDob || '',
        'childrenInfo[0].sex': sexMatch ? sexMatch[1].trim() : '',
        'personalInfo.fullName': motherMatch ? motherMatch[1].trim() : '',
        'respondentInfo.fullName': fatherMatch ? fatherMatch[1].trim() : ''
      }
    };
  }
  
  /**
   * Extract financial statement fields
   * @param {Object} ocrResult - OCR result containing document text
   * @returns {Object} Extracted financial fields
   */
  extractFinancialFields(ocrResult) {
    const text = ocrResult.text;
    
    // Use regex to extract key information
    const nameMatch = text.match(/Name:\s+([A-Z\s]+)/i);
    const incomeMatch = text.match(/Annual Income:\s+\$?([\d,]+\.?\d*)/i);
    const expensesMatch = text.match(/Monthly Expenses:\s+\$?([\d,]+\.?\d*)/i);
    
    // Extract assets and liabilities sections
    const assetsSection = text.match(/Assets:([\s\S]*?)(?=Liabilities:|$)/i);
    const liabilitiesSection = text.match(/Liabilities:([\s\S]*?)(?=$)/i);
    
    // Parse income and expenses
    const income = incomeMatch ? 
      parseFloat(incomeMatch[1].replace(/,/g, '')) : null;
    
    const expenses = expensesMatch ? 
      parseFloat(expensesMatch[1].replace(/,/g, '')) : null;
    
    // Parse assets
    const assets = [];
    if (assetsSection && assetsSection[1]) {
      const assetLines = assetsSection[1].split('\n').filter(line => line.includes(':'));
      assetLines.forEach(line => {
        const assetMatch = line.match(/-\s*([^:]+):\s*\$?([\d,]+\.?\d*)/i);
        if (assetMatch) {
          assets.push({
            type: assetMatch[1].trim(),
            value: parseFloat(assetMatch[2].replace(/,/g, ''))
          });
        }
      });
    }
    
    // Parse liabilities
    const liabilities = [];
    if (liabilitiesSection && liabilitiesSection[1]) {
      const liabilityLines = liabilitiesSection[1].split('\n').filter(line => line.includes(':'));
      liabilityLines.forEach(line => {
        const liabilityMatch = line.match(/-\s*([^:]+):\s*\$?([\d,]+\.?\d*)/i);
        if (liabilityMatch) {
          liabilities.push({
            type: liabilityMatch[1].trim(),
            value: parseFloat(liabilityMatch[2].replace(/,/g, ''))
          });
        }
      });
    }
    
    return {
      name: nameMatch ? nameMatch[1].trim() : null,
      annualIncome: income,
      monthlyExpenses: expenses,
      assets,
      liabilities,
      netWorth: assets.reduce((sum, asset) => sum + asset.value, 0) - 
                liabilities.reduce((sum, liability) => sum + liability.value, 0),
      confidence: ocrResult.confidence,
      formFields: {
        'personalInfo.fullName': nameMatch ? nameMatch[1].trim() : '',
        'financialInfo.employmentIncome': income || '',
        'financialInfo.monthlyExpenses': expenses || '',
        'financialInfo.totalAssets': assets.reduce((sum, asset) => sum + asset.value, 0),
        'financialInfo.totalDebts': liabilities.reduce((sum, liability) => sum + liability.value, 0)
      }
    };
  }
  
  /**
   * Extract separation agreement fields
   * @param {Object} ocrResult - OCR result containing document text
   * @returns {Object} Extracted separation agreement fields
   */
  extractSeparationAgreementFields(ocrResult) {
    const text = ocrResult.text;
    
    // Extract separation date
    const separationDateMatch = text.match(/separated\s+on\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
    let separationDate = null;
    
    if (separationDateMatch) {
      try {
        const date = new Date(separationDateMatch[1]);
        separationDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } catch (e) {
        console.warn('Could not parse separation date:', separationDateMatch[1]);
      }
    }
    
    // Extract party names
    const partyMatch = text.match(/BETWEEN\s+([A-Z\s]+)\s+AND\s+([A-Z\s]+)/i);
    
    // Extract child support mentions
    const childSupportMatch = text.match(/child\s+support.+\$?([\d,]+\.?\d*)/i);
    const childSupport = childSupportMatch ? 
      parseFloat(childSupportMatch[1].replace(/,/g, '')) : null;
    
    // Extract spousal support mentions
    const spousalSupportMatch = text.match(/spousal\s+support.+\$?([\d,]+\.?\d*)/i);
    const spousalSupport = spousalSupportMatch ? 
      parseFloat(spousalSupportMatch[1].replace(/,/g, '')) : null;
    
    // Check for custody/parenting mentions
    const hasCustodyTerms = /custody|parenting\s+time|decision-making/i.test(text);
    
    // Check for property division mentions
    const hasPropertyDivision = /property\s+division|assets|matrimonial\s+home/i.test(text);
    
    return {
      separationDate,
      parties: partyMatch ? [partyMatch[1].trim(), partyMatch[2].trim()] : [],
      childSupport,
      spousalSupport,
      includesCustody: hasCustodyTerms,
      includesPropertyDivision: hasPropertyDivision,
      confidence: ocrResult.confidence,
      formFields: {
        'personalInfo.fullName': partyMatch ? partyMatch[1].trim() : '',
        'respondentInfo.fullName': partyMatch ? partyMatch[2].trim() : '',
        'marriageInfo.separationDate': separationDate || '',
        'supportInfo.childSupport': childSupport || '',
        'supportInfo.spousalSupport': spousalSupport || ''
      }
    };
  }
  
  /**
   * Extract income related fields from proof of income documents
   * @param {Object} ocrResult - OCR result containing document text
   * @returns {Object} Extracted income fields
   */
  extractIncomeFields(ocrResult) {
    const text = ocrResult.text;
    
    // Determine document type (pay stub, tax return, etc.)
    const isPayStub = /pay\s+stub|pay\s+statement|earnings/i.test(text);
    const isTaxReturn = /tax\s+return|t4|income\s+tax/i.test(text);
    
    // Extract name
    const nameMatch = text.match(/name:?\s+([A-Z\s]+)/i) || 
                     text.match(/employee:?\s+([A-Z\s]+)/i) ||
                     text.match(/taxpayer:?\s+([A-Z\s]+)/i);
    
    // Extract income figures
    let grossIncome = null;
    let netIncome = null;
    let annualIncome = null;
    
    if (isPayStub) {
      // Look for pay period amounts
      const grossMatch = text.match(/gross\s+pay:?\s+\$?([\d,]+\.?\d*)/i) ||
                        text.match(/total\s+earnings:?\s+\$?([\d,]+\.?\d*)/i);
      
      const netMatch = text.match(/net\s+pay:?\s+\$?([\d,]+\.?\d*)/i) ||
                      text.match(/take\s+home:?\s+\$?([\d,]+\.?\d*)/i);
      
      // Look for year-to-date amounts
      const ytdMatch = text.match(/ytd.+\$?([\d,]+\.?\d*)/i) ||
                      text.match(/year\s+to\s+date.+\$?([\d,]+\.?\d*)/i);
      
      grossIncome = grossMatch ? parseFloat(grossMatch[1].replace(/,/g, '')) : null;
      netIncome = netMatch ? parseFloat(netMatch[1].replace(/,/g, '')) : null;
      
      // Estimate annual income based on pay frequency
      if (grossIncome) {
        // Try to determine pay frequency
        const isWeekly = /weekly|week/i.test(text);
        const isBiweekly = /biweekly|bi-weekly|every\s+two\s+weeks/i.test(text);
        const isSemiMonthly = /semi-monthly|twice\s+a\s+month/i.test(text);
        const isMonthly = /monthly|month/i.test(text);
        
        // Calculate estimated annual income
        if (isWeekly) {
          annualIncome = grossIncome * 52;
        } else if (isBiweekly) {
          annualIncome = grossIncome * 26;
        } else if (isSemiMonthly) {
          annualIncome = grossIncome * 24;
        } else if (isMonthly) {
          annualIncome = grossIncome * 12;
        }
      }
      
      // If YTD amount and date are available, use that for more accuracy
      if (ytdMatch) {
        const ytdAmount = parseFloat(ytdMatch[1].replace(/,/g, ''));
        
        // Try to find the pay period end date
        const dateMatch = text.match(/(?:period|date)(?:\s+end|\s+ending)?:?\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i);
        
        if (dateMatch) {
          try {
            const periodDate = new Date(dateMatch[1]);
            const currentYear = periodDate.getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            
            // Calculate fraction of year completed
            const daysInYear = (currentYear % 4 === 0) ? 366 : 365;
            const daysPassed = Math.floor((periodDate - startOfYear) / (1000 * 60 * 60 * 24));
            const fractionOfYear = daysPassed / daysInYear;
            
            if (fractionOfYear > 0) {
              // Extrapolate annual income
              annualIncome = ytdAmount / fractionOfYear;
            }
          } catch (e) {
            console.warn('Could not parse pay period date:', dateMatch[1]);
          }
        }
      }
    } else if (isTaxReturn) {
      // Extract annual income from tax return
      const incomeMatch = text.match(/total\s+income:?\s+\$?([\d,]+\.?\d*)/i) ||
                         text.match(/net\s+income:?\s+\$?([\d,]+\.?\d*)/i) ||
                         text.match(/line\s+15000:?\s+\$?([\d,]+\.?\d*)/i);
      
      annualIncome = incomeMatch ? parseFloat(incomeMatch[1].replace(/,/g, '')) : null;
    }
    
    return {
      name: nameMatch ? nameMatch[1].trim() : null,
      documentType: isPayStub ? 'pay_stub' : isTaxReturn ? 'tax_return' : 'other',
      grossIncome,
      netIncome,
      annualIncome,
      confidence: ocrResult.confidence,
      formFields: {
        'personalInfo.fullName': nameMatch ? nameMatch[1].trim() : '',
        'financialInfo.employmentIncome': annualIncome || grossIncome || '',
        'financialInfo.annualIncome': annualIncome || ''
      }
    };
  }
}

export default new DocumentAnalysisService();