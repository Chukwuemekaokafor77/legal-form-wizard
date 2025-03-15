// src/utils/legalTerms.js
export const legalTerms = {
  "Divorce": {
    term: "Divorce",
    definition: "The legal ending of a marriage by court order",
    learnMore: "A divorce legally ends your marriage. You need to show that your marriage has broken down and usually that you've been separated for at least one year."
  },
  "Separation": {
    term: "Separation",
    definition: "When married spouses live apart with the intention of ending their relationship",
    learnMore: "You don't need a legal document to separate, but you may want a separation agreement to settle issues like support and property division.",
    relatedTerms: ["Separation Agreement", "Divorce"]
  },
  "Decision-making responsibility": {
    term: "Decision-making responsibility",
    definition: "The right to make important decisions about a child's care and upbringing",
    learnMore: "This includes decisions about health, education, religion, and significant extra-curricular activities."
  },
  "Parenting time": {
    term: "Parenting time",
    definition: "The time that a parent spends with their child",
    learnMore: "This can include daily care, homework time, and holiday schedules."
  },
  "Child support": {
    term: "Child support",
    definition: "Money paid by one parent to the other to help support their children",
    learnMore: "The amount is usually set according to the Child Support Guidelines."
  },
  "Spousal support": {
    term: "Spousal support",
    definition: "Money paid by one spouse to help support the other after separation",
    learnMore: "The amount and duration depend on factors like income, length of relationship, and economic disadvantage from the marriage."
  },
  "Filing": {
    term: "Filing",
    definition: "Submitting documents to the court to start or continue a legal proceeding",
    learnMore: "Documents must be filed in the correct court location with the proper fees or fee waiver.",
    relatedTerms: ["Court Fees", "Fee Waiver"]
  },
  "Service": {
    term: "Service",
    definition: "Officially delivering court documents to other parties in a legal proceeding",
    learnMore: "There are specific rules about how and when documents must be served. Proof of service is usually required.",
    relatedTerms: ["Affidavit of Service", "Service Rules"]
  }
  // Add more terms as needed
};

export function findTermDefinitions(text) {
  const terms = Object.keys(legalTerms);
  return terms.filter(term => text.toLowerCase().includes(term.toLowerCase()));
}

export function enrichTextWithDefinitions(text) {
  let enrichedText = text;
  const foundTerms = findTermDefinitions(text);

  foundTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    enrichedText = enrichedText.replace(regex, `<term>${term}</term>`);
  });

  return enrichedText;
}




// ... add more terms as needed
// };

export const getRelatedTerms = (term) => {
  const termData = legalTerms[term];
  if (!termData?.relatedTerms) return [];
  return termData.relatedTerms.map(relatedTerm => ({
    term: relatedTerm,
    ...legalTerms[relatedTerm]
  })).filter(Boolean);
};
