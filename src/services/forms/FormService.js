// src/services/forms/FormService.js
class FormService {
  // This is a mock implementation - replace with actual API calls in production
  async getFormsByCategory(category, courtType) {
    // Mock data for New Brunswick family law forms
    const forms = [
      {
        form_number: "72A",
        title: "Notice of Action with Statement of Claim Attached",
        category: "Family Law",
        court_type: "Supreme"
      },
      {
        form_number: "72B",
        title: "Petition for Divorce",
        category: "Family Law",
        court_type: "Supreme"
      },
      {
        form_number: "72J",
        title: "Financial Statement",
        category: "Family Law",
        court_type: "Supreme"
      }
    ];

    return forms.filter(form => 
      form.category === category && 
      form.court_type === courtType
    );
  }

  async mapUserDataToForm(formNumber, userData, mapping = {}) {
    // Map user data to form fields based on form type
    const mappedData = {};

    switch (formNumber) {
      case "72A":
        mappedData.applicantName = userData.personalInfo?.fullName;
        mappedData.applicantAddress = [
          userData.personalInfo?.address?.street,
          userData.personalInfo?.address?.city,
          userData.personalInfo?.address?.state,
          userData.personalInfo?.address?.zipCode
        ].filter(Boolean).join(", ");
        break;

      case "72B":
        mappedData.petitionerName = userData.personalInfo?.fullName;
        mappedData.marriageDate = userData.marriageInfo?.date;
        mappedData.separationDate = userData.marriageInfo?.separationDate;
        break;

      case "72J":
        mappedData.name = userData.personalInfo?.fullName;
        mappedData.occupation = userData.personalInfo?.employment?.occupation;
        mappedData.employer = userData.personalInfo?.employment?.employer;
        break;
    }

    // Apply custom field mapping if provided
    if (mapping) {
      Object.entries(mapping).forEach(([formField, userField]) => {
        const value = this.getNestedValue(userData, userField);
        if (value !== undefined) {
          mappedData[formField] = value;
        }
      });
    }

    return mappedData;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // Add this method to get form fields
  getFormFields(formNumber) {
    // Mock form field definitions
    const formFields = {
      "72A": [
        { name: "applicantName", type: "text", required: true },
        { name: "applicantAddress", type: "text", required: true },
        { name: "respondentName", type: "text", required: true },
        { name: "respondentAddress", type: "text", required: true }
      ],
      "72B": [
        { name: "petitionerName", type: "text", required: true },
        { name: "marriageDate", type: "date", required: true },
        { name: "separationDate", type: "date", required: true },
        { name: "groundsForDivorce", type: "text", required: true }
      ],
      "72J": [
        { name: "name", type: "text", required: true },
        { name: "occupation", type: "text", required: true },
        { name: "employer", type: "text", required: true },
        { name: "annualIncome", type: "number", required: true }
      ]
    };

    return formFields[formNumber] || [];
  }
}

export default new FormService();