import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#013220' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: { color: 'white', fontSize: 18 },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#024d2d',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: { color: '#fff', fontWeight: '600' },
  meta: { color: '#ccc', fontSize: 12 },
  map: {
    width: width - 40,
    height: 180,
    borderRadius: 10,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    gap: 12,
  },
});
