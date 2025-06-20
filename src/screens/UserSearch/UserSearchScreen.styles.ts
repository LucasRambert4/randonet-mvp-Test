import { StyleSheet } from 'react-native';

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
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },
  itemInfo: { flexDirection: 'row', alignItems: 'center' },
  itemAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  itemName: { color: 'white', fontSize: 16 },
  requestedText: { color: '#ccc', fontSize: 14 },
  friendText: { color: 'white', fontSize: 14 },
});
