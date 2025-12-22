import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface LoginAlertState {
  isVisible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export const useLoginAlert = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<LoginAlertState>({
    isVisible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    setAlert({
      isVisible: true,
      type,
      title,
      message,
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  };

  const showLoginSuccess = () => {
    showAlert(
      'success',
      t('login.alerts.loginSuccess.title'),
      t('login.alerts.loginSuccess.message')
    );
  };

  const showLoginError = (errorMessage?: string) => {
    const message = errorMessage || t('login.alerts.loginFailed.message');
    showAlert(
      'error',
      t('login.alerts.loginFailed.title'),
      message
    );
  };

  const showCustomError = (title: string, message: string) => {
    showAlert('error', title, message);
  };

  const showCustomSuccess = (title: string, message: string) => {
    showAlert('success', title, message);
  };

  return {
    alert,
    showAlert,
    hideAlert,
    showLoginSuccess,
    showLoginError,
    showCustomError,
    showCustomSuccess,
  };
};
