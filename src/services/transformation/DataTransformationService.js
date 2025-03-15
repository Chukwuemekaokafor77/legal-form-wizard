// src/services/transformation/DataTransformationService.js
class DataTransformationService {
  transformForBackend(answers) {
    const transformedData = {
      metadata: {
        submissionDate: new Date().toISOString(),
        province: answers.province,
        legalCategory: answers.legalCategory,
        caseType: answers.caseType,
        version: "1.0"
      },
      parties: {
        applicant: this.transformPersonalInfo(answers.personalInfo),
        respondent: this.transformRespondentInfo(answers.respondentInfo)
      },
      case: {
        description: answers.caseDescription,
        circumstances: this.transformCircumstances(answers),
        reliefSought: answers.reliefSought || []
      },
      relationships: {
        marriageInfo: this.transformMarriageInfo(answers.marriageInfo),
        children: this.transformChildrenInfo(answers.childrenInfo)
      },
      financials: this.transformFinancialInfo(answers.financialInfo)
    };

    return this.cleanObject(transformedData);
  }

  transformPersonalInfo(personalInfo) {
    return personalInfo ? {
      fullName: personalInfo.fullName,
      dateOfBirth: personalInfo.dateOfBirth,
      gender: personalInfo.gender,
      maritalStatus: personalInfo.maritalStatus,
      contact: {
        email: personalInfo.contact?.email,
        phone: personalInfo.contact?.phone,
        alternatePhone: personalInfo.contact?.alternatePhone
      },
      address: {
        street: personalInfo.address?.street,
        city: personalInfo.address?.city,
        province: personalInfo.address?.state,
        postalCode: personalInfo.address?.zipCode,
        country: personalInfo.address?.country || 'Canada'
      },
      identification: {
        type: personalInfo.identification?.type,
        number: personalInfo.identification?.number,
        issuingProvince: personalInfo.identification?.issuingProvince
      },
      employment: {
        status: personalInfo.employment?.status,
        occupation: personalInfo.employment?.occupation,
        employer: personalInfo.employment?.employer,
        income: {
          annual: personalInfo.employment?.annualIncome,
          frequency: personalInfo.employment?.paymentFrequency
        }
      }
    } : null;
  }

  transformRespondentInfo(respondentInfo) {
    return respondentInfo ? {
      fullName: respondentInfo.fullName,
      contact: {
        email: respondentInfo.email,
        phone: respondentInfo.phone
      },
      address: {
        street: respondentInfo.address?.street,
        city: respondentInfo.address?.city,
        province: respondentInfo.address?.state,
        postalCode: respondentInfo.address?.zipCode,
        country: respondentInfo.address?.country || 'Canada'
      },
      serviceInfo: {
        methodOfService: respondentInfo.serviceMethod,
        dateOfService: respondentInfo.serviceDate
      }
    } : null;
  }

  transformCircumstances(answers) {
    return {
      hasChildren: Boolean(answers.childrenInfo?.length),
      hasFinancialClaims: answers.reliefSought?.some(relief =>
        ['support', 'property', 'pension'].includes(relief.toLowerCase())
      ),
      isJointApplication: answers.isJointApplication || false,
      hasPropertyClaims: answers.reliefSought?.includes('property'),
      hasDomesticViolence: answers.hasDomesticViolence || false,
      requiresUrgentRelief: answers.requiresUrgentRelief || false
    };
  }

  transformMarriageInfo(marriageInfo) {
    return marriageInfo ? {
      dateOfMarriage: marriageInfo.date,
      placeOfMarriage: {
        city: marriageInfo.city,
        province: marriageInfo.province,
        country: marriageInfo.country
      },
      dateOfSeparation: marriageInfo.separationDate,
      cohabitationStartDate: marriageInfo.cohabitationDate,
      isCommonLaw: marriageInfo.isCommonLaw || false
    } : null;
  }

  transformChildrenInfo(childrenInfo) {
    return childrenInfo?.length ? childrenInfo.map(child => ({
      fullName: child.name,
      dateOfBirth: child.dateOfBirth,
      residingWith: child.residingWith,
      specialNeeds: child.specialNeeds || false,
      education: {
        currentlyEnrolled: child.isEnrolled,
        institution: child.schoolName,
        grade: child.grade
      }
    })) : null;
  }

  transformFinancialInfo(financialInfo) {
    return financialInfo ? {
      income: {
        employment: financialInfo.employmentIncome,
        selfEmployment: financialInfo.selfEmploymentIncome,
        other: financialInfo.otherIncome,
        total: financialInfo.totalIncome
      },
      expenses: {
        monthly: financialInfo.monthlyExpenses,
        annual: financialInfo.annualExpenses,
        childRelated: financialInfo.childExpenses
      },
      assets: financialInfo.assets?.map(asset => ({
        type: asset.type,
        description: asset.description,
        value: asset.value,
        ownership: asset.ownership
      })),
      debts: financialInfo.debts?.map(debt => ({
        type: debt.type,
        amount: debt.amount,
        monthlyPayment: debt.monthlyPayment
      }))
    } : null;
  }

  cleanObject(obj) {
    const clean = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleaned = this.cleanObject(value);
          if (Object.keys(cleaned).length > 0) {
            clean[key] = cleaned;
          }
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            clean[key] = value.map(item =>
              typeof item === 'object' ? this.cleanObject(item) : item
            );
          }
        } else {
          clean[key] = value;
        }
      }
    });
    return clean;
  }
}

export default new DataTransformationService();
