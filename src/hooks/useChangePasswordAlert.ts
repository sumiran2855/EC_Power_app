import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ChangePasswordAlertState {
  isVisible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export const useChangePasswordAlert = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<ChangePasswordAlertState>({
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

  const showPasswordUpdateSuccess = () => {
    showAlert(
      'success',
      t('login.alerts.passwordUpdateSuccess.title'),
      t('login.alerts.passwordUpdateSuccess.message')
    );
  };

  const showPasswordUpdateError = (errorMessage?: string) => {
    const message = errorMessage || t('login.alerts.passwordUpdateFailed.message');
    showAlert(
      'error',
      t('login.alerts.passwordUpdateFailed.title'),
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
    showPasswordUpdateSuccess,
    showPasswordUpdateError,
    showCustomError,
    showCustomSuccess,
  };
};
