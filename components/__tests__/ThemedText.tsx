import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ThemedTextProps {
  children: React.ReactNode;
  style?: object;
  theme: 'light' | 'dark';
}

const ThemedText: React.FC<ThemedTextProps> = ({ children, style, theme, ...props }) => {
  const textStyle = [styles.text, theme === 'dark' ? styles.dark : styles.light, style];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  light: {
    color: '#000',
  },
  dark: {
    color: '#fff',
  },
});

export default ThemedText;