import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d3a27',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#02c95c',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#0d3a27',
    zIndex: 10,
  },
  startText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
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
