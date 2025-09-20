
import { useRef, useState } from "react";

const Api_key = import.meta.env.VITE_API_KEY

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
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 overflow-hidden min-h-screen relative">
      <div className="fixed py-5 bg-gradient-to-r from-violet-500 to-indigo-600 w-screen text-wrap shadow-md bg-opacity-50 text-center mb-10 z-50">
        <a href="#" className="lg:text-4xl md:text-2xl text-xl text-wrap font-extrabold font-mono uppercase text-center text-white px-5 tracking-wider">
          WEATHER APP
        </a>
      </div>

      <div className="absolute top-0 left-0 w-screen h-full opacity-20">
        <img
          src="/image.png"
          alt="pattern"
          className="w-full h-full object-cover filter brightness-50"
          loading="lazy"
        />
      </div>

      <div className=" place-items-center min-h-screen grid mx-3 sm:mx-5 relative mb-5">
        <div className="bg-white w-full max-w-3xl p-4 rounded-md shadow-md mt-20 shadow-gray-700">
          {/* Search input and buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <input
              type="text"
              ref={inputRef}
              placeholder="Enter Your City"
              className="text-base sm:text-xl border-b p-2 border-gray-200 uppercase flex-1 outline-none font-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={function () {
                  fetchWeather();
                  getCurrentDate();
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/758/758651.png"
                  alt="search"
                  className="w-7 sm:w-8"
                />
              </button>
              <button onClick={location}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt="location"
                  className="w-7 sm:w-8"
                />
              </button>
            </div>
          </div>

          {/* Weather display section */}
          <div
            className={`duration-300 delay-75 overflow-hidden ${showWeather ? "h-auto mt-6" : "h-0"
              }`}
          >
            {loading ? (
              <div className="grid place-items-center h-60">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1477/1477009.png"
                  alt="loading"
                  className="w-12 sm:w-14 mx-auto mb-2 animate-spin"
                />
              </div>
            ) : (
              showWeather && (
                <div className="text-left gap-6 lg:grid-cols-2">
                  {apiData && (
                    <>
                      {/* City Name */}
                      <div className="flex place-items-center p-6">
                        <div className=" w-full">
                          {/* Header: City + Date */}
                          <div className="flex flex-col lg:flex-row justify-between items-center text-center sm:text-left">
                            <h2 className="text-lg sm:text-xl font-semibold lg:ml-5">
                              {apiData?.name}, {apiData?.sys?.country || "IN"}
                            </h2>
                            <p className="text-sm sm:text-base mt-1 sm:mt-0">
                              {new Date().toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          {/* Content */}
                          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6">
                            {/* Left Side (Weather details) */}
                            <div className="flex flex-col items-center lg:items-start lg:ml-4 text-center">
                              <img
                                src={showWeather[0]?.img}
                                alt="Weather Icon"
                                className="w-28 sm:w-36"
                              />
                              <h3 className="text-xl sm:text-2xl font-bold mt-2">
                                {showWeather[0]?.type}
                              </h3>
                              <div className="flex items-center justify-center gap-2 mt-2">
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/7794/7794499.png"
                                  alt="Thermometer"
                                  className="h-6 sm:h-8"
                                />
                                <h2 className="text-2xl sm:text-3xl font-extrabold">
                                  {apiData?.main?.temp}°C
                                </h2>
                              </div>
                              <div className="mt-4 rounded-lg bg-gray-900 text-white px-5 py-3 text-sm sm:text-base font-semibold">
                                <p>
                                  <span className="font-extrabold">Wind:</span>{" "}
                                  {apiData?.wind?.speed} M/s
                                </p>
                                <p>
                                  <span className="font-extrabold">Humidity:</span>{" "}
                                  {apiData?.main?.humidity}%
                                </p>
                              </div>
                            </div>

                            {/* Right Side (Forecast cards) */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center">
                              {forecastData.slice(0, 6).map((day, index) => {
                                const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                });
                                return (
                                  <div
                                    key={index}
                                    className="bg-slate-200 w-full lg:w-[120px] h-32 flex flex-col justify-center items-center rounded-lg shadow"
                                  >
                                    <h4 className="text-xs sm:text-sm font-semibold">{date}</h4>
                                    <img
                                      src={
                                        WeatherTypes.find(
                                          (w) => w.type === day.weather[0].main
                                        )?.img || ""
                                      }
                                      alt=""
                                      className="h-10 my-2"
                                    />
                                    <h4 className="text-sm sm:text-base font-medium">
                                      {day.main.temp}°C
                                    </h4>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
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

