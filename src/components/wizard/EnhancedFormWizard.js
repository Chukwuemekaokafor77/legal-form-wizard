import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  Clock, 
  Save, 
  FileText, 
  User, 
  Home, 
  Calendar, 
  Briefcase, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const EnhancedFormWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTips, setShowTips] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [completedSteps, setCompletedSteps] = useState([1]);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      email: '',
      phone: ''
    },
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: ''
    }
  });
  
  const totalSteps = 9;
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  // Simulate save action
  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1500);
  };

  // Navigation
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setCompletedSteps(prev => [...prev, currentStep]);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested objects with dot notation (e.g. "personalInfo.fullName")
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  name="personalInfo.fullName"
                  value={formData.personalInfo.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full legal name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="personalInfo.dateOfBirth"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="personalInfo.gender"
                    value={formData.personalInfo.gender || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="email" 
                  name="personalInfo.email"
                  value={formData.personalInfo.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="tel" 
                  name="personalInfo.phone"
                  value={formData.personalInfo.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-500" />
              Address Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main St"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province/State
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="address.province"
                    value={formData.address.province}
                    onChange={handleChange}
                  >
                    <option value="">Select province</option>
                    <option value="nb">New Brunswick</option>
                    <option value="on">Ontario</option>
                    <option value="qc">Quebec</option>
                    <option value="bc">British Columbia</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="A1A 1A1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="address.country"
                    value={formData.address.country || 'ca'}
                    onChange={handleChange}
                  >
                    <option value="ca">Canada</option>
                    <option value="us">United States</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      // Add more cases for other steps
      default:
        return (
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Step {currentStep}
            </h2>
            <p className="text-gray-600">Content for Step {currentStep} will be displayed here.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Legal Form Wizard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-blue-100 flex items-center">
              <Clock className="mr-1 w-4 h-4" />
              <span>Last saved: 2 minutes ago</span>
            </div>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Progress
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Progress</span>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between px-6 pt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm
              ${i + 1 === currentStep 
                ? 'bg-blue-500 text-white' 
                : i + 1 < currentStep 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-gray-100 text-gray-400'}
            `}
          >
            {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Form Area */}
        <div className="md:col-span-2 space-y-6">
          {renderStepContent()}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips & Guidance */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowTips(!showTips)}>
              <h3 className="font-medium text-blue-700 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Tips & Guidance
              </h3>
              {showTips ? (
                <ChevronUp className="w-5 h-5 text-blue-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-500" />
              )}
            </div>
            
            {showTips && (
              <div className="mt-3 text-sm text-blue-700 space-y-2">
                {currentStep === 1 && (
                  <>
                    <p>• Enter your legal name as it appears on official documents</p>
                    <p>• Your email will be used for notifications about your case</p>
                    <p>• Make sure your phone number is current and one you check regularly</p>
                    <p>• Date of birth must be in YYYY-MM-DD format</p>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <p>• Use your current permanent address</p>
                    <p>• Include your apartment/unit number in the street address field</p>
                    <p>• Postal code format: A1A 1A1 (letters and numbers)</p>
                    <p>• If you've recently moved, make sure to update all your government ID</p>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Document Requirements */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Required Documents
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="mt-0.5 mr-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">Government-issued ID</p>
                  <p className="text-xs text-gray-500">Driver's license, passport, provincial ID</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-0.5 mr-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">Marriage Certificate</p>
                  <p className="text-xs text-gray-500">Original or certified copy required</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-0.5 mr-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">Financial Statement</p>
                  <p className="text-xs text-gray-500">Income and expense documentation</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Process Timeline
            </h3>
            
            <div className="relative">
              <div className="absolute left-[9px] top-0 bottom-0 w-[2px] bg-gray-200"></div>
              
              <div className="space-y-4">
                <div className="flex items-start relative z-10">
                  <div className="w-5 h-5 rounded-full bg-green-500 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Complete Application</p>
                    <p className="text-xs text-gray-500">In progress</p>
                  </div>
                </div>
                
                <div className="flex items-start relative z-10">
                  <div className="w-5 h-5 rounded-full bg-gray-200 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Submit Documents</p>
                    <p className="text-xs text-gray-500">Next step</p>
                  </div>
                </div>
                
                <div className="flex items-start relative z-10">
                  <div className="w-5 h-5 rounded-full bg-gray-200 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Court Review</p>
                    <p className="text-xs text-gray-500">Estimated: 4-6 weeks</p>
                  </div>
                </div>
                
                <div className="flex items-start relative z-10">
                  <div className="w-5 h-5 rounded-full bg-gray-200 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Final Decision</p>
                    <p className="text-xs text-gray-500">Estimated: 2-3 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
        <button 
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          Next Step
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t text-xs text-gray-500">
        <p>This form wizard does not constitute legal advice. For legal advice specific to your situation, consult a qualified lawyer.</p>
      </div>
    </div>
  );
};

export default EnhancedFormWizard;