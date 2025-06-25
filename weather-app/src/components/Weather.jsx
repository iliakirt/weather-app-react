import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {
  const inputRef = useRef()

  const [weatherData, setWeatherData] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon
  }

  const search = async (city) => {
    setLoading(true);
    setError("");
    if (city === "") {
      setError("Please enter a city name.");
      setLoading(false);
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || "Something went wrong!");
        setLoading(false);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        timezone: data.timezone,
        min: Math.floor(data.main.temp_min),
        max: Math.floor(data.main.temp_max)
      });

      inputRef.current.value = "";
      setLoading(false);
    } catch (error) {
      setWeatherData(false);
      setError("Error in fetching weather data");
      setLoading(false);
    }
  }

  useEffect(() => {
    search("Thessaloniki");
  }, []);

  return (
    <div className='weather'>
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder='Search'
          onKeyDown={(e) => {
            if (e.key === 'Enter') search(inputRef.current.value);
          }}
        />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading...</p>}

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className='weather-icon' />
          <div className="temperature-row">
            <span className="temp-side">{weatherData.min}°c</span>
            <p className='temperature'>{weatherData.temperature}°c</p>
            <span className="temp-side">{weatherData.max}°c</span>
          </div>
          <p className="date-time">
            {new Date(
              new Date().getTime() +
              new Date().getTimezoneOffset() * 60000 +
              weatherData.timezone * 1000
            ).toLocaleString("el-GR", {
              dateStyle: "short",
              timeStyle: "medium"
            })}
          </p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        !loading && !error && <p className="fallback-message">Type a city and press search.</p>
      )}
    </div>
  )
}

export default Weather
