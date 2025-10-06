import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../css/news/ClimateNewsScreen.styles';

interface NewsSectionHeaderProps {
  title: string;
}

const NewsSectionHeader: React.FC<NewsSectionHeaderProps> = ({ title }) => (
  <Text style={styles.verticalSectionHeader}>{title}</Text>
);

export default NewsSectionHeader;
