import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive calculation helpers
const wp = (percentage:any) => (SCREEN_WIDTH * percentage) / 100;
const hp = (percentage:any) => (SCREEN_HEIGHT * percentage) / 100;
const isSmallScreen = SCREEN_HEIGHT < 700;
const isMediumScreen = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 850;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#1e3a8a',
  },
  backgroundBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
    zIndex: 1,
    minHeight: SCREEN_HEIGHT,
  },
  header: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? hp(2) : isMediumScreen ? hp(3) : hp(4),
  },
  logo: {
    width: wp(20),
    height: wp(20),
    marginBottom: hp(1.5),
  },
  title: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: hp(0.8),
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 16 : 20,
    paddingHorizontal: wp(4),
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: wp(6),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginVertical: hp(2),
  },
  inputContainer: {
    marginBottom: isSmallScreen ? hp(1.5) : hp(2),
  },
  label: {
    fontSize: isSmallScreen ? 10 : 12,
    color: '#6b7280',
    marginBottom: hp(0.8),
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: isSmallScreen ? hp(1.2) : hp(1.5),
    paddingHorizontal: wp(4),
    fontSize: isSmallScreen ? 14 : 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    fontWeight: '500',
    minHeight: isSmallScreen ? 42 : 48,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: isSmallScreen ? hp(1.2) : hp(1.5),
    paddingHorizontal: wp(4),
    paddingRight: wp(12),
    fontSize: isSmallScreen ? 14 : 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    fontWeight: '500',
    minHeight: isSmallScreen ? 42 : 48,
  },
  eyeButton: {
    position: 'absolute',
    right: wp(3),
    padding: wp(2),
  },
  eyeIcon: {
    fontSize: 18,
    color: '#6b7280',
  },
  loginButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    paddingVertical: isSmallScreen ? hp(1.5) : hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
    marginBottom: isSmallScreen ? hp(1.5) : hp(2),
    shadowColor: '#1e3a8a',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    minHeight: isSmallScreen ? 44 : 50,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#6b7280',
    borderRadius: 4,
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  rememberMeText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#1e3a8a',
    fontWeight: '600',
    marginTop: hp(0.5),
  },
  verificationInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: isSmallScreen ? hp(1.2) : hp(1.5),
    paddingHorizontal: wp(4),
    fontSize: isSmallScreen ? 18 : 20,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 4,
    minHeight: isSmallScreen ? 50 : 56,
  },
  createAccountContainer: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  createAccountText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  createAccountLink: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  languageContainer: {
    marginBottom: hp(1),
  },
  languageLabel: {
    fontSize: isSmallScreen ? 10 : 12,
    color: '#6b7280',
    marginBottom: hp(0.8),
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  picker: {
    height: isSmallScreen ? 44 : 50,
    color: '#1f2937',
  },
  ForgetPasswordfooter: {
    alignItems: 'center',
  },
  // New styles for Signup Screen
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isSmallScreen ? hp(1.5) : hp(2),
    gap: wp(3),
  },
  nameField: {
    flex: 1,
    minWidth: 0,
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    marginRight: wp(3),
    minWidth: wp(18),
    height: isSmallScreen ? 42 : 48,
    justifyContent: 'center',
  },
  countryCodePicker: {
    height: isSmallScreen ? 42 : 48,
    color: '#1f2937',
    fontSize: isSmallScreen ? 12 : 14,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: isSmallScreen ? hp(1.2) : hp(1.5),
    paddingHorizontal: wp(4),
    fontSize: isSmallScreen ? 14 : 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    fontWeight: '500',
    minWidth: 0,
    minHeight: isSmallScreen ? 42 : 48,
  },
  signupFooter: {
    alignItems: 'center',
    marginTop: hp(1),
    paddingBottom: hp(2),
  },
  alreadyHaveAccountText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: hp(0.8),
  },
  backToLoginText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#1e3a8a',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  countryCodeText: {
    fontSize: isSmallScreen ? 13 : 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: wp(1),
  },
  // Error styles
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1,
    backgroundColor: '#fef2f2',
  },

  errorText: {
    color: '#ef4444',
    fontSize: isSmallScreen ? 10 : 12,
    marginTop: hp(0.4),
    marginLeft: wp(1),
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },

  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },

  loginButtonTextDisabled: {
    color: '#6b7280',
  },

  disabledText: {
    opacity: 0.5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    zIndex: 1, // Add this
  },

  countryCodeButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    marginRight: wp(3),
    width: wp(20), // Increased from wp(18)
    height: isSmallScreen ? 42 : 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2.5),
    flexShrink: 0,
    zIndex: 2, // Add this
  },

  // Add this new wrapper style
  countryDropdownWrapper: {
    position: 'relative',
    width: '100%',
    marginTop: hp(0.5),
    zIndex: 9999,
  },

  countryDropdown: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: hp(30),
    width: '100%',
  },

  countryOption: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },

  countryOptionText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#1f2937',
    fontWeight: '500',
  },
});