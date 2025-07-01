import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../../utils/providers/ThemeProvider';
import { AccountListItemProps } from './types';

// Import des composants atomiques
import { Text } from '../../atoms/base';
import { Avatar } from '../../atoms/display';
import { ArrowRightRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ArrowRightRegularBoldIcon';
import { AvatarSharpBulkIcon } from '../../../../assets/icons/figma/sharp-bulk/AvatarSharpBulkIcon';

/**
 * Composant AccountListItem (node-id=560:15440)
 * Affiche un élément de liste pour le compte utilisateur
 * Design fidèle au design Figma sans adaptation
 */
const AccountListItem: React.FC<AccountListItemProps> = ({
  avatar,
  title,
  subtitle,
  rightText,
  showBadge = false,
  badgeCount = 0,
  showChevron = true,
  isDarkMode = false,
  onPress,
  style,
}) => {
  const theme = useAppTheme();
  
  // Couleurs selon le thème (fidèles au design Figma)
  const colors = {
    background: isDarkMode ? '#1F222A' : theme.colors.background,
    text: isDarkMode ? '#FFFFFF' : '#212121',
    subtext: isDarkMode ? '#EEEEEE' : '#616161',
    rightText: isDarkMode ? '#EEEEEE' : '#616161',
    badge: theme.colors.successLight, // Couleur verte du badge (A1CE50)
    badgeText: '#FFFFFF',
    chevron: isDarkMode ? '#EEEEEE' : '#616161',
    border: isDarkMode ? '#35383F' : theme.colors.backgroundGrey,
  };
  
  // On utilisera AvatarSharpBulkIcon si pas d'avatar fourni

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.background, borderBottomColor: colors.border },
        style
      ]}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Avatar */}
      {avatar ? (
        <Avatar 
          source={{ uri: avatar }} 
          size="medium" 
          type="default"
          containerStyle={{ marginRight: 12 }}
        />
      ) : (
        <View style={styles.avatarIconContainer}>
          <AvatarSharpBulkIcon size={40} color={colors.text} />
        </View>
      )}
      
      {/* Contenu textuel */}
      <View style={styles.content}>
        <Text 
          variant="body" 
          color={colors.text} 
          bold
          mb={2}
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text 
            variant="caption" 
            color={colors.subtext}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {/* Partie droite (badge, texte, chevron) */}
      <View style={styles.rightContainer}>
        {rightText && (
          <Text 
            variant="caption" 
            color={colors.rightText}
            medium
          >
            {rightText}
          </Text>
        )}
        
        {showBadge && (
          <View style={[styles.badge, { backgroundColor: colors.badge }]}>
            <Text 
              variant="caption" 
              color={colors.badgeText} 
              medium
            >
              {badgeCount > 99 ? '99+' : badgeCount}
            </Text>
          </View>
        )}
        
        {showChevron && (
          <View style={styles.chevronContainer}>
            <ArrowRightRegularBoldIcon 
              width={8} 
              height={12} 
              color={colors.chevron} 
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24, // 1.5 * fontSize
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22.4, // 1.6 * fontSize
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 8,
  },
  rightText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22.4, // 1.6 * fontSize
    marginRight: 8,
  },
  badge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginRight: 8,
  },
  badgeText: {
    fontFamily: 'Urbanist',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 16, // 1.6 * fontSize
  },
  chevronContainer: {
    marginLeft: 4,
  },
});

export default AccountListItem;
