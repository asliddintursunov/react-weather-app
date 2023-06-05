import { useCallback, useState } from 'react';

import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [city, setCity] = useState({})
  const [temp, setTemp] = useState()
  const [weatherSort, setWeatherSort] = useState()
  const [country, setCountry] = useState()
  const [max, setMax] = useState()
  const [min, setMin] = useState()
  const [feelsLike, setFeelsLike] = useState()
  const [humidity, setHumidity] = useState()
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [showInfo, setShowInfo] = useState()

  const styleColumn = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
  const infoContainer = {
    display: isPending ? 'none' : 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
  const errorMessage = {
    display: isPending ? 'none' : 'flex',
  }
  const styleRow = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }

  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${url}&appid=cfb1dc599e12470d8f38ea55ae9f28d8`


  const fetchAPI = useCallback(
    async () => {
      setIsPending(true)
      const req = await fetch(URL)
      setShowInfo(req.ok)
      try {
        if (req.ok === false) {
          throw new Error(req.statusText)

        }
        const data = await req.json()
        setCity(data)
        setTemp(Math.ceil((data.main.temp)))
        setWeatherSort(data.weather[0].main)
        setCountry(data.sys.country)
        setMax(Math.ceil((data.main.temp_max)))
        setMin(Math.ceil((data.main.temp_min)))
        setFeelsLike(Math.ceil((data.main.feels_like)))
        setHumidity(Math.ceil((data.main.humidity)))

        console.log(data);

        setIsPending(false)
      } catch (error) {
        setError(error.message)
        setIsPending(false)
      }
    }, [URL])

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <div className='app justify-center'>
      <div style={styleColumn} className='container'>
        <h1>Weather in</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" onInput={(e) => setUrl((e.target.value).trim())} />
          <button onClick={() => fetchAPI()}>Submit</button>
        </form>
        {isPending && <h2>Loading...</h2>}
        {showInfo ?
          <div style={infoContainer} className='info-container justify-center'>
            <div style={styleRow} className='place justify-space-betweens'>
              <p>{city.name}</p>
              <h3>{country}</h3>
            </div>
            <div style={styleRow} className='basic-info justify-space-between'>
              <div className='degree'>
                <h1>{temp ? temp - 273 : 'Temp'}°C</h1>
              </div>
              <div style={styleColumn} className='sort-max-min justify-space-between'>
                <div className='sort'>
                  <h3>{weatherSort}</h3>
                </div>
                <div style={styleColumn} className='max-min justify-center'>
                  <p>Max: {max - 273}°C</p>
                  <p>Min: {min - 273}°C</p>
                </div>
              </div>
            </div>
            <div style={styleRow} className='feels-humidity justify-space-between'>
              <div className='feels'>
                <h1>{feelsLike - 273}°C</h1>
                <i>Feels Like</i>
              </div>
              <div className='humidity'>
                <h1>{humidity}%</h1>
                <i>humidity</i>
              </div>
            </div>
          </div> : <h2 style={errorMessage}>{error}</h2>}
      </div>
    </div>
  )
}

export default App
