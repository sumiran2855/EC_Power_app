import { I18nextProvider } from 'react-i18next';
import AppNavigator from './src/navigation/AppNavigator';
import i18n from './languages/i18n.config';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppNavigator />
    </I18nextProvider>
  );
}
