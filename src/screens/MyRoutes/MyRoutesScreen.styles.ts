// MyRoutesScreen.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d3a27',
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
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabText: {
    fontSize: 16,
    color: '#ccc',
    paddingBottom: 5,
  },
  activeTab: {
    color: 'white',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  card: {
    backgroundColor: '#014822',
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  metaText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 2,
  },
  rating: {
    flexDirection: 'row',
    marginTop: 4,
  },
});

export default styles;
