// PrivacyScreen.styles.ts
import { Platform, StatusBar, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d3a27',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#09341f',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  section: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  label: {
    color: 'white',
    fontSize: 16,
  },
  languageToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  langSelected: {
    backgroundColor: 'white',
  },
  langText: {
    color: 'white',
    fontWeight: 'bold',
  },
  langSelectedText: {
    color: '#013220',
  },
  inviteButton: {
    marginTop: 10,
  },
  inviteText: {
    color: 'white',
    fontSize: 16,
  },
});

export default styles;
