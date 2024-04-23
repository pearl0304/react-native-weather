import {StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7E8FA',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold"
  },
  current: {
    flex:1,
    flexDirection: "column",
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    marginHorizontal: 20,
    borderRadius: 10,
  },

  tempInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:"space-between",
  },

  tempSign: {
    fontSize: 20,
    fontWeight: 'normal',
  },

  currentTemp: {
    fontSize: 80,
    fontWeight: 'bold'
  },
  currentDescription: {
    fontSize: 20,
    marginTop: 10
  },

  day: {
    flex: 1,
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  temp: {
    fontSize: 50,
  },
  description: {
    fontSize: 14,
    marginTop: 10
  }
});

export {styles};
