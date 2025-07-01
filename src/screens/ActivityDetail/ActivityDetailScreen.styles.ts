// ActivityDetailScreen.styles.ts
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
    backgroundColor: '#09341f',
    padding: 15,
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  contentBox: {
    backgroundColor: '#004d40',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -30,
    padding: 20,
    flex: 1,
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: 280,
  },
  contentBox: {
    flex: 1,
    backgroundColor: '#09341f',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarSmall: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
  },
  meta: {
    color: 'white',
    fontSize: 13,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  statBox: {
    width: '47%',
  },
  label: {
    color: 'white',
    fontSize: 13,
    marginBottom: 3,
  },
  value: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  saveButton: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default styles;
