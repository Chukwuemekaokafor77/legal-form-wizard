// src/components/ui/GuidedHelp.js
import React, { useState } from 'react';

export const GuidedHelp = ({ children, title, content, examples, videoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="inline-block">
        {children}
        <button
          className="ml-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
          onClick={() => setIsOpen(true)}
          aria-label={`Get help with ${title}`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close help dialog"
                >
                  ✕
                </button>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                {content}

                {examples && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">Examples</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                      {examples}
                    </div>
                  </div>
                )}

                {videoUrl && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">Video Guide</h4>
                    <div className="aspect-w-16 aspect-h-9 mt-2">
                      <iframe
                        src={videoUrl}
                        title={`Video guide for ${title}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
