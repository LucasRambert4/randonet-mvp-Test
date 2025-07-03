import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#013220' },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#014b2c',
  },

  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },

  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  tabItem: {
    paddingVertical: 10,
  },

  tabText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
  },

  activeTab: {
    color: 'white',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },

  chatItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },

  chatAvatar: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#111',
  },

  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },

  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  chatName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  chatTime: {
    color: '#ccc',
    fontSize: 12,
  },

  chatPreview: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 2,
  },

  messagesContainer: {
    flex: 1,
    backgroundColor: '#013220',
    paddingBottom: 2,
  },

  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    maxWidth: '75%',
  },

  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2ecc71',
  },

  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#3498db',
  },

  messageText: {
    color: 'white',
  },

  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#013220',
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },

  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: 10,
    borderRadius: 10,
  },

  sendButton: {
    padding: 10,
  },

  sendButtonText: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
});

export default styles;
