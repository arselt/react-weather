import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error', 
  message 
}) => {
  return (
    <div className="border-l-4 border-danger dark:border-dark-danger p-4 bg-surface dark:bg-dark-surface text-danger dark:text-dark-danger shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
      <p className="font-bold text-xl">{title}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage; 