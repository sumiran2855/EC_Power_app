import React from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons as Icon } from "@expo/vector-icons";
import useSidebar, { MenuItem } from '../../hooks/useSidebar';
import styles from './Sidebar.styles';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onMenuItemPress?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onMenuItemPress }) => {
  const {
    // Data
    menuItems,
    
    // Functions
    handleMenuItemPress,
    handleLogout,
  } = useSidebar({ onClose, onMenuItemPress });

  const renderMenuItem = (item: MenuItem, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <Icon name={item.icon} size={24} color="#333" style={styles.menuIcon} />
        <Text style={styles.menuText}>{item.title}</Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <Icon name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles.sidebar}>

          {/* User Info Section */}
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <Image source={require('../../../assets/profile.jpeg')} style={styles.profileImage} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Martin Smith</Text>
              <Text style={styles.userEmail}>martin.smith@company.com</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <ScrollView 
            style={styles.menuSection}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContentContainer}
          >
            {menuItems.map(renderMenuItem)}
          </ScrollView>

          {/* Footer */}
          <SafeAreaView style={styles.sidebarFooter} edges={['bottom']}>
            <TouchableOpacity style={styles.footerItem} onPress={handleLogout} activeOpacity={0.7}>
              <Icon name="logout" size={20} color="#FF3B30" />
              <Text style={styles.footerText}>Sign Out</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default Sidebar;