// src/services/i18n/LanguageService.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import moment from 'moment';
import 'moment/locale/fr';

/**
 * Enhanced language service with improved localization capabilities
 */
class LanguageService {
  constructor() {
    this.supportedLanguages = {
      en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
      fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' }
    };

    // Initial translations for fast loading
    this.initialResources = {
      en: {
        translation: {
          common: {
            next: 'Next',
            previous: 'Previous',
            save: 'Save',
            cancel: 'Cancel',
            submit: 'Submit',
            loading: 'Loading...',
            required: 'Required',
            optional: 'Optional',
            error: 'Error',
            success: 'Success',
            warning: 'Warning',
            info: 'Information',
            search: 'Search',
            noResults: 'No results found',
            select: 'Select',
            close: 'Close',
            back: 'Back',
            edit: 'Edit',
            delete: 'Delete',
            view: 'View',
            save: 'Save',
            continue: 'Continue',
            complete: 'Complete',
            help: 'Help'
          },
          validation: {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            minLength: 'Must be at least {{min}} characters',
            maxLength: 'Must be no more than {{max}} characters',
            minValue: 'Must be at least {{min}}',
            maxValue: 'Must be no more than {{max}}',
            pattern: 'Invalid format',
            dateMin: 'Date must be after {{min}}',
            dateMax: 'Date must be before {{max}}',
            fileSize: 'File size must be less than {{max}}MB',
            fileType: 'File must be one of these types: {{types}}',
            passwordMatch: 'Passwords must match',
            postalCode: 'Please enter a valid postal code',
            age: 'You must be at least {{age}} years old'
          },
          wizard: {
            step: 'Step {{current}} of {{total}}',
            progress: '{{percent}}% complete',
            timeRemaining: 'Estimated time remaining: {{time}}',
            saveProgress: 'Save progress',
            continueProgress: 'Continue where you left off',
            startOver: 'Start over',
            reviewAnswers: 'Review your answers',
            formSubmitted: 'Form submitted successfully',
            processing: 'Processing...',
            pleaseReview: 'Please review your information before submitting',
            modifyAnswers: 'You can modify your answers by clicking "Edit" next to each section'
          },
          legal: {
            disclaimer: 'This information does not constitute legal advice. For legal advice specific to your situation, please consult a qualified lawyer.',
            privacyPolicy: 'Privacy Policy',
            termsOfService: 'Terms of Service',
            consentToTerms: 'I have read and agree to the Terms of Service and Privacy Policy',
            dataProcessingConsent: 'I consent to the processing of my personal information as described in the Privacy Policy',
            legalAid: 'You may be eligible for legal aid. Please contact your local legal aid office for more information.'
          },
          courts: {
            findNearest: 'Find nearest court',
            nearestCourt: 'Nearest Court',
            away: 'away',
            directions: 'Directions',
            call: 'Call',
            website: 'Website',
            hours: 'Hours',
            services: 'Services',
            accessibilityInfo: 'Accessibility',
            wheelchairAccessible: 'Wheelchair accessible',
            hearingAssistance: 'Hearing assistance available',
            visualAssistance: 'Visual assistance available'
          },
          documents: {
            upload: 'Upload',
            uploadDocument: 'Upload Document',
            dragAndDrop: 'Drag and drop file here, or click to select',
            fileSelected: 'File selected',
            removeFile: 'Remove file',
            fileSize: 'File size',
            fileType: 'File type',
            analyzing: 'Analyzing document...',
            extractedInfo: 'Extracted Information',
            confirmExtracted: 'Confirm extracted information',
            requiredDocuments: 'Required Documents',
            optionalDocuments: 'Optional Documents',
            documentGuidelines: 'Document Guidelines',
            uploadSuccess: 'Document uploaded successfully',
            uploadError: 'Failed to upload document'
          },
          forms: {
            personalInfo: 'Personal Information',
            contactInfo: 'Contact Information',
            familyInfo: 'Family Information',
            financialInfo: 'Financial Information',
            employmentInfo: 'Employment Information',
            caseInfo: 'Case Information',
            reviewInfo: 'Review Information',
            submitForms: 'Submit Forms'
          }
        }
      },
      fr: {
        translation: {
          common: {
            next: 'Suivant',
            previous: 'Précédent',
            save: 'Enregistrer',
            cancel: 'Annuler',
            submit: 'Soumettre',
            loading: 'Chargement...',
            required: 'Obligatoire',
            optional: 'Facultatif',
            error: 'Erreur',
            success: 'Succès',
            warning: 'Avertissement',
            info: 'Information',
            search: 'Rechercher',
            noResults: 'Aucun résultat trouvé',
            select: 'Sélectionner',
            close: 'Fermer',
            back: 'Retour',
            edit: 'Modifier',
            delete: 'Supprimer',
            view: 'Voir',
            save: 'Enregistrer',
            continue: 'Continuer',
            complete: 'Terminer',
            help: 'Aide'
          },
          validation: {
            required: 'Ce champ est obligatoire',
            email: 'Veuillez saisir une adresse e-mail valide',
            phone: 'Veuillez saisir un numéro de téléphone valide',
            minLength: 'Doit contenir au moins {{min}} caractères',
            maxLength: 'Ne doit pas dépasser {{max}} caractères',
            minValue: 'Doit être au moins {{min}}',
            maxValue: 'Ne doit pas dépasser {{max}}',
            pattern: 'Format invalide',
            dateMin: 'La date doit être après {{min}}',
            dateMax: 'La date doit être avant {{max}}',
            fileSize: 'La taille du fichier doit être inférieure à {{max}}MB',
            fileType: 'Le fichier doit être d\'un de ces types: {{types}}',
            passwordMatch: 'Les mots de passe doivent correspondre',
            postalCode: 'Veuillez saisir un code postal valide',
            age: 'Vous devez avoir au moins {{age}} ans'
          },
          wizard: {
            step: 'Étape {{current}} sur {{total}}',
            progress: '{{percent}}% complété',
            timeRemaining: 'Temps restant estimé: {{time}}',
            saveProgress: 'Enregistrer la progression',
            continueProgress: 'Continuer où vous vous êtes arrêté',
            startOver: 'Recommencer',
            reviewAnswers: 'Réviser vos réponses',
            formSubmitted: 'Formulaire soumis avec succès',
            processing: 'Traitement en cours...',
            pleaseReview: 'Veuillez vérifier vos informations avant de soumettre',
            modifyAnswers: 'Vous pouvez modifier vos réponses en cliquant sur "Modifier" à côté de chaque section'
          },
          legal: {
            disclaimer: 'Ces informations ne constituent pas un avis juridique. Pour des conseils juridiques spécifiques à votre situation, veuillez consulter un avocat qualifié.',
            privacyPolicy: 'Politique de confidentialité',
            termsOfService: 'Conditions d\'utilisation',
            consentToTerms: 'J\'ai lu et j\'accepte les Conditions d\'utilisation et la Politique de confidentialité',
            dataProcessingConsent: 'Je consens au traitement de mes informations personnelles tel que décrit dans la Politique de confidentialité',
            legalAid: 'Vous pourriez être admissible à l\'aide juridique. Veuillez contacter votre bureau d\'aide juridique local pour plus d\'informations.'
          },
          courts: {
            findNearest: 'Trouver le tribunal le plus proche',
            nearestCourt: 'Tribunal le plus proche',
            away: 'de distance',
            directions: 'Itinéraire',
            call: 'Appeler',
            website: 'Site web',
            hours: 'Heures d\'ouverture',
            services: 'Services',
            accessibilityInfo: 'Accessibilité',
            wheelchairAccessible: 'Accessible en fauteuil roulant',
            hearingAssistance: 'Assistance auditive disponible',
            visualAssistance: 'Assistance visuelle disponible'
          },
          documents: {
            upload: 'Téléverser',
            uploadDocument: 'Téléverser un document',
            dragAndDrop: 'Glissez-déposez le fichier ici, ou cliquez pour sélectionner',
            fileSelected: 'Fichier sélectionné',
            removeFile: 'Supprimer le fichier',
            fileSize: 'Taille du fichier',
            fileType: 'Type de fichier',
            analyzing: 'Analyse du document...',
            extractedInfo: 'Informations extraites',
            confirmExtracted: 'Confirmer les informations extraites',
            requiredDocuments: 'Documents requis',
            optionalDocuments: 'Documents facultatifs',
            documentGuidelines: 'Directives pour les documents',
            uploadSuccess: 'Document téléversé avec succès',
            uploadError: 'Échec du téléversement du document'
          },
          forms: {
            personalInfo: 'Informations personnelles',
            contactInfo: 'Coordonnées',
            familyInfo: 'Informations familiales',
            financialInfo: 'Informations financières',
            employmentInfo: 'Informations sur l\'emploi',
            caseInfo: 'Informations sur le dossier',
            reviewInfo: 'Vérifier les informations',
            submitForms: 'Soumettre les formulaires'
          }
        }
      }
    };
  }

  /**
   * Initialize the i18n library
   * @param {Object} options - Initialization options
   * @returns {Promise<void>}
   */
  async initialize(options = {}) {
    try {
      const defaultOptions = {
        resources: this.initialResources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        },
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage']
        },
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
          addPath: '/locales/add/{{lng}}/{{ns}}'
        },
        react: {
          useSuspense: false
        }
      };

      const mergedOptions = { ...defaultOptions, ...options };

      await i18n
        .use(initReactI18next)
        .use(LanguageDetector)
        .use(HttpApi)
        .init(mergedOptions);

      moment.locale(i18n.language);

      i18n.on('languageChanged', (lng) => {
        moment.locale(lng);
        document.documentElement.lang = lng;
        document.documentElement.dir = this.getLanguageDirection(lng);
        const event = new CustomEvent('languageChanged', { detail: { language: lng } });
        document.dispatchEvent(event);
      });

      return i18n;
    } catch (error) {
      console.error('Error initializing language service:', error);
      throw error;
    }
  }

  /**
   * Change the current language
   * @param {string} language - Language code
   * @returns {Promise<void>}
   */
  async changeLanguage(language) {
    if (!this.supportedLanguages[language]) {
      console.warn(`Language ${language} is not supported`);
      return;
    }

    try {
      await i18n.changeLanguage(language);
    } catch (error) {
      console.error(`Error changing language to ${language}:`, error);
      throw error;
    }
  }

  /**
   * Get the current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return i18n.language;
  }

  /**
   * Get a list of supported languages
   * @returns {Object} Supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Get the text direction for a language
   * @param {string} language - Language code
   * @returns {string} Text direction ('ltr' or 'rtl')
   */
  getLanguageDirection(language) {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }

  /**
   * Format a date according to the current language
   * @param {Date|string|number} date - Date to format
   * @param {string} format - Format string
   * @returns {string} Formatted date
   */
  formatDate(date, format = 'LL') {
    return moment(date).format(format);
  }

  /**
   * Format a number according to the current language
   * @param {number} number - Number to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted number
   */
  formatNumber(number, options = {}) {
    const locale = i18n.language;
    return new Intl.NumberFormat(locale, options).format(number);
  }

  /**
   * Format currency according to the current language
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} Formatted currency
   */
  formatCurrency(amount, currency = 'CAD') {
    const locale = i18n.language;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Translate a key with formatting
   * @param {string} key - Translation key
   * @param {Object} options - Translation options
   * @returns {string} Translated text
   */
  translate(key, options = {}) {
    return i18n.t(key, options);
  }

  /**
   * Get translations for a specific namespace
   * @param {string} namespace - Translation namespace
   * @returns {Object} Namespace translations
   */
  getNamespace(namespace) {
    return i18n.getResourceBundle(i18n.language, namespace);
  }

  /**
   * Add or update translations
   * @param {string} language - Language code
   * @param {string} namespace - Translation namespace
   * @param {Object} translations - Translations to add
   * @returns {void}
   */
  addTranslations(language, namespace, translations) {
    i18n.addResourceBundle(language, namespace, translations, true, true);
  }
}

// Create and export a singleton instance
const languageService = new LanguageService();
export default languageService;

// Export the i18n instance for React components
export { i18n };

// Export a useTranslation hook wrapper
export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  
  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
    supportedLanguages: languageService.getSupportedLanguages(),
    formatDate: languageService.formatDate,
    formatNumber: languageService.formatNumber,
    formatCurrency: languageService.formatCurrency,
    translate: languageService.translate,
    direction: languageService.getLanguageDirection(i18n.language)
  };
};