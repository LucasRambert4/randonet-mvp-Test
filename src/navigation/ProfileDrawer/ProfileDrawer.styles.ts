// ProfileDrawer.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ffffff22',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: '#222',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 4,
  },
  drawerLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: -10,
  },
  icon: {
    fontSize: 18,
    marginRight: -10,
  },
});

export default styles;
