import { useState } from 'react';

interface FormFields {
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
}

export const useFormFields = () => {
  const [fields, setFields] = useState<FormFields>({
    postCode: '',
    houseNumber: '',
    firstName: '',
    lastName: '',
    selectedAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    fields,
    handleChange
  };
};
