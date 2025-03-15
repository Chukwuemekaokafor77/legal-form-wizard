// src/components/ui/InteractiveGuide.js
export const InteractiveGuide = ({ steps, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isOpen, setIsOpen] = useState(true);
  
    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsOpen(false);
        onComplete?.();
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Guide</h4>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-2 text-gray-500 hover:text-gray-700"
                aria-label="Close guide"
              >
                ✕
              </button>
            </div>
          </div>
  
          <div className="mb-4">
            {steps[currentStep].content}
          </div>
  
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-blue-600 px-3 py-1 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  