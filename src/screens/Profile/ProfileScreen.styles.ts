// ProfileScreen.styles.ts
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
    fontSize: 20,
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
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  emailText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  nameText: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5,
  },
  options: {
    paddingHorizontal: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  itemText: {
    marginLeft: 15,
    fontSize: 16,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: '600',
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'white',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancel: {
    color: '#aaa',
    fontSize: 16,
    marginRight: 20,
  },
  modalConfirm: {
    color: '#28a745',
    fontSize: 16,
  },
  verifiedText: {
    color: '#4CAF50',
    marginTop: 5,
    fontSize: 14,
  },
  verifyText: {
    color: '#2196F3',
    marginTop: 5,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default styles;
