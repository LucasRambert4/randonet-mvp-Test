import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#013220',
  },
  container: { flex: 1, padding: 16 },
  input: {
    backgroundColor: '#024d2d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: '#fff',
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

  list: { paddingBottom: 20 },
  loader: { marginTop: 20 },
  card: {
    backgroundColor: '#024d2d',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  summary: {
    fontSize: 13,
    color: '#ddd',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  detail: { fontSize: 14, color: '#ccc', marginBottom: 8 },
  mapPreview: {
    width: '100%',
    height: 180,
    marginVertical: 10,
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#02c95c',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#013220', fontWeight: 'bold' },
});

export default styles;
