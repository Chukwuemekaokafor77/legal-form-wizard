// src/data/legalTermsGlossary.js

export const legalTermsGlossary = {
  // Core Family Law Concepts
  "divorce": {
    term: "Divorce",
    category: "Divorce",
    definition: "The legal dissolution of a valid marriage by a court judgment, terminating the marital status of spouses.",
    shortSummary: "Legal end of a marriage granted by court",
    legalReference: "Divorce Act (R.S.C., 1985, c. 3 (2nd Supp.))",
    example: "A couple separated for 12 months can apply for a no-fault divorce in Canada.",
    requiredForms: ["Form 8A (Ontario)", "Form 72B (New Brunswick)"],
    relatedTerms: ["separation", "spousal_support", "property_division"],
    resourceLinks: [
      "/forms/divorce-application",
      "/guides/divorce-process"
    ],
    fr: {
      term: "Divorce",
      definition: "La dissolution légale d'un mariage valide par jugement judiciaire, mettant fin au statut matrimonial des époux."
    }
  },

  "separation": {
    term: "Separation",
    category: "Divorce",
    definition: "The act of spouses living apart with the intention to end their marital relationship, which can be under the same roof if certain conditions are met.",
    shortSummary: "Living apart with intent to end marriage",
    legalReference: "Divorce Act Section 8(3)(a)",
    example: "A separated couple must wait 1 year before filing for divorce in most cases.",
    relatedTerms: ["divorce", "spousal_support", "matrimonial_home"],
    fr: {
      term: "Séparation",
      definition: "Le fait pour des époux de vivre séparément avec l'intention de mettre fin à leur relation matrimoniale."
    }
  },

  // Child-related Terms
  "decision_making_responsibility": {
    term: "Decision-making Responsibility",
    category: "Child Matters",
    definition: "Formerly called 'custody', this refers to the authority to make significant decisions about a child's health, education, religion, and extracurricular activities.",
    shortSummary: "Authority for major child decisions",
    legalReference: "Divorce Act Section 2(1)",
    example: "Parents may share decision-making responsibility for education but have sole responsibility for religious upbringing.",
    relatedTerms: ["parenting_time", "child_support"],
    fr: {
      term: "Responsabilité décisionnelle",
      definition: "Autorité de prendre des décisions importantes concernant la santé, l'éducation, la religion et les activités parascolaires d'un enfant."
    }
  },

  "parenting_time": {
    term: "Parenting Time",
    category: "Child Matters",
    definition: "The schedule determining when a child resides with each parent, including holiday and vacation arrangements.",
    shortSummary: "Child's living schedule between parents",
    legalReference: "Children's Law Reform Act (Ontario)",
    example: "A typical parenting schedule might alternate weeks with each parent.",
    relatedTerms: ["decision_making_responsibility", "contact_order"],
    fr: {
      term: "Temps parental",
      definition: "Calendrier déterminant quand un enfant réside avec chaque parent, y compris les arrangements pour les vacances."
    }
  },

  // Financial Terms
  "child_support": {
    term: "Child Support",
    category: "Financial Support",
    definition: "Mandatory financial payments calculated using Federal Child Support Guidelines based on the payor's income and number of children.",
    shortSummary: "Financial support for children",
    calculationTools: ["Federal Guidelines Tables", "Online Calculator"],
    legalReference: "Federal Child Support Guidelines",
    example: "A parent earning $60,000/year with two children would pay approximately $881/month in Ontario.",
    relatedTerms: ["spousal_support", "financial_disclosure"],
    fr: {
      term: "Pension alimentaire pour enfants",
      definition: "Paiements financiers obligatoires calculés selon les Lignes directrices fédérales sur les pensions alimentaires pour enfants."
    }
  },

  // Legal Processes
  "mediation": {
    term: "Family Mediation",
    category: "Dispute Resolution",
    definition: "A confidential process where a neutral third-party helps separating couples reach mutually acceptable agreements.",
    shortSummary: "Neutral assistance in reaching agreements",
    benefits: ["Cost-effective", "Faster than court", "Confidential"],
    legalReference: "Family Law Act Section 3(3)",
    example: "Mediation helped a couple agree on a parenting schedule without court involvement.",
    relatedTerms: ["alternative_dispute_resolution", "domestic_contract"],
    fr: {
      term: "Médiation familiale",
      definition: "Processus confidentiel où un tiers neutre aide les couples séparés à parvenir à des accords mutuellement acceptables."
    }
  },

  // Enhanced Terms from Question Schema
  "marriage_certificate": {
    term: "Marriage Certificate",
    category: "Documentation",
    definition: "Official document issued by a provincial/territorial government proving marriage registration.",
    shortSummary: "Proof of marriage registration",
    issuance: "Available through provincial vital statistics agencies",
    example: "Required for divorce applications to prove valid marriage.",
    relatedTerms: ["divorce", "domestic_contract"],
    fr: {
      term: "Certificat de mariage",
      definition: "Document officiel délivré par un gouvernement provincial/territorial prouvant l'enregistrement d'un mariage."
    }
  },

  "government_id": {
    term: "Government-Issued ID",
    category: "Documentation",
    definition: "Official identification document with photo issued by federal/provincial authorities.",
    shortSummary: "Valid photo identification",
    acceptedTypes: ["Driver's License", "Passport", "Provincial ID"],
    example: "Required for notarizing family law documents.",
    fr: {
      term: "Pièce d'identité gouvernementale",
      definition: "Document d'identification officiel avec photo émis par les autorités fédérales/provinciales."
    }
  }
};

// Utility Functions
export const getTermByCategory = (category) => {
  return Object.values(legalTermsGlossary).filter(term => term.category === category);
};

export const searchTerms = (query) => {
  const lowerQuery = query.toLowerCase();
  return Object.values(legalTermsGlossary).filter(term => 
    term.term.toLowerCase().includes(lowerQuery) ||
    term.definition.toLowerCase().includes(lowerQuery)
  );
};

export const getRelatedTerms = (termKey) => {
  const term = legalTermsGlossary[termKey];
  return term?.relatedTerms?.map(key => legalTermsGlossary[key]) || [];
};
