
import { useRef, useState } from "react";

const Api_key = "e7f63ab6112250a6e7ac87f61407b11d";

const App = () => {
  const inputRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [showWeather, setShowWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const WeatherTypes = [
    { type: "Clear", img: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png" },
    { type: "Rain", img: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png" },
    { type: "Snow", img: "https://cdn-icons-png.flaticon.com/512/642/642102.png" },
    { type: "Clouds", img: "https://cdn-icons-png.flaticon.com/512/414/414825.png" },
    { type: "Haze", img: "https://cdn-icons-png.flaticon.com/512/1197/1197102.png" },
    { type: "Smoke", img: "https://cdn-icons-png.flaticon.com/512/4380/4380458.png" },
    { type: "Mist", img: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png" },
    { type: "Drizzle", img: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png" },
  ];



  const location = async () => {
    function gotLocation(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${Api_key}`;

      setLoading(true);
      fetch(weatherURL)
        .then((res) => res.json())
        .then((data) => {
          inputRef.current.value = ` ${latitude} , ${longitude} , ${data.name}, ${data.sys.country}`;
          setApiData(data);
          setShowWeather(
            WeatherTypes.filter((weather) => weather.type === data.weather[0].main)
          );
          fetchForecast(latitude, longitude);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }

    function failed() {
      alert("There is some issue retrieving your location.");
    }
    navigator.geolocation.getCurrentPosition(gotLocation, failed);
  };

  const fetchForecast = (lat, lon) => {
    const city = inputRef.current.value;
    const forecastURL = lat && lon 
      ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${Api_key}` 
      : `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${Api_key}`;
    
    setLoading(true);
    fetch(forecastURL)
      .then((res) => res.json())
      .then((data) => {
        const dailyData = data.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        );
        setForecastData(dailyData); 
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const fetchWeather = () => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${inputRef.current.value}&exclude=current,hourly,daily&units=metric&appid=${Api_key}`;
    setLoading(true);
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setApiData(null);
        if (data.cod === 404 || data.cod === 400) {
          setShowWeather([{ type: "Not Found", img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png" }]);
        } else {
          setShowWeather(WeatherTypes.filter((weather) => weather.type === data.weather[0].main));
          setApiData(data);
          fetchForecast();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="bg-elliptical-gradient">
      <div className="fixed h-16 bg-green-400 w-screen shadow-md bg-opacity-50 text-center pt-3">
        <a href="#" className="text-3xl font-extrabold text-white">
          WEATHER APP - Using OpenWeather Api
        </a>
      </div>

      <div className=" h-screen place-items-center grid">
        <div className="bg-white w-1/2 p-4 pt-3 rounded-md shadow-md shadow-gray-700">
          {/* Search input and buttons */}
          <div className="flex items-center justify-between">
            <input
              type="text"
              ref={inputRef}
              placeholder="Enter Your City"
              className="text-xl border-b p-1 border-gray-200 font-semiold uppercase flex-1"
            />
            <button onClick={(function() {fetchWeather(); getCurrentDate(); })}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/758/758651.png"
                alt="..."
                className="w-8 ml-2"
              />
            </button>
            <button onClick={location}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="..."
                className="w-8 ml-2"
              />
            </button>
          </div>
          {/* Weather display section */}
          <div className={`duration-300 delay-75 overflow-hidden ${showWeather ? "h-[27rem]" : "h-0"}`}>
            {loading ? (
              <div className="grid place-items-center h-full">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1477/1477009.png"
                  alt="..."
                  className="w-14 mx-auto mb-2 animate-spin"
                />
              </div>
            ) : (
              showWeather && (
                <div className="text-left grid grid-cols-2 gap-4 mt-10">
                  {apiData && (
                    <>
                      <div className="col-span-2 text-2xl mb-3 -mt-3 text-center font-semibold">
                        {apiData.name}
                        {apiData.sys?.country ? `, ${apiData.sys.country}` : 'IN'}
                      </div>
                      <div className="flex flex-col justify-between -ml-10">
                        <img
                          src={showWeather[0]?.img}
                          alt="Weather Icon"
                          className="w-36 mx-auto"
                        />
                        <div className="ml-28 m-5 flex flex-col justify-center">
                          <h3 className="text-2xl font-bold text-zinc-800">{showWeather[0]?.type}</h3>
                          {apiData && (
                            <div className="flex flex-col justify-start">
                              <div className="flex flex-row">
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/7794/7794499.png"
                                  alt="Thermometer Icon"
                                  className="h-9 mt-1"
                                />
                                <h2 className="text-4xl font-extrabold">
                                  {apiData?.main?.temp}&#176;C
                                </h2>
                              </div>
                              <div className="m-5 -ml-1 rounded-xl border border-gray-900 text-white bg-gray-900 pl-6 p-2">
                                <h2 className="text-base w-50 font-semibold">
                                  <span className="font-extrabold">Wind-speed : </span> {apiData?.wind?.speed} M/s
                                </h2>
                                <h2 className="text-base font-semibold">
                                  <span className="font-extrabold">Humidity : </span>{apiData?.main?.humidity}%
                                </h2>
                              </div>                    
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Forecast display section for the next 6 days */}
                      <div className="grid gap-4 grid-cols-3 m-5">
                        {forecastData.slice(0, 6).map((day, index) => {
                          const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
                            weekday: 'short', day: '2-digit', month: 'short'
                          });
                          return (
                            <div key={index} className="bg-slate-300 h-32 w-[100px] flex flex-col justify-center items-center rounded-xl p-4">
                              <h4 className=" text-xs font-semibold">{date}</h4>
                              <img src={WeatherTypes.find(w => w.type === day.weather[0].main)?.img || ""} alt="" className="h-12 m-2" />
                              <h4 className="font-medium">{day.main.temp}°C</h4>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      </div>
  );
};

export default App;

