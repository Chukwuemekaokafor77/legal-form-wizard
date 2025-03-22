// src/components/assistant/EnhancedFormAssistant.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageCircle, X, HelpCircle, Sparkles } from 'lucide-react';

export const EnhancedFormAssistant = ({ 
  section, 
  fieldDefinitions,
  currentValues,
  onUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  
  // Initialize assistant with a welcome message
  useEffect(() => {
    if (fieldDefinitions.length > 0) {
      setConversation([{
        type: 'assistant',
        message: `Hello! I can help you complete the ${section} section. Would you like me to guide you through the questions?`,
        options: ['Yes, help me', 'No thanks']
      }]);
    }
  }, [fieldDefinitions, section]);
  
  const handleUserResponse = (response, questionId) => {
    // Add user response to conversation
    setConversation(prev => [...prev, {
      type: 'user',
      message: response
    }]);
    
    if (questionId) {
      // Save the actual field value
      setUserResponses(prev => ({
        ...prev,
        [questionId]: response
      }));
      
      // Update the form data
      onUpdate({ [questionId]: response });
      
      // Move to next question or wrap up
      const currentIndex = fieldDefinitions.findIndex(f => f.id === questionId);
      if (currentIndex < fieldDefinitions.length - 1) {
        const nextField = fieldDefinitions[currentIndex + 1];
        askQuestion(nextField);
      } else {
        // Finish the conversation
        setConversation(prev => [...prev, {
          type: 'assistant',
          message: "Great! We've completed this section. Is there anything else you'd like help with?",
          options: ['Review my answers', 'I\'m done']
        }]);
      }
    } else if (response === 'Yes, help me') {
      // Start asking questions
      if (fieldDefinitions.length > 0) {
        askQuestion(fieldDefinitions[0]);
      }
    } else if (response === 'Review my answers') {
      // Show a summary of answers
      const summary = Object.entries(userResponses)
        .map(([id, value]) => {
          const field = fieldDefinitions.find(f => f.id === id);
          return `${field?.label || id}: ${value}`;
        })
        .join('\n');
      
      setConversation(prev => [...prev, {
        type: 'assistant',
        message: `Here's a summary of your answers:\n\n${summary}`
      }]);
    }
  };
  
  const askQuestion = (field) => {
    setCurrentQuestion(field.id);
    
    let message = field.friendlyQuestion || `Please enter your ${field.label}`;
    if (field.required) {
      message += " (required)";
    }
    
    if (field.helpText) {
      message += `\n\n${field.helpText}`;
    }
    
    setConversation(prev => [...prev, {
      type: 'assistant',
      message,
      field
    }]);
  };
  
  // Render the chat interface
  return (
    <div className="form-assistant bg-white rounded-lg shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-blue-600 p-3 w-full hover:bg-blue-50 rounded-lg transition-colors"
      >
        <MessageCircle size={20} />
        <span className="font-medium">Get help completing this section</span>
        {isOpen ? (
          <X size={18} className="ml-auto" />
        ) : (
          <ChevronRight size={18} className="ml-auto" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-blue-500" size={18} />
            <h3 className="font-medium">Form Assistant</h3>
          </div>
          
          <div className="conversation-container max-h-80 overflow-y-auto mb-4 space-y-3">
            {conversation.map((item, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  item.type === 'assistant' 
                    ? 'bg-blue-50 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 ml-8'
                }`}
              >
                <div className="whitespace-pre-line">{item.message}</div>
                
                {item.options && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleUserResponse(option)}
                        className="px-3 py-1.5 bg-white border rounded-full text-sm hover:bg-gray-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                
                {item.field && (
                  <div className="mt-3">
                    {renderFieldInput(item.field, handleUserResponse)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to render the appropriate input for each field type
const renderFieldInput = (field, onSubmit) => {
  switch (field.type) {
    case 'text':
      return (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const value = e.target.elements.response.value;
            onSubmit(value, field.id);
          }}
          className="flex gap-2"
        >
          <input
            name="response"
            type="text"
            className="flex-grow p-2 border rounded"
            placeholder={field.placeholder || `Enter ${field.label}`}
          />
          <button 
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      );
    
    case 'select':
      return (
        <div className="space-y-2">
          {field.options?.map(option => (
            <button
              key={option.value}
              onClick={() => onSubmit(option.value, field.id)}
              className="w-full text-left px-3 py-2 border rounded hover:bg-gray-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    
    // Add more field types as needed
    
    default:
      return (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const value = e.target.elements.response.value;
            onSubmit(value, field.id);
          }}
          className="flex gap-2"
        >
          <input
            name="response"
            type="text"
            className="flex-grow p-2 border rounded"
            placeholder="Your response"
          />
          <button 
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      );
  }
};