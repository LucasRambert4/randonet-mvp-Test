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
});

export default styles;
