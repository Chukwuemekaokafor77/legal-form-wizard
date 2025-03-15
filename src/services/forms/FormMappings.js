// src/services/forms/FormMappings.js
export const formMappings = {
    "72A": {
      // Notice of Action with Statement of Claim
      title: "Notice of Action with Statement of Claim Attached",
      sections: {
        header: {
          courtLocation: (data) => data.metadata.province === "New Brunswick" ? "Saint John" : "",
          fileNumber: (data) => data.metadata.fileNumber || "TBD",
          formTitle: "NOTICE OF ACTION WITH STATEMENT OF CLAIM ATTACHED"
        },
        parties: {
          applicant: {
            name: (data) => data.parties.applicant.fullName.toUpperCase(),
            address: (data) => [
              data.parties.applicant.address.street,
              data.parties.applicant.address.city,
              data.parties.applicant.address.province,
              data.parties.applicant.address.postalCode
            ].filter(Boolean).join(", ")
          },
          respondent: {
            name: (data) => data.parties.respondent.fullName.toUpperCase(),
            address: (data) => [
              data.parties.respondent.address.street,
              data.parties.respondent.address.city,
              data.parties.respondent.address.province,
              data.parties.respondent.address.postalCode
            ].filter(Boolean).join(", ")
          }
        },
        claim: {
          description: (data) => data.case.description,
          reliefSought: (data) => data.case.reliefSought.join("; ")
        }
      }
    },
    "72B": {
      // Petition for Divorce
      title: "Petition for Divorce",
      sections: {
        header: {
          courtLocation: (data) => data.metadata.province === "New Brunswick" ? "Saint John" : "",
          fileNumber: (data) => data.metadata.fileNumber || "TBD",
          formTitle: "PETITION FOR DIVORCE"
        },
        marriageDetails: {
          date: (data) => data.relationships.marriageInfo.dateOfMarriage,
          place: (data) => [
            data.relationships.marriageInfo.placeOfMarriage.city,
            data.relationships.marriageInfo.placeOfMarriage.province,
            data.relationships.marriageInfo.placeOfMarriage.country
          ].filter(Boolean).join(", "),
          separationDate: (data) => data.relationships.marriageInfo.dateOfSeparation,
          cohabitationDate: (data) => data.relationships.marriageInfo.cohabitationStartDate
        },
        parties: {
          petitioner: {
            name: (data) => data.parties.applicant.fullName.toUpperCase(),
            birthDate: (data) => data.parties.applicant.dateOfBirth,
            occupation: (data) => data.parties.applicant.employment.occupation,
            address: (data) => [
              data.parties.applicant.address.street,
              data.parties.applicant.address.city,
              data.parties.applicant.address.province,
              data.parties.applicant.address.postalCode
            ].filter(Boolean).join(", ")
          },
          respondent: {
            name: (data) => data.parties.respondent.fullName.toUpperCase(),
            address: (data) => [
              data.parties.respondent.address.street,
              data.parties.respondent.address.city,
              data.parties.respondent.address.province,
              data.parties.respondent.address.postalCode
            ].filter(Boolean).join(", ")
          }
        },
        children: {
          hasChildren: (data) => data.case.circumstances.hasChildren,
          details: (data) => data.relationships.children?.map(child => ({
            name: child.fullName,
            birthDate: child.dateOfBirth,
            residence: child.residingWith
          }))
        }
      }
    },
    "72J": {
      // Financial Statement
      title: "Financial Statement",
      sections: {
        header: {
          courtLocation: (data) => data.metadata.province === "New Brunswick" ? "Saint John" : "",
          fileNumber: (data) => data.metadata.fileNumber || "TBD",
          formTitle: "FINANCIAL STATEMENT"
        },
        personalInfo: {
          name: (data) => data.parties.applicant.fullName,
          address: (data) => [
            data.parties.applicant.address.street,
            data.parties.applicant.address.city,
            data.parties.applicant.address.province,
            data.parties.applicant.address.postalCode
          ].filter(Boolean).join(", "),
          occupation: (data) => data.parties.applicant.employment.occupation,
          employer: (data) => data.parties.applicant.employment.employer
        },
        income: {
          employment: (data) => data.financials.income.employment,
          selfEmployment: (data) => data.financials.income.selfEmployment,
          other: (data) => data.financials.income.other,
          total: (data) => data.financials.income.total
        },
        expenses: {
          monthly: (data) => data.financials.expenses.monthly,
          annual: (data) => data.financials.expenses.annual,
          childRelated: (data) => data.financials.expenses.childRelated
        },
        assets: {
          list: (data) => data.financials.assets?.map(asset => ({
            description: asset.description,
            value: asset.value,
            ownership: asset.ownership
          }))
        },
        debts: {
          list: (data) => data.financials.debts?.map(debt => ({
            type: debt.type,
            amount: debt.amount,
            monthlyPayment: debt.monthlyPayment
          }))
        }
      }
    },
    "72U": {
      // Affidavit of Service
      title: "Affidavit of Service",
      sections: {
        header: {
          courtLocation: (data) => data.metadata.province === "New Brunswick" ? "Saint John" : "",
          fileNumber: (data) => data.metadata.fileNumber || "TBD",
          formTitle: "AFFIDAVIT OF SERVICE"
        },
        service: {
          server: (data) => data.parties.respondent.serviceInfo.serverName,
          dateServed: (data) => data.parties.respondent.serviceInfo.dateOfService,
          methodOfService: (data) => data.parties.respondent.serviceInfo.methodOfService,
          locationServed: (data) => data.parties.respondent.serviceInfo.placeOfService,
          documentsServed: (data) => data.parties.respondent.serviceInfo.documentsServed
        },
        respondent: {
          name: (data) => data.parties.respondent.fullName,
          address: (data) => [
            data.parties.respondent.address.street,
            data.parties.respondent.address.city,
            data.parties.respondent.address.province,
            data.parties.respondent.address.postalCode
          ].filter(Boolean).join(", ")
        }
      }
    }
  };
  
  export const getFormMapping = (formId) => {
    const mapping = formMappings[formId];
    if (!mapping) {
      throw new Error(`No mapping found for form ${formId}`);
    }
    return mapping;
  };