import logo from './logo.svg';
import './App.css';
const { ethers } = require("ethers");

function App() {
  async function getPrice() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const daiAddress = "0xb3DF0a9582361db08EC100bd5d8CB70fa8579f4B";
    const daiAbi = [
      "function latestAnswer() view returns (int)"
    ];
    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider)
    const data = await daiContract.latestAnswer()
    document.getElementById('price').innerHTML='newest price is :'+ data.toBigInt();
  }
  // getPrice();1658226136000

  let batchId = Number(Date.parse(new Date().toString()))/1000;
  const reportWeather = async (cityName) => {
    let response = await fetch("https://goweather.herokuapp.com/weather/"+cityName);
    const temperatureData = await response.json()
    let temperature = Number(temperatureData.temperature.replace("+","").replace(" °C",""));
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const daiAddress = "0x49354813d8BFCa86f778DfF4120ad80E4D96D74E";
    const daiAbi = [
      "function reportWeather(uint32 batchId, bytes32 cityName, uint32 temperature) external"
    ];
    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider)
    const daiWithSigner = daiContract.connect(signer);
    const tx = daiWithSigner.reportWeather(batchId,ethers.utils.formatBytes32String(cityName),temperature)
    document.getElementById('reportWeather').innerHTML=cityName+' weather report, batchId:'+ batchId+',temperature:'+temperature;
  }
  function reportShanghaiWeather(){
    reportWeather("shanghai");
  }
  function reportHongkongWeather(){
    reportWeather("hongkong");
  }
  function reportLondonWeather(){
    reportWeather("london");
  }
  // reportWeather("shanghai");
  async function getWeather(cityName) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const daiAddress = "0x49354813d8BFCa86f778DfF4120ad80E4D96D74E";
    const daiAbi = [
      "function getWeather(uint32 batchId, bytes32 cityName) public view returns (uint32)"
    ];
    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider)
    const data = await daiContract.getWeather(batchId,ethers.utils.formatBytes32String(cityName))
    console.log(data)
    document.getElementById('getWeather').innerHTML=cityName+' weather get, batchId:'+ batchId+',temperature:'+data;
  }
  function getShanghaiWeather(){
    getWeather("shanghai");
  }
  function getHongkongWeather(){
    getWeather("hongkong");
  }
  function getLondonWeather(){
    getWeather("london");
  }
  // getWeather("shanghai");
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Assignment 1</h1>
          <em>MetaMask switch to Cronos Mainnet and testing</em><br/>
          <button className="button" onClick={getPrice}>get newest price</button>
          <div id="price"></div>
        </div>
        <div>
        <h1>Assignment 2</h1>
          <em>MetaMask switch to Cronos Testnet and testing</em><br/>
          <div className="weather">
            <div className="item-title">
              <span>report weather: </span>
            </div>
            <div className="item">
              <button className="button" onClick={reportShanghaiWeather}>shanghai</button>
            </div>
            <div className="item">
              <button className="button" onClick={reportHongkongWeather}>hongkong</button>
            </div>
            <div className="item">
              <button className="button" onClick={reportLondonWeather}>london</button>
            </div>
            <div id="reportWeather"></div>
          </div>
          <div className="weather">
            <div className="item-title">
              <span>get weather: </span>
            </div>
            <div className="item">
              <button className="button" onClick={getShanghaiWeather}>shanghai</button>
            </div>
            <div className="item">
              <button className="button" onClick={getHongkongWeather}>hongkang</button>
            </div>
            <div className="item">
              <button className="button" onClick={getLondonWeather}>london</button>
            </div>
            <div id="getWeather"></div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
