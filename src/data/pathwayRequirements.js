// src/data/pathwayRequirements.js

export const pathwayRequirements = {
  "joint_divorce": {
    id: "joint_divorce",
    title: "Joint Divorce",
    description: "Apply for a divorce together with your spouse",
    requiresAccount: false,
    estimatedTime: 30, // Increased for potential complexity
    category: "Divorce", // Added category
    jurisdiction: "Federal", // Added jurisdiction
    levelOfAssistance: "Self-Represented", // Added level of assistance
    suitableFor: "Couples who agree on all terms of their divorce", // Added suitability criteria
    excludedSituations: [ // Added exclusions
      "High-conflict situations",
      "Disagreement on property division",
      "Domestic violence"
    ],
    requiredDocuments: [
      {
        id: "marriage_certificate",
        name: "Marriage Certificate",
        description: "Original or certified copy of your marriage certificate",
        templateLink: "/templates/marriage-certificate.pdf", // Added template link
        sampleLink: "/samples/marriage-certificate.pdf" // Added sample link
      },
      {
        id: "separation_agreement",
        name: "Separation Agreement",
        description: "If you have one",
        optional: true,
        templateLink: "/templates/separation-agreement.pdf",
        sampleLink: "/samples/separation-agreement.pdf"
      }
    ],
    eligibilityCriteria: [
      "You and your spouse agree to divorce",
      "You have been separated for at least one year (or grounds for immediate divorce exist)", // Clarified
      "You have no unresolved claims besides divorce", // Clarified
      "Both parties are willing to cooperate" // Added
    ],
    helpfulResources: [ // Added resources
      {
        name: "Divorce Act",
        link: "https://laws-lois.justice.gc.ca/eng/acts/d-3.4/"
      },
      {
        name: "Family Law Information Centres",
        link: "/info-centres"
      }
    ],
    estimatedCost: "$0 - $1000 (court fees and potential legal advice)", // Added cost
    nextSteps: [ // Added next steps
      "Complete all required forms",
      "File forms with the court",
      "Serve your spouse with the documents",
      "Attend court hearings"
    ],
    successIndicators: [ // Added success indicators
      "Divorce granted by the court",
      "Terms of divorce are clear and enforceable"
    ],
    commonChallenges: [ // Added challenges
      "Locating missing documents",
      "Serving the other party",
      "Understanding court procedures"
    ],
    fr: { // Added French translation
      title: "Divorce Conjoint",
      description: "Demander le divorce conjointement avec votre conjoint(e)",
      requiredDocuments: [
        {
          name: "Acte de mariage",
          description: "Copie originale ou certifiée de votre acte de mariage"
        },
        {
          name: "Accord de séparation",
          description: "Si vous en avez un",
          optional: true
        }
      ],
      eligibilityCriteria: [
        "Vous et votre conjoint(e) consentez au divorce",
        "Vous êtes séparés depuis au moins un an",
        "Vous n'avez aucune autre réclamation que le divorce"
      ]
    }
  },
  "simple_divorce": {
    id: "simple_divorce",
    title: "Simple Divorce",
    description: "Apply for a divorce on your own with no other issues",
    requiresAccount: false,
    estimatedTime: 45, // Increased for solo application
    category: "Divorce",
    jurisdiction: "Federal",
    levelOfAssistance: "Self-Represented",
    suitableFor: "Individuals who meet specific criteria for an uncontested divorce",
    excludedSituations: [
      "Spouse cannot be located",
      "Disagreement on divorce terms",
      "Complex legal issues"
    ],
    requiredDocuments: [
      {
        id: "marriage_certificate",
        name: "Marriage Certificate",
        description: "Original or certified copy of your marriage certificate",
        templateLink: "/templates/marriage-certificate.pdf",
        sampleLink: "/samples/marriage-certificate.pdf"
      },
      {
        id: "spouse_service",
        name: "Proof of Service",
        description: "Evidence that your spouse was served with the divorce application",
        templateLink: "/templates/proof-of-service.pdf",
        sampleLink: "/samples/proof-of-service.pdf"
      }
    ],
    eligibilityCriteria: [
      "You have been separated for at least one year (or grounds for immediate divorce exist)",
      "You have no children from the marriage",
      "You have no significant property to divide", // Clarified
      "You are not seeking spousal support", // Clarified
      "Your spouse is unlikely to contest the divorce" // Added
    ],
    helpfulResources: [
      {
        name: "Divorce Act",
        link: "https://laws-lois.justice.gc.ca/eng/acts/d-3.4/"
      },
      {
        name: "Court Services Online",
        link: "/court-services-online"
      }
    ],
    estimatedCost: "$150 - $1500 (court fees, service fees, legal consultation)",
    nextSteps: [
      "Complete all required forms",
      "File forms with the court",
      "Arrange for service of documents to your spouse",
      "Prepare for potential court appearances"
    ],
    successIndicators: [
      "Divorce granted without contest",
      "All legal requirements are met"
    ],
    commonChallenges: [
      "Serving the other party",
      "Dealing with uncooperative spouse",
      "Managing court deadlines"
    ],
    fr: {
      title: "Divorce Simple",
      description: "Demander le divorce seul(e) sans autres problèmes",
      requiredDocuments: [
        {
          name: "Acte de mariage",
          description: "Copie originale ou certifiée de votre acte de mariage"
        },
        {
          name: "Preuve de signification",
          description: "Preuve que votre conjoint(e) a été signifié(e) de la demande de divorce"
        }
      ],
      eligibilityCriteria: [
        "Vous êtes séparé(e) depuis au moins un an",
        "Vous n'avez pas d'enfants issus du mariage",
        "Vous n'avez pas de biens importants à partager",
        "Vous ne demandez pas de pension alimentaire",
        "Votre conjoint(e) est peu susceptible de contester le divorce"
      ]
    }
  },
  "decision_making": {
    id: "decision_making",
    title: "Decision Making Responsibility",
    description: "Apply for decision-making responsibility for children",
    requiresAccount: true,
    estimatedTime: 180, // Increased for complexity
    category: "Child Matters",
    jurisdiction: "Provincial/Territorial",
    levelOfAssistance: "May require legal assistance", // Changed level
    suitableFor: "Parents seeking orders regarding children's upbringing",
    excludedSituations: [
      "Cases involving international child abduction",
      "Complex mental health issues",
      "Substance abuse concerns"
    ],
    requiredDocuments: [
      {
        id: "children_birth_certificates",
        name: "Children's Birth Certificates",
        description: "Birth certificates for all children involved",
        templateLink: "/templates/birth-certificate.pdf",
        sampleLink: "/samples/birth-certificate.pdf"
      },
      {
        id: "financial_statement",
        name: "Financial Statement",
        description: "Form 13: Financial Statement",
        templateLink: "/templates/financial-statement.pdf",
        sampleLink: "/samples/financial-statement.pdf"
      },
      {
        id: "income_proof",
        name: "Proof of Income",
        description: "Recent pay stubs, tax returns, or other income documentation",
        templateLink: "/templates/proof-of-income.pdf",
        sampleLink: "/samples/proof-of-income.pdf"
      }
    ],
    eligibilityCriteria: [
      "You have children under 18",
      "You are a parent or legal guardian",
      "The children primarily reside in the province/territory",
      "You are capable of providing a stable and supportive environment" // Added
    ],
    helpfulResources: [
      {
        name: "Children's Law Reform Act",
        link: "/childrens-law-reform-act"
      },
      {
        name: "Office of the Children's Lawyer",
        link: "/office-of-childrens-lawyer"
      }
    ],
    estimatedCost: "$500 - $10,000+ (legal fees, court costs, assessments)",
    nextSteps: [
      "Gather all relevant documentation",
      "Consult with a family law lawyer",
      "File application with the court",
      "Attend mandatory information sessions"
    ],
    successIndicators: [
      "Court order granting decision-making responsibility",
      "Children's best interests are protected"
    ],
    commonChallenges: [
      "Navigating complex legal processes",
      "Dealing with opposing party",
      "Addressing children's needs"
    ],
    fr: {
      title: "Responsabilité Décisionnelle",
      description: "Demander la responsabilité décisionnelle pour les enfants",
      requiredDocuments: [
        {
          name: "Actes de naissance des enfants",
          description: "Actes de naissance pour tous les enfants concernés"
        },
        {
          name: "État financier",
          description: "Formulaire 13 : État financier"
        },
        {
          name: "Preuve de revenu",
          description: "Relevés de paie récents, déclarations de revenus ou autres documents relatifs au revenu"
        }
      ],
      eligibilityCriteria: [
        "Vous avez des enfants de moins de 18 ans",
        "Vous êtes un parent ou un tuteur légal",
        "Les enfants résident principalement dans la province"
      ]
    }
  },
  "parenting_order": {
    id: "parenting_order",
    title: "Parenting Order",
    description: "Request a parenting order for custody and access",
    requiresAccount: true,
    estimatedTime: 150,
    category: "Child Matters",
    jurisdiction: "Provincial/Territorial",
    levelOfAssistance: "May require legal assistance",
    suitableFor: "Parents seeking to establish a formal parenting schedule",
    excludedSituations: [
      "Cases involving relocation of children",
      "Allegations of abuse or neglect",
      "Disputes over religious upbringing"
    ],
    requiredDocuments: [
      {
        id: "children_birth_certificates",
        name: "Children's Birth Certificates",
        description: "Birth certificates for all children involved",
        templateLink: "/templates/birth-certificate.pdf",
        sampleLink: "/samples/birth-certificate.pdf"
      },
      {
        id: "parenting_plan",
        name: "Parenting Plan",
        description: "Proposed schedule and arrangements for the children",
        optional: true,
        templateLink: "/templates/parenting-plan.pdf",
        sampleLink: "/samples/parenting-plan.pdf"
      }
    ],
    eligibilityCriteria: [
      "You have children under 18",
      "You are a parent or legal guardian",
      "The children primarily reside in the province/territory",
      "You can demonstrate a commitment to the children's well-being" // Added
    ],
    helpfulResources: [
      {
        name: "Family Court Rules",
        link: "/family-court-rules"
      },
      {
        name: "Parenting Education Programs",
        link: "/parenting-education"
      }
    ],
    estimatedCost: "$500 - $10,000+ (legal fees, assessments, mediation)",
    nextSteps: [
      "Attend a parenting information program",
      "Consider mediation with the other parent",
      "Draft a comprehensive parenting plan",
      "File an application for a parenting order"
    ],
    successIndicators: [
      "A clear and enforceable parenting order is in place",
      "Children have consistent and meaningful relationships with both parents"
    ],
    commonChallenges: [
      "Reaching agreement with the other parent",
      "Addressing conflicting parenting styles",
      "Adjusting to the new parenting arrangement"
    ],
    fr: {
      title: "Ordonnance Parentale",
      description: "Demander une ordonnance parentale pour la garde et l'accès",
      requiredDocuments: [
        {
          name: "Actes de naissance des enfants",
          description: "Actes de naissance pour tous les enfants concernés"
        },
        {
          name: "Plan parental",
          description: "Horaire et arrangements proposés pour les enfants",
          optional: true
        }
      ],
      eligibilityCriteria: [
        "Vous avez des enfants de moins de 18 ans",
        "Vous êtes un parent ou un tuteur légal",
        "Les enfants résident principalement dans la province"
      ]
    }
  },
  "support": {
    id: "support",
    title: "Child or Spousal Support",
    description: "Apply for child support or spousal support",
    requiresAccount: true,
    estimatedTime: 150,
    category: "Financial Support",
    jurisdiction: "Provincial/Territorial",
    levelOfAssistance: "Potentially requires legal or financial advice",
    suitableFor: "Individuals needing or owing financial support",
    excludedSituations: [
      "Cases involving international support orders",
      "Complex business ownership issues",
      "Lack of financial disclosure"
    ],
    requiredDocuments: [
      {
        id: "financial_statement",
        name: "Financial Statement",
        description: "Form 13: Financial Statement",
        templateLink: "/templates/financial-statement.pdf",
        sampleLink: "/samples/financial-statement.pdf"
      },
      {
        id: "income_proof",
        name: "Proof of Income",
        description: "Recent pay stubs, tax returns, or other income documentation",
        templateLink: "/templates/proof-of-income.pdf",
        sampleLink: "/samples/proof-of-income.pdf"
      },
      {
        id: "expenses_proof",
        name: "Proof of Expenses",
        description: "Documentation of relevant expenses (childcare, medical, etc.)",
        optional: true,
        templateLink: "/templates/expenses-proof.pdf",
        sampleLink: "/samples/expenses-proof.pdf"
      }
    ],
    eligibilityCriteria: [
      "You were married or in a common-law relationship",
      "You have financial need or support obligations",
      "You can demonstrate entitlement or obligation to support" // Added
    ],
    helpfulResources: [
      {
        name: "Child Support Guidelines",
        link: "/child-support-guidelines"
      },
      {
        name: "Spousal Support Advisory Guidelines",
        link: "/spousal-support-guidelines"
      }
    ],
    estimatedCost: "$200 - $5,000+ (legal fees, financial assessments)",
    nextSteps: [
      "Gather financial documentation",
      "Calculate potential support amounts",
      "Consider mediation or negotiation",
      "File an application for support"
    ],
    successIndicators: [
      "A fair and reasonable support order is in place",
      "Financial needs are met adequately"
    ],
    commonChallenges: [
      "Determining accurate income",
      "Addressing special expenses",
      "Enforcing support orders"
    ],
    fr: {
      title: "Pension Alimentaire pour Enfants ou Conjoint",
      description: "Demander une pension alimentaire pour enfants ou une pension alimentaire pour conjoint",
      requiredDocuments: [
        {
          name: "État financier",
          description: "Formulaire 13 : État financier"
        },
        {
          name: "Preuve de revenu",
          description: "Relevés de paie récents, déclarations de revenus ou autres documents relatifs au revenu"
        },
        {
          name: "Preuve de dépenses",
          description: "Documentation des dépenses pertinentes (garde d'enfants, médicales, etc.)",
          optional: true
        }
      ],
      eligibilityCriteria: [
        "Vous étiez marié(e) ou dans une relation de droit commun",
        "Vous avez besoin d'une aide financière ou des obligations alimentaires"
      ]
    }
  },
  "property_division": {
    id: "property_division",
    title: "Property Division",
    description: "Request division of family property",
    requiresAccount: true,
    estimatedTime: 180,
    category: "Financial Matters",
    jurisdiction: "Provincial/Territorial",
    levelOfAssistance: "Typically requires legal assistance",
    suitableFor: "Parties who need to divide assets and debts after separation",
    excludedSituations: [
      "Cases involving bankruptcy",
      "Complex business valuations",
      "International property holdings"
    ],
    requiredDocuments: [
      {
        id: "financial_statement",
        name: "Financial Statement",
        description: "Form 13: Financial Statement",
        templateLink: "/templates/financial-statement.pdf",
        sampleLink: "/samples/financial-statement.pdf"
      },
      {
        id: "property_documents",
        name: "Property Documents",
        description: "Deeds, mortgage statements, investment accounts, etc.",
        templateLink: "/templates/property-documents.pdf",
        sampleLink: "/samples/property-documents.pdf"
      },
      {
        id: "marriage_certificate",
        name: "Marriage Certificate",
        description: "If you were married",
        templateLink: "/templates/marriage-certificate.pdf",
        sampleLink: "/samples/marriage-certificate.pdf"
      },
      {
        id: "valuation_reports",
        name: "Valuation Reports",
        description: "Professional valuations of property or businesses",
        optional: true,
        templateLink: "/templates/valuation-report.pdf",
        sampleLink: "/samples/valuation-report.pdf"
      }
    ],
    eligibilityCriteria: [
      "You were married or in a common-law relationship",
      "You have shared property to divide",
      "You are within the applicable time limit to make a claim" // Clarified
    ],
    helpfulResources: [
      {
        name: "Family Law Act",
        link: "/family-law-act"
      },
      {
        name: "Property Division Guides",
        link: "/property-division-guides"
      }
    ],
    estimatedCost: "$1000 - $20,000+ (legal fees, appraisals, expert witnesses)",
    nextSteps: [
      "Obtain legal advice",
      "Gather all property documents",
      "Obtain property valuations",
      "Negotiate a property division agreement"
    ],
    successIndicators: [
      "A fair and equitable property division agreement is reached",
      "All assets and debts are properly accounted for"
    ],
    commonChallenges: [
      "Valuing complex assets",
      "Dealing with hidden assets",
      "Reaching a mutually agreeable settlement"
    ],
    fr: {
      title: "Partage des Biens",
      description: "Demander le partage des biens familiaux",
      requiredDocuments: [
        {
          name: "État financier",
          description: "Formulaire 13 : État financier"
        },
        {
          name: "Documents relatifs aux biens",
          description: "Actes, relevés hypothécaires, comptes de placement, etc."
        },
        {
          name: "Acte de mariage",
          description: "Si vous étiez marié(e)"
        },
        {
          name: "Rapports d'évaluation",
          description: "Évaluations professionnelles de biens ou d'entreprises",
          optional: true
        }
      ],
      eligibilityCriteria: [
        "Vous étiez marié(e) ou dans une relation de droit commun",
        "Vous avez des biens communs à partager",
        "Vous êtes dans le délai applicable pour faire une réclamation"
      ]
    }
  },
  "enforcement": {
    id: "enforcement",
    title: "Enforce Domestic Contract",
    description: "Enforce a separation agreement or marriage contract",
    requiresAccount: true,
    estimatedTime: 120,
    category: "Contract Enforcement",
    jurisdiction: "Provincial/Territorial",
    levelOfAssistance: "Legal assistance often required",
    suitableFor: "Individuals needing to enforce a valid domestic contract",
    excludedSituations: [
      "The contract is invalid or unconscionable",
      "The contract has been set aside by the court",
      "Lack of clear evidence of non-compliance"
    ],
    requiredDocuments: [
      {
        id: "domestic_contract",
        name: "Domestic Contract",
        description: "Original signed agreement you want to enforce",
        templateLink: "/templates/domestic-contract.pdf",
        sampleLink: "/samples/domestic-contract.pdf"
      },
      {
        id: "financial_records",
        name: "Financial Records",
        description: "Evidence of non-compliance (missed payments, etc.)",
        templateLink: "/templates/financial-records.pdf",
        sampleLink: "/samples/financial-records.pdf"
      }
    ],
    eligibilityCriteria: [
      "You have a valid domestic contract",
      "The other party is not following the agreement",
      "The agreement has not been previously set aside by the court",
      "You have clear evidence of non-compliance" // Added
    ],
    helpfulResources: [
      {
        name: "Enforcement Guides",
        link: "/enforcement-guides"
      },
      {
        name: "Family Responsibility Office",
        link: "/family-responsibility-office"
      }
    ],
    estimatedCost: "$500 - $10,000+ (legal fees, enforcement costs)",
    nextSteps: [
      "Review the contract terms",
      "Gather evidence of non-compliance",
      "Send a demand letter to the other party",
      "File an application for enforcement"
    ],
    successIndicators: [
      "The domestic contract is enforced",
      "Compliance with the contract is achieved"
    ],
    commonChallenges: [
      "Proving non-compliance",
      "Dealing with a reluctant party",
      "Navigating the enforcement process"
    ],
    fr: {
      title: "Exécution du Contrat National",
      description: "Exécuter un accord de séparation ou un contrat de mariage",
      requiredDocuments: [
        {
          name: "Contrat National",
          description: "Accord original signé que vous souhaitez exécuter"
        },
        {
          name: "Dossiers financiers",
          description: "Preuve de non-conformité (paiements manqués, etc.)"
        }
      ],
      eligibilityCriteria: [
        "Vous avez un contrat national valide",
        "L'autre partie ne respecte pas l'accord",
        "L'accord n'a pas été annulé précédemment par le tribunal"
      ]
    }
  }
};
