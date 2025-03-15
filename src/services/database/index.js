// src/services/database/index.js
// Mock database service with sample data
const mockDatabase = {
  forms: {
    "72A": {
      form_number: "72A",
      title: "Notice of Action with Statement of Claim Attached",
      court_type: "Family",
      category: "Family Law",
      fields: [
        { field_name: "applicantName", mapping_path: "personalInfo.fullName", is_required: true },
        { field_name: "applicantAddress", mapping_path: "address", is_required: true },
        { field_name: "respondentName", mapping_path: "respondentInfo.fullName", is_required: true },
        { field_name: "claimDetails", mapping_path: "caseDescription", is_required: false }
      ],
      sections: [
        { section_name: "Parties", display_order: 1 },
        { section_name: "Claim Details", display_order: 2 }
      ]
    },
    "72B": {
      form_number: "72B",
      title: "Petition for Divorce",
      court_type: "Family",
      category: "Family Law",
      fields: [
        { field_name: "petitionerName", mapping_path: "personalInfo.fullName", is_required: true },
        { field_name: "marriageDate", mapping_path: "marriageInfo.date", is_required: true },
        { field_name: "separationDate", mapping_path: "marriageInfo.separationDate", is_required: true },
        { field_name: "groundsForDivorce", mapping_path: "divorceInfo.grounds", is_required: true }
      ],
      sections: [
        { section_name: "Parties", display_order: 1 },
        { section_name: "Marriage Details", display_order: 2 },
        { section_name: "Grounds for Divorce", display_order: 3 }
      ]
    }
  }
};

export const query = async (queryText, params = []) => {
  // Mock query function that returns data based on the query
  console.log('Mock query:', queryText, params);
  
  if (queryText.includes('form_templates')) {
    const formId = params[0];
    return [mockDatabase.forms[formId]];
  }
  
  if (queryText.includes('form_categories')) {
    return Object.values(mockDatabase.forms)
      .filter(form => 
        form.category === params[0] && 
        form.court_type === params[1]
      );
  }
  
  return [];
};

export default {
  query
};