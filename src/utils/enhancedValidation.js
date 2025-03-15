// src/utils/enhancedValidation.js
/**
 * Enhanced validation utilities with user-friendly feedback
 */

// Common validation patterns
const patterns = {
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: {
        en: 'Please enter a valid email address',
        fr: 'Veuillez saisir une adresse e-mail valide'
      }
    },
    phone: {
      regex: /^\+?[\d\s-]{10,}$/,
      message: {
        en: 'Please enter a valid phone number',
        fr: 'Veuillez saisir un numéro de téléphone valide'
      }
    },
    postalCodeCA: {
      regex: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      message: {
        en: 'Please enter a valid Canadian postal code (e.g., A1A 1A1)',
        fr: 'Veuillez saisir un code postal canadien valide (ex: A1A 1A1)'
      }
    },
    zipCodeUS: {
      regex: /^\d{5}(-\d{4})?$/,
      message: {
        en: 'Please enter a valid US zip code (e.g., 12345 or 12345-6789)',
        fr: 'Veuillez saisir un code postal américain valide (ex: 12345 ou 12345-6789)'
      }
    },
    date: {
      regex: /^\d{4}-\d{2}-\d{2}$/,
      message: {
        en: 'Please enter a valid date in the format YYYY-MM-DD',
        fr: 'Veuillez saisir une date valide au format AAAA-MM-JJ'
      }
    },
    alphanumeric: {
      regex: /^[a-zA-Z0-9]+$/,
      message: {
        en: 'Please use only letters and numbers',
        fr: 'Veuillez utiliser uniquement des lettres et des chiffres'
      }
    },
    numeric: {
      regex: /^\d+$/,
      message: {
        en: 'Please enter numbers only',
        fr: 'Veuillez saisir uniquement des chiffres'
      }
    },
    currency: {
      regex: /^\$?\d+(,\d{3})*(\.\d{2})?$/,
      message: {
        en: 'Please enter a valid currency amount (e.g., 1000.00)',
        fr: 'Veuillez saisir un montant valide (ex: 1000,00)'
      }
    }
  };
  
  // Standard error messages
  const errorMessages = {
    required: {
      en: 'This field is required',
      fr: 'Ce champ est obligatoire'
    },
    minLength: {
      en: 'Must be at least {min} characters',
      fr: 'Doit comporter au moins {min} caractères'
    },
    maxLength: {
      en: 'Must be no more than {max} characters',
      fr: 'Ne doit pas dépasser {max} caractères'
    },
    minValue: {
      en: 'Must be at least {min}',
      fr: 'Doit être au moins {min}'
    },
    maxValue: {
      en: 'Must be no more than {max}',
      fr: 'Ne doit pas dépasser {max}'
    },
    pattern: {
      en: 'Invalid format',
      fr: 'Format invalide'
    },
    date: {
      min: {
        en: 'Date must be after {min}',
        fr: 'La date doit être après {min}'
      },
      max: {
        en: 'Date must be before {max}',
        fr: 'La date doit être avant {max}'
      },
      invalid: {
        en: 'Please enter a valid date',
        fr: 'Veuillez saisir une date valide'
      }
    },
    file: {
      size: {
        en: 'File size must be less than {max}MB',
        fr: 'La taille du fichier doit être inférieure à {max}Mo'
      },
      type: {
        en: 'File must be one of these types: {types}',
        fr: 'Le fichier doit être de l\'un des types suivants: {types}'
      }
    },
    passwordMatch: {
      en: 'Passwords must match',
      fr: 'Les mots de passe doivent correspondre'
    },
    age: {
      min: {
        en: 'You must be at least {min} years old',
        fr: 'Vous devez avoir au moins {min} ans'
      }
    }
  };
  
  /**
   * Format error message with provided values
   * @param {string|Object} message - Error message or localized message object
   * @param {Object} values - Values to replace placeholders in message
   * @param {string} locale - Locale code
   * @returns {string} Formatted message
   */
  const formatMessage = (message, values = {}, locale = 'en') => {
    if (!message) return '';
    
    // Get the appropriate localized message
    let localizedMessage;
    if (typeof message === 'object') {
      localizedMessage = message[locale] || message.en || '';
    } else {
      localizedMessage = message;
    }
    
    // Replace placeholders with values
    return Object.entries(values).reduce(
      (msg, [key, value]) => msg.replace(`{${key}}`, value),
      localizedMessage
    );
  };
  
  /**
   * Validate a field against validation rules
   * @param {string} fieldId - Field identifier
   * @param {*} value - Field value
   * @param {Object} rules - Validation rules
   * @param {Object} formData - Complete form data (for cross-field validation)
   * @param {string} locale - Locale code
   * @returns {Object} Validation result with isValid flag and error message
   */
  export const validateField = (
    fieldId,
    value,
    rules = {},
    formData = {},
    locale = 'en'
  ) => {
    // Early return for non-required empty fields
    if (
      (!rules.required || rules.required === false) && 
      (value === undefined || value === null || value === '')
    ) {
      return { isValid: true };
    }
    
    // Required validation
    if (rules.required && (value === undefined || value === null || value === '')) {
      return {
        isValid: false,
        error: formatMessage(errorMessages.required, {}, locale)
      };
    }
    
    // Specific validation for different types of fields
    switch (rules.type) {
      case 'email':
        if (value && !patterns.email.regex.test(value)) {
          return {
            isValid: false,
            error: formatMessage(patterns.email.message, {}, locale)
          };
        }
        break;
        
      case 'phone':
        if (value && !patterns.phone.regex.test(value)) {
          return {
            isValid: false,
            error: formatMessage(patterns.phone.message, {}, locale)
          };
        }
        break;
        
      case 'postalCode':
        if (value) {
          const country = rules.country || formData.country || 'CA';
          const pattern = country === 'US' ? patterns.zipCodeUS : patterns.postalCodeCA;
          
          if (!pattern.regex.test(value)) {
            return {
              isValid: false,
              error: formatMessage(pattern.message, {}, locale)
            };
          }
        }
        break;
        
      case 'date':
        if (value) {
          // Check date format
          if (!patterns.date.regex.test(value)) {
            return {
              isValid: false,
              error: formatMessage(errorMessages.date.invalid, {}, locale)
            };
          }
          
          // Min date validation
          if (rules.minDate) {
            let minDate;
            if (typeof rules.minDate === 'function') {
              minDate = rules.minDate(formData);
            } else {
              minDate = rules.minDate;
            }
            
            if (new Date(value) < new Date(minDate)) {
              return {
                isValid: false,
                error: formatMessage(errorMessages.date.min, { min: minDate }, locale)
              };
            }
          }
          
          // Max date validation
          if (rules.maxDate) {
            let maxDate;
            if (typeof rules.maxDate === 'function') {
              maxDate = rules.maxDate(formData);
            } else {
              maxDate = rules.maxDate;
            }
            
            if (new Date(value) > new Date(maxDate)) {
              return {
                isValid: false,
                error: formatMessage(errorMessages.date.max, { max: maxDate }, locale)
              };
            }
          }
          
          // Age validation
          if (rules.minAge) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            // Adjust age if birthday hasn't occurred yet this year
            const adjustedAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
              ? age - 1 
              : age;
            
            if (adjustedAge < rules.minAge) {
              return {
                isValid: false,
                error: formatMessage(errorMessages.age.min, { min: rules.minAge }, locale)
              };
            }
          }
        }
        break;
        
      case 'number':
        if (value !== undefined && value !== null) {
          // Min value validation
          if (rules.min !== undefined && value < rules.min) {
            return {
              isValid: false,
              error: formatMessage(errorMessages.minValue, { min: rules.min }, locale)
            };
          }
          
          // Max value validation
          if (rules.max !== undefined && value > rules.max) {
            return {
              isValid: false,
              error: formatMessage(errorMessages.maxValue, { max: rules.max }, locale)
            };
          }
        }
        break;
        
      case 'file':
        if (value) {
          // File size validation (in MB)
          if (rules.maxSize && value.size > rules.maxSize * 1024 * 1024) {
            return {
              isValid: false,
              error: formatMessage(errorMessages.file.size, { max: rules.maxSize }, locale)
            };
          }
          
          // File type validation
          if (rules.accept && rules.accept.length > 0) {
            const fileType = value.type;
            const extension = value.name.split('.').pop().toLowerCase();
            
            // Check if file type is in accepted list
            const isAccepted = rules.accept.some(type => {
              // Handle mime types like "image/*"
              if (type.endsWith('/*')) {
                const mainType = type.split('/')[0];
                return fileType.startsWith(`${mainType}/`);
              }
              
              // Check exact mime types or extensions
              return type === fileType || type === `.${extension}`;
            });
            
            if (!isAccepted) {
              return {
                isValid: false,
                error: formatMessage(
                  errorMessages.file.type, 
                  { types: rules.accept.join(', ') },
                  locale
                )
              };
            }
          }
        }
        break;
    }
    
    // String length validation
    if (typeof value === 'string') {
      // Min length validation
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        return {
          isValid: false,
          error: formatMessage(
            errorMessages.minLength, 
            { min: rules.minLength },
            locale
          )
        };
      }
      
      // Max length validation
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        return {
          isValid: false,
          error: formatMessage(
            errorMessages.maxLength,
            { max: rules.maxLength },
            locale
          )
        };
      }
      
      // Pattern validation
      if (rules.pattern) {
        let regex;
        if (typeof rules.pattern === 'string') {
          // Use a predefined pattern
          regex = patterns[rules.pattern]?.regex;
        } else {
          // Use a custom regex pattern
          regex = rules.pattern;
        }
        
        if (regex && !regex.test(value)) {
          let errorMessage;
          if (typeof rules.pattern === 'string') {
            errorMessage = patterns[rules.pattern]?.message;
          } else {
            errorMessage = rules.patternMessage || errorMessages.pattern;
          }
          
          return {
            isValid: false,
            error: formatMessage(errorMessage, {}, locale)
          };
        }
      }
    }
    
    // Cross-field validations
    if (rules.match) {
      const matchValue = formData[rules.match];
      if (value !== matchValue) {
        return {
          isValid: false,
          error: formatMessage(
            rules.matchMessage || errorMessages.passwordMatch,
            {},
            locale
          )
        };
      }
    }
    
    // Custom validator function
    if (rules.validator && typeof rules.validator === 'function') {
      const customResult = rules.validator(value, formData);
      if (customResult !== true) {
        return {
          isValid: false,
          error: typeof customResult === 'string' 
            ? customResult 
            : formatMessage(rules.validatorMessage || customResult, {}, locale)
        };
      }
    }
    
    // All validations passed
    return { isValid: true };
  };
  
  /**
   * Validate an entire form against a validation schema
   * @param {Object} formData - Complete form data
   * @param {Object} validationSchema - Schema defining validation rules for each field
   * @param {string} locale - Locale code
   * @returns {Object} Validation result with isValid flag and errors object
   */
  export const validateForm = (formData, validationSchema, locale = 'en') => {
    const errors = {};
    let isValid = true;
    
    Object.entries(validationSchema).forEach(([fieldId, rules]) => {
      // Get nested values if field path contains dots
      const value = fieldId.split('.').reduce(
        (obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined,
        formData
      );
      
      const result = validateField(fieldId, value, rules, formData, locale);
      
      if (!result.isValid) {
        errors[fieldId] = result.error;
        isValid = false;
      }
    });
    
    return { isValid, errors };
  };
  
  /**
   * Create dynamic validation schema based on form configuration
   * @param {Array} formConfig - Array of form field configurations
   * @returns {Object} Validation schema for validateForm
   */
  export const createValidationSchema = (formConfig) => {
    const schema = {};
    
    const processFields = (fields, prefix = '') => {
      fields.forEach(field => {
        const fieldPath = prefix ? `${prefix}.${field.id}` : field.id;
        
        // Skip fields without validation
        if (!field.validation) return;
        
        schema[fieldPath] = field.validation;
        
        // Handle nested fields in repeaters
        if (field.type === 'repeater' && field.fields) {
          // For repeater fields, we'd typically validate each item separately
          // This is handled by the GuidedInterviewEngine component
        }
      });
    };
    
    // Process all fields
    processFields(formConfig);
    
    return schema;
  };
  
  export default {
    validateField,
    validateForm,
    createValidationSchema,
    patterns,
    errorMessages
  };