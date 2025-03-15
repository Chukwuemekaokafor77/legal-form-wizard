// src/components/wizard/ProvinceStep.js
import React, { useState, useEffect } from 'react';
import { ErrorMessage } from '../ui';
import { VALIDATION_RULES } from '../../data/questionSchema'; //Import validation rules
const ProvinceStep = ({ onChange, answers }) => {
  const [province, setProvince] = useState(answers.province || "");
  const [error, setError] = useState("");

  const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Northwest Territories",
    "Nunavut",
    "Yukon"
  ];

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    //Validate
    const validation = validateProvince(selectedProvince);
    setError(validation.error);
    onChange({ province: selectedProvince, isValid: validation.isValid });
  };

  useEffect(() => {
    //Initial Validation:
    const validation = validateProvince(province);
    setError(validation.error);
    onChange({ province: province, isValid: validation.isValid });
  }, []);

  //Validation Logic extracted
  const validateProvince = (selectedProvince) => {
    if (!selectedProvince) {
      return {
        isValid: false,
        error: "Please select a province"
      };
    }
    return {
      isValid: true,
      error: ""
    };
  };

  return (
    <div className="card">
      <h2>Select Your Province</h2>
      <select
        className={`border p-2 rounded w-full ${error ? "border-red-500" : ""}`}
        value={province}
        onChange={handleProvinceChange}
      >
        <option value="">Select a province</option>
        {provinces.map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default ProvinceStep;
