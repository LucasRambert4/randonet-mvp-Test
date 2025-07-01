import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#013220',
    flexGrow: 1,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  chip: {
    backgroundColor: '#999',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeChip: {
    backgroundColor: '#2ecc71',
  },
  chipText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  readOnlyText: {
    color: 'white',
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#27ae60',
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
