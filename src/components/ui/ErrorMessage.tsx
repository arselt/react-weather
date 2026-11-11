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
    <div role="alert" className="border-l-4 border-danger dark:border-dark-danger p-4 bg-surface dark:bg-dark-surface text-danger dark:text-dark-danger brutal-shadow">
      <p className="font-bold text-xl">{title}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
