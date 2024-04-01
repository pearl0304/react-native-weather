import moment from "moment";
import * as Location from 'expo-location';
import {StatusBar} from 'expo-status-bar';
import {ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator} from 'react-native';
import {useEffect, useState} from "react";
import {styles} from "./src/style/mainStyle";
import {Fontisto} from '@expo/vector-icons';

const apiKey = process.env.OPEN_WEATHER_API_KEY;
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Drizzle: "rain",
  Snow: "snow",
  Atmosphere: "cloudy-gusts",
  Thunderstorm: "lighting"
}

export default function App() {
  const [city, setCity] = useState('Loading...')
  const [current, setCurrent] = useState({
    temp: null, tempMax: null, weather: []
  });
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState();
  const [confirm, setConfirm] = useState(true);

  useEffect(() => {
    aks();
  }, [])


  /**
   * CREATING TIME ZONES IN 3-HOUR INTERVALS
   * @param interval
   * @returns {Promise<*[]>}
   */
  const makeTimeZone = async (interval) => {
    try {
      const timeZone = [];
      const maxTime = 24;
      for (let hour = 0; hour < maxTime; hour += interval) {
        const block = [];
        for (let i = hour; i < hour + interval; i++) {
          block.push(i.toString().padStart(2, '0'))
        }
        timeZone.push(block);
      }
      return timeZone;
    } catch (e) {
      console.error(e)
    }
  }


  /**
   * GETTING THE TIME ZONE TO WHICH THE CURRENT TIME BELONGS
   * @returns {Promise<string|string>}
   */
  const getTimeZone = async () => {
    try {
      const timeZone = await makeTimeZone(3);
      let currentTime = moment().add(3, 'hour').format('HH');
      const foundZone = timeZone.find(zone => zone.includes(currentTime));
      let printTime = foundZone ? `${foundZone[0]}:00:00` : '00:00:00';
      return printTime;

    } catch (e) {
      console.error(e)
    }
  }

  /**
   * GETTING CURRENT LOCATION INFORMATION
   * @param latitude
   * @param longitude
   * @returns {Promise<void>}
   */
  const getCurrentInfo = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
      const json = await response.json();
      setCurrent({
        temp: json.main.temp,
        tempMax: json.main.temp_max,
        weather: json.weather[0]
      });

    } catch (e) {
      console.error(e)
    }

  }

  /**
   * GET FORECAST WHILE 5 DAYS
   * @param latitude
   * @param longitude
   * @returns {Promise<void>}
   */
  const getFiveDaysInfo = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
      const {list} = await response.json();
      const time = await getTimeZone();
      const filteredList = list.filter(({dt_txt}) => dt_txt.endsWith(time));
      setForecast(filteredList);
    } catch (e) {
      console.error(e)
    }
  }

  const aks = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) setConfirm(false);
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5})
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    await getCurrentInfo(latitude, longitude);
    await getFiveDaysInfo(latitude, longitude);
  }

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={styles.current}>
        <Text>CURRENT</Text>
        <View style={styles.tempInfo}>
          <Text style={styles.currentTemp}>{Math.round(current.temp)}</Text>
          <Text style={styles.tempSign}>°C</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Fontisto name={icons[current.weather.main]} size={40} color="black"/>
          <Text style={styles.currentDescription}>{current.weather.description}</Text>
        </View>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.weather}>

        {forecast.length === 0 ?
          <View style={styles.day}><ActivityIndicator color="white" size="large"></ActivityIndicator></View>
          : (
            forecast.map((day, index) =>
              <View key={index} style={styles.day}>
                <Text>{day.dt_txt}</Text>
                <View style={styles.tempInfo}>
                  <Text style={styles.temp}>{Math.round(day.main.temp)}</Text>
                  <Text style={styles.tempSign}>°C</Text>
                </View>
                <Fontisto name={icons[day.weather[0].main]} size={24} color="black"/>
                <Text style={styles.description}>{day.weather[0].description}</Text>
              </View>
            )
          )}
      </ScrollView>
    </View>
  );
}

