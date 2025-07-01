import { Platform, StatusBar, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#013220',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

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

  emptyContainer: {
    padding: 20,
  },

  emptyText: {
    color: '#ccc',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },

  userInfo: {
    flex: 1,
  },

  username: {
    color: 'white',
    fontSize: 16,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 4,
  },

  actionBtn: {
    marginRight: 12,
    paddingVertical: 4,
  },

  actionText: {
    fontWeight: 'bold',
  },

  acceptText: {
    color: '#2ecc71',
  },

  rejectText: {
    color: '#e74c3c',
  },

  pendingText: {
    color: '#aaa',
    marginTop: 4,
  },

  friendText: {
    color: '#aaa',
    marginTop: 4,
  },

  addBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 4,
  },

  addText: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
});
