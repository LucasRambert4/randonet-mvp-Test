// LoaderScreen.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b3825',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  subtitle: {
    color: 'white',
    fontSize: 28,
    fontStyle: 'italic',
  },
});

export default styles;
