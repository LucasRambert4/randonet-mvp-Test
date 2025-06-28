import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    height: 300,
    width: '100%',
  },
  contentBox: {
    padding: 16,
  },
  summary: {
    color: '#fff',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statBox: {
    width: '50%',
    marginBottom: 8,
  },
  label: {
    color: '#aaa',
  },
  value: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    marginLeft: 8,
    color: '#02c95c',
    fontWeight: 'bold',
  },
});
