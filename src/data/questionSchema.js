// src/data/questionSchema.js

/**
 * Reusable validation rules
 */
export const VALIDATION_RULES = {
  date: {
    type: "date",
    rules: [
      { rule: "required", message: "Date is required" },
      { rule: "pastDate", message: "Date must be in the past" }
    ]
  },
  dateOfBirth: {
    type: "date",
    rules: [
      { rule: "required", message: "Date of birth is required" },
      { rule: "pastDate", message: "Date must be in the past" },
      { rule: "minAge", value: 18, message: "Must be at least 18 years old" }
    ]
  },
  email: {
    type: "email",
    rules: [
      { rule: "required", message: "Email is required" },
      { rule: "email", message: "Must be a valid email address" }
    ]
  },
  phone: {
    type: "tel",
    rules: [
      { rule: "required", message: "Phone number is required" },
      { rule: "phone", message: "Must be a valid phone number" }
    ]
  }
};

/**
 * Province definitions with metadata
 */
export const PROVINCES = {
  "Alberta": {
    code: "AB",
    courts: ["Court of King's Bench", "Provincial Court"],
    jurisdictions: ["Family", "Civil", "Criminal"],
    filingFees: {
      divorce: 260,
      civilClaim: 200
    }
  },
  "British Columbia": {
    code: "BC",
    courts: ["Supreme Court", "Provincial Court"],
    jurisdictions: ["Family", "Civil", "Criminal"],
    filingFees: {
      divorce: 290,
      civilClaim: 210
    }
  }
  // ... other provinces
};

/**
 * Main question schema
 */
export const questionSchema = {
  "province": {
    type: "select",
    label: "Select your province",
    required: true,
    help: "Select the province where you plan to file your case",
    options: Object.keys(PROVINCES),
    validation: {
      rules: [
        { rule: "required", message: "Province is required to determine applicable forms" }
      ]
    }
  },

  "caseTypes": {
    "Family Law": {
      icon: "👨‍👩‍👧‍👦",
      description: "Family law matters including divorce, custody, and support",
      categories: {
        "Simple or joint divorce": {
          icon: "⚖️",
          description: "Uncontested divorce where both parties agree or no other issues exist",
          estimatedTime: 60,
          requiredDocuments: [
            {
              id: "marriage_certificate",
              name: "Marriage Certificate",
              description: "Original or certified copy of marriage certificate",
              required: true,
              acceptedFormats: ["pdf", "jpg", "png"],
              maxSize: 10 // MB
            },
            {
              id: "government_id",
              name: "Government-issued ID",
              description: "Valid photo ID such as driver's license or passport",
              required: true,
              acceptedFormats: ["pdf", "jpg", "png"],
              maxSize: 5
            },
            {
              id: "proof_address",
              name: "Proof of Address",
              description: "Recent utility bill or government document showing current address",
              required: true,
              acceptedFormats: ["pdf", "jpg", "png"],
              maxSize: 5
            }
          ],
          sections: [
            {
              id: "marriageInfo",
              title: "Marriage Details",
              description: "Information about your marriage",
              icon: "💍",
              fields: [
                {
                  id: "marriageDate",
                  type: "date",
                  label: "Date of Marriage",
                  required: true,
                  validation: VALIDATION_RULES.date,
                  help: "Date when marriage was solemnized",
                  prefill: {
                    source: "marriage_certificate",
                    field: "date_of_marriage"
                  }
                },
                {
                  id: "marriagePlace",
                  type: "text",
                  label: "Place of Marriage",
                  required: true,
                  help: "City and country where marriage took place",
                  validation: {
                    rules: [
                      { rule: "required", message: "Place of marriage is required" },
                      { rule: "minLength", value: 3, message: "Must be at least 3 characters" }
                    ]
                  },
                  prefill: {
                    source: "marriage_certificate",
                    field: "place_of_marriage"
                  }
                },
                {
                  id: "separationDate",
                  type: "date",
                  label: "Date of Separation",
                  required: true,
                  validation: {
                    ...VALIDATION_RULES.date,
                    rules: [
                      ...VALIDATION_RULES.date.rules,
                      { 
                        rule: "afterDate", 
                        field: "marriageDate",
                        message: "Separation date must be after marriage date" 
                      }
                    ]
                  },
                  help: "Date when you and your spouse began living separately"
                }
              ]
            },
            {
              id: "childrenInfo",
              title: "Children",
              description: "Information about children from the marriage",
              icon: "👶",
              conditional: {
                question: "Do you have children from this marriage?",
                type: "boolean",
                help: "Include children born or adopted during the marriage"
              },
              fields: [
                {
                  id: "children",
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    fields: [
                      {
                        id: "childName",
                        type: "text",
                        label: "Child's Full Name",
                        required: true,
                        validation: {
                          rules: [
                            { rule: "required", message: "Child's name is required" },
                            { rule: "minLength", value: 2, message: "Name must be at least 2 characters" }
                          ]
                        }
                      },
                      {
                        id: "childDOB",
                        type: "date",
                        label: "Child's Date of Birth",
                        required: true,
                        validation: {
                          rules: [
                            { rule: "required", message: "Date of birth is required" },
                            { rule: "pastDate", message: "Date must be in the past" },
                            { 
                              rule: "afterDate", 
                              field: "marriageDate",
                              message: "Child's birth date must be after marriage date" 
                            }
                          ]
                        }
                      },
                      {
                        id: "childResidence",
                        type: "text",
                        label: "Child's Current Residence",
                        required: true,
                        help: "Address where child primarily resides"
                      }
                    ]
                  }
                }
              ]
            }
          ],
          provincialForms: {
            "New Brunswick": {
              forms: [
                {
                  id: "72B",
                  name: "Petition for Divorce",
                  required: true,
                  fee: 120
                },
                {
                  id: "72J",
                  name: "Financial Statement",
                  required: true,
                  conditional: {
                    field: "hasChildren",
                    value: true
                  }
                }
              ],
              totalFees: 435,
              filingLocation: "Court of King's Bench"
            },
            "Ontario": {
              forms: [
                {
                  id: "Form 8A",
                  name: "Application (Divorce)",
                  required: true,
                  fee: 160
                }
              ],
              totalFees: 450,
              filingLocation: "Superior Court of Justice"
            }
          }
        }
      }
    }
  }
};
