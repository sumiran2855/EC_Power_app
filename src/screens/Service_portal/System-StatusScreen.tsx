import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import styles from './System-StatusScreen.styles';
import useSystemStatus from '../../hooks/Service-portal/useSystemStatus';
import useCardAnimations from '../../hooks/Service-portal/useCardAnimations';
import { useTranslation } from 'react-i18next';

interface StatusCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  label: string;
  color: string;
  bgColor: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  onPress?: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  count,
  label,
  color,
  bgColor,
  percentage = 0,
  trend = 'neutral',
  onPress
}) => {
  const {
    scaleAnim,
    handlePressIn,
    handlePressOut,
    getTrendColor,
    getTrendIcon,
  } = useCardAnimations();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
            <Ionicons name={icon} size={22} color={color} />
          </View>
          <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor(trend)}15` }]}>
            <Ionicons name={getTrendIcon(trend) as any} size={12} color={getTrendColor(trend)} />
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.count}>{count.toLocaleString()}</Text>
          <Text style={styles.label} numberOfLines={2}>{label}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${percentage}%`, backgroundColor: color }
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface SystemStatusScreenProps {
  navigation: any;
}

const SystemStatusScreen: React.FC<SystemStatusScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    totalUnits,
    getStatsBarData,
    getCardRows,
    loading,
  } = useSystemStatus();

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (

    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{t('systemStatus.title')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('systemStatus.subtitle')}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1a5490" />
            <Text style={styles.loadingText}>{t('systemStatus.loading')}</Text>
          </View>
        ) : (
          <>
            {/* Statistics Card */}
            <View style={styles.statsCard}>
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>{t('systemStatus.totalActiveUnits')}</Text>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveBadgeText}>{t('systemStatus.live')}</Text>
                </View>
              </View>

              <View style={styles.totalContainer}>
                <Text style={styles.totalNumber}>{totalUnits.toLocaleString()}</Text>
                <Text style={styles.totalLabel}>{t('systemStatus.units')}</Text>
              </View>

              <View style={styles.statsBar}>
                {getStatsBarData().map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.statsBarSegment,
                      { width: `${item.percentage}%`, backgroundColor: item.color }
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('systemStatus.statusOverview')}</Text>
            </View>

            {/* Status Grid */}
            <View style={styles.grid}>
              {getCardRows().map((row, rowIndex) => (
                <View key={rowIndex} style={styles.gridRow}>
                  {row.map((item, index) => (
                    <StatusCard
                      key={`${rowIndex}-${index}`}
                      icon={item.icon}
                      count={item.count}
                      label={item.label}
                      color={item.color}
                      bgColor={item.bgColor}
                      percentage={item.percentage}
                      trend={item.trend}
                      onPress={() => console.log(`${item.label} pressed`)}
                    />
                  ))}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SystemStatusScreen;