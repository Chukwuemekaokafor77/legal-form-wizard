// src/components/wizard/Step2.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ErrorMessage } from '../ui';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {
  User, Mail, Phone, MapPin, Briefcase,
  AlertCircle, Check, Calendar, Home
} from 'lucide-react';
import { VALIDATION_RULES } from '../../data/questionSchema';

const FormSection = ({ title, icon: Icon, children, className = '' }) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className="text-lg font-medium flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-blue-500" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

const FormInput = ({
  label,
  error,
  icon: Icon,
  required,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        {...props}
        className={`
          w-full rounded-lg border border-gray-300 bg-white
          ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500 ring-red-500' : ''}
          ${props.disabled ? 'bg-gray-50' : ''}
        `}
      />
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

const FormSelect = ({
  label,
  options,
  icon: Icon,
  required,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <select
        {...props}
        className={`
          w-full rounded-lg border border-gray-300 bg-white
          ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        `}
      >
        <option value="">{`Select ${label}`}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const Step2 = ({ onChange, answers }) => {
  // Keep your existing state initialization
  const [personalInfo, setPersonalInfo] = useState(answers.personalInfo || {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    contact: {
      email: "",
      phone: "",
      alternatePhone: "",
    },
    employment: {
      status: "",
      occupation: "",
      employer: "",
    }
  });
  const [errors, setErrors] = useState({});

  // Keep your existing validation logic
  const validate = () => {
    const newErrors = {};
    if (!personalInfo.fullName) newErrors.fullName = "Full name is required";
    if (!personalInfo.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else if (validateAge(personalInfo.dateOfBirth)) {
      newErrors.dateOfBirth = "You must be at least 18 years old";
    }
    if (!personalInfo.contact?.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(personalInfo.contact.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!personalInfo.contact?.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(personalInfo.contact.phone)) {
      newErrors.phone = "Invalid phone format";
    }
    if (personalInfo.address?.zipCode && !validatePostalCode(personalInfo.address.zipCode)) {
      newErrors.zipCode = "Invalid postal code format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Keep your existing change handler
  const handleChange = (e, section) => {
    const { name, value } = e.target;
    const newInfo = { ...personalInfo };
    if (section) {
      newInfo[section] = { ...newInfo[section], [name]: value };
    } else {
      newInfo[name] = value;
    }
    setPersonalInfo(newInfo);
    const isValid = validate(); // Validate before calling onChange
    onChange({ personalInfo: newInfo, isValid: isValid }); // Send updated data and validity
  };

  useEffect(() => {
    const isValid = validate(); // Validate on mount
    onChange({ personalInfo: personalInfo, isValid: isValid }); // Inform parent
  }, []);

  // Form option configurations
  const formOptions = useMemo(() => ({
    gender: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ],
    maritalStatus: [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married' },
      { value: 'divorced', label: 'Divorced' },
      { value: 'widowed', label: 'Widowed' },
      { value: 'separated', label: 'Separated' }
    ],
    employmentStatus: [
      { value: 'employed', label: 'Employed' },
      { value: 'unemployed', label: 'Unemployed' },
      { value: 'self-employed', label: 'Self-Employed' },
      { value: 'retired', label: 'Retired' }
    ]
  }), []);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <FormSection title="Basic Information" icon={User}>
        <FormInput
          label="Full Name"
          name="fullName"
          value={personalInfo.fullName}
          onChange={(e) => handleChange(e)}
          placeholder="Enter your full name"
          error={errors.fullName}
          icon={User}
          required
        />
        <FormInput
          type="date"
          label="Date of Birth"
          name="dateOfBirth"
          value={personalInfo.dateOfBirth}
          onChange={(e) => handleChange(e)}
          error={errors.dateOfBirth}
          icon={Calendar}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Gender"
            name="gender"
            value={personalInfo.gender}
            onChange={(e) => handleChange(e)}
            options={formOptions.gender}
            icon={User}
          />
          <FormSelect
            label="Marital Status"
            name="maritalStatus"
            value={personalInfo.maritalStatus}
            onChange={(e) => handleChange(e)}
            options={formOptions.maritalStatus}
            icon={User}
          />
        </div>
      </FormSection>

      {/* Contact Information */}
      <FormSection title="Contact Information" icon={Phone}>
        <FormInput
          type="email"
          label="Email"
          name="email"
          value={personalInfo.contact.email}
          onChange={(e) => handleChange(e, 'contact')}
          placeholder="Enter your email"
          error={errors.email}
          icon={Mail}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            type="tel"
            label="Phone Number"
            name="phone"
            value={personalInfo.contact.phone}
            onChange={(e) => handleChange(e, 'contact')}
            placeholder="Enter your phone number"
            error={errors.phone}
            icon={Phone}
            required
          />
          <FormInput
            type="tel"
            label="Alternate Phone"
            name="alternatePhone"
            value={personalInfo.contact.alternatePhone}
            onChange={(e) => handleChange(e, 'contact')}
            placeholder="Enter alternate phone number"
            icon={Phone}
          />
        </div>
      </FormSection>

      {/* Address */}
      <FormSection title="Address" icon={Home}>
        <FormInput
          label="Street Address"
          name="street"
          value={personalInfo.address.street}
          onChange={(e) => handleChange(e, 'address')}
          placeholder="Enter your street address"
          icon={MapPin}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="City"
            name="city"
            value={personalInfo.address.city}
            onChange={(e) => handleChange(e, 'address')}
            placeholder="Enter your city"
          />
          <FormInput
            label="State/Province"
            name="state"
            value={personalInfo.address.state}
            onChange={(e) => handleChange(e, 'address')}
            placeholder="Enter your state/province"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Postal Code"
            name="zipCode"
            value={personalInfo.address.zipCode}
            onChange={(e) => handleChange(e, 'address')}
            placeholder="Enter your postal code"
            error={errors.zipCode}
          />
          <FormInput
            label="Country"
            name="country"
            value={personalInfo.address.country}
            onChange={(e) => handleChange(e, 'address')}
            placeholder="Enter your country"
          />
        </div>
      </FormSection>

      {/* Employment */}
      <FormSection title="Employment Information" icon={Briefcase}>
        <FormSelect
          label="Employment Status"
          name="status"
          value={personalInfo.employment.status}
          onChange={(e) => handleChange(e, 'employment')}
          options={formOptions.employmentStatus}
          icon={Briefcase}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Occupation"
            name="occupation"
            value={personalInfo.employment.occupation}
            onChange={(e) => handleChange(e, 'employment')}
            placeholder="Enter your occupation"
            disabled={personalInfo.employment.status === 'unemployed' ||
              personalInfo.employment.status === 'retired'}
          />
          <FormInput
            label="Employer"
            name="employer"
            value={personalInfo.employment.employer}
            onChange={(e) => handleChange(e, 'employment')}
            placeholder="Enter your employer"
            disabled={personalInfo.employment.status === 'unemployed' ||
              personalInfo.employment.status === 'retired'}
          />
        </div>
      </FormSection>
    </div>
  );
};

export default Step2;
