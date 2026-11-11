import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div role="alert" className="border-l-4 border-danger dark:border-dark-danger p-4 bg-surface dark:bg-dark-surface text-danger dark:text-dark-danger brutal-shadow">
      <p className="font-bold text-xl">{t('error.title')}</p>
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-accent dark:bg-dark-accent text-text-primary dark:text-dark-bg font-bold
                    border-2 border-text-primary dark:border-dark-text-primary brutal-shadow
                    hover:translate-y-[-2px] transition-transform"
        >
          {t('error.retry')}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
