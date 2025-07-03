import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

export const { height } = Dimensions.get('window');
export const TAB_BAR_HEIGHT = 60;

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
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  map: { width: '100%', height: height * 0.66 },
  infoPanel: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#09341f',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: { alignItems: 'center' },
  label: { color: '#aaa', fontSize: 14 },
  value: { color: '#fff', fontSize: 20, fontWeight: '600' },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  buttonGreen: {
    backgroundColor: '#2ecc71',
    width: '48%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonRed: {
    backgroundColor: '#e74c3c',
    width: '48%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonGray: {
    backgroundColor: '#7f8c8d',
    width: '48%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  focusButton: {
    position: 'absolute',
    right: 24,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 24,
    zIndex: 10,
  },
  focusButtonText: { fontSize: 20 },
});

export default styles;
