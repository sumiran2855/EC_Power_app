import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './Card.styles';
import { Facility } from '@/screens/authScreens/types';

type Status = 'Active' | 'Inactive' | 'Data Missing' | 'pending' | 'active';

interface CardProps {
  item: Facility;
  onPress: (item: any) => void;
  onDelete?: (id: string) => void;
  showDeleteButton?: boolean;
}

const Card: React.FC<CardProps> = ({
  item,
  onPress,
  onDelete,
  showDeleteButton = true,
}) => {
  const getStatusStyles = () => {
    switch (item.status) {
      case 'Active':
      case 'Active':
        return {
          container: styles.statusBadgeActive,
          text: styles.activeStatusText,
        };
      case 'Inactive':
        return {
          container: styles.statusBadgeInactive,
          text: styles.inactiveStatusText,
        };
      case 'Data Missing':
        return {
          container: styles.statusBadgePending,
          text: styles.statusTextPending,
        };
      default:
        return {
          container: styles.statusBadgeDataMissing,
          text: styles.dataMissingStatusText,
        };
    }
  };

  const statusStyles = getStatusStyles();
  const displayStatus = item.status === 'Data Missing' ? 'Data Missing' : item.status;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardImageContainer}>
          <View style={styles.cardImageWrapper}>
            <Image
              source={require('../../../assets/card.png')}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.cardInfo}>
          <View style={[styles.statusBadge, statusStyles.container]}>
            <Text style={[styles.statusText, statusStyles.text]}>
              {displayStatus}
            </Text>
          </View>

          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardSerial}>
            {item.xrgiID || 'N/A'}
          </Text>
        </View>

        {showDeleteButton && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Card;
