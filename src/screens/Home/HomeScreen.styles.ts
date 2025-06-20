// HomeScreen.styles.ts
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
    gap: 15,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  card: {
    backgroundColor: '#09341f',
    marginHorizontal: 10,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 10,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
  },
  meta: {
    color: 'white',
    fontSize: 13,
  },
  map: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
});

export default styles;
