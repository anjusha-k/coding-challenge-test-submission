import React from 'react';
import Button from '@/components/Button/Button';
import styles from './Form.module.css';

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  legend: string;
  submitButtonText: string;
  loading?: boolean;
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  legend,
  submitButtonText,
  loading = false,
  children
}) => {
  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>{legend}</legend>
        {children}
        <Button type="submit" loading={loading}>
          {submitButtonText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;