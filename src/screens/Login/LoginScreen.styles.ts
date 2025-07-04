import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0d3a27',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontStyle: 'italic',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 25,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontStyle: 'italic',
  },
  toggleText: {
    marginTop: 20,
    fontStyle: 'italic',
    color: '#eee',
  },
});

export default styles;
