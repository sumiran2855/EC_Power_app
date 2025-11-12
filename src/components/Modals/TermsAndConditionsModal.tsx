import { MaterialIcons as Icon } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from './TermsAndConditionsModal.styles';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  termsData: {
    termsAndConsent: string[];
    title: string;
    checkboxLabel: string;
    checkboxLabel2: string;
    cancelButton: string;
    acceptButton: string;
  };
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  termsData,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [skipTerms, setSkipTerms] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
      onClose();
      // Reset state after closing
      setIsChecked(false);
      setSkipTerms(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after closing
    setIsChecked(false);
    setSkipTerms(false);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{termsData.title}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Terms Content */}
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={true}
            scrollIndicatorInsets={{ right: 1 }}
          >
            {termsData.termsAndConsent.map((para: string, idx: number) => (
              <Text key={idx} style={styles.termsText}>
                {para}
              </Text>
            ))}
          </ScrollView>

          {/* Checkboxes */}
          <View style={styles.checkboxContainer}>
            {/* Skip Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => {
                const newValue = !skipTerms;
                setSkipTerms(newValue);
                if (newValue) setIsChecked(false);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, skipTerms && styles.checkboxChecked]}>
                {skipTerms && (
                  <Icon name="check" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{termsData.checkboxLabel2}</Text>
            </TouchableOpacity>

            {/* Accept Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => {
                const newValue = !isChecked;
                setIsChecked(newValue);
                if (newValue) setSkipTerms(false);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && (
                  <Icon name="check" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{termsData.checkboxLabel}</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{termsData.cancelButton}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.acceptButton,
                !isChecked && styles.acceptButtonDisabled,
              ]}
              onPress={handleAccept}
              disabled={!isChecked}
              activeOpacity={isChecked ? 0.7 : 0.5}
            >
              <Text style={styles.acceptButtonText}>{termsData.acceptButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TermsAndConditionsModal;
