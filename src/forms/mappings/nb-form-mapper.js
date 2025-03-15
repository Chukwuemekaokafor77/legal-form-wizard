// src/forms/mappings/nb-form-mapper.js

export const NBFamilyLawForms = {
  "72A": {
    title: "Notice of Action with Statement of Claim Attached",
    titleFr: "Avis d'action avec déclaration de réclamation jointe",
    applicableFor: ["Divorce", "Separation", "Child Support", "Spousal Support"],
    requiredFields: [
      "personalInfo.fullName",
      "respondentInfo.fullName",
      "marriageInfo.date",
      "marriageInfo.separationDate"
    ],
    fieldMappings: {
      courtFileNumber: {
        en: "Court File Number",
        fr: "Numéro de dossier du tribunal",
        generator: () => `NBFC-${Date.now().toString().slice(-6)}`
      },
      courtLocation: {
        en: "Court Location",
        fr: "Emplacement du tribunal",
        value: "Saint John",
        options: ["Saint John", "Moncton", "Fredericton"]
      },
      applicantName: {
        en: "Applicant Name",
        fr: "Nom du demandeur",
        path: "personalInfo.fullName"
      },
      applicantAddress: {
        en: "Applicant Address",
        fr: "Adresse du demandeur",
        fields: ["address.street", "address.city", "address.province", "address.postalCode"],
        formatter: (fields) => fields.join(", "),
        validate: (address) => address.length > 10
      },
      // ... other bilingual field mappings
    }
  },
  // Similar updates for other forms
};

// Enhanced form determination with validation
export const determineRequiredForms = (caseType, circumstances) => {
  const baseForms = {
    "Simple or joint divorce": ["72B"],
    "Separation with other issues": ["72A"],
    "Child Support": ["72A", "72J"],
    "Spousal Support": ["72A", "72J"],
    "Property Division": ["72A", "72J"]
  };

  const forms = baseForms[caseType] || [];
  
  if (circumstances.hasChildren) forms.push("72J");
  if (!circumstances.isJointApplication) forms.push("72U");
  if (circumstances.internationalElements) forms.push("72G");

  return [...new Set(forms)]; // Remove duplicates
};

// Enhanced mapping with validation
export const mapUserDataToForm = (formId, userData, lang = 'en') => {
  const form = NBFamilyLawForms[formId];
  if (!form) throw new Error(`Form ${formId} not found`);

  const mappedData = {};
  const missingFields = [];

  Object.entries(form.fieldMappings).forEach(([fieldKey, mapping]) => {
    const value = mapping.generator?.() || 
                 resolveFieldValue(userData, mapping.path || mapping.fields, lang);
    
    if (mapping.required && !value) {
      missingFields.push(mapping[lang] || fieldKey);
    }

    mappedData[fieldKey] = {
      value,
      meta: {
        label: mapping[lang] || fieldKey,
        description: mapping.description?.[lang],
        validation: mapping.validate?.(value)
      }
    };
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return mappedData;
};

// Helper function with error handling
const resolveFieldValue = (data, paths, lang) => {
  if (typeof paths === 'string') {
    const value = paths.split('.').reduce((obj, key) => obj?.[key], data);
    return value || t('missingField', lang);
  }
  
  if (Array.isArray(paths)) {
    const values = paths.map(path => 
      path.split('.').reduce((obj, key) => obj?.[key], data)
    );
    return values.filter(v => v !== undefined);
  }
  
  return null;
};

// Translation helper
const t = (key, lang) => ({
  missingField: {
    en: "Information not provided",
    fr: "Information non fournie"
  }
}[key][lang]);
