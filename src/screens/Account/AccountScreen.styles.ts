// AccountScreen.styles.ts
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
  userInfo: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  emailText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  nameText: {
    color: '#ccc',
    fontSize: 13,
    fontStyle: 'italic',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  body: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  itemText: {
    color: 'white',
    marginLeft: 15,
    fontSize: 16,
  },
});

export default styles;
