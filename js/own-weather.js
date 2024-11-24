async function ApiGetWeather(prefix){
  try{
    const APIresponse = await fetch(`https://api.data.gov.my/weather/forecast?contains=${prefix}@location__location_name`,{method:"GET"});
    if (!APIresponse.ok) {
      throw new Error("API get Error! StatusCode:${APIresponse.status}");
    }
    const data = await APIresponse.json();
    return data;
  }catch (error) {
    // 捕获错误并打印到控制台
    console.error("Error fetching weather data:", error.message);
    throw error; // 如果需要，可以让调用者处理错误
  }
}
function refreshSelectedInfo(date,min_temp,max_temp,weatherConditions){
  const container = document.getElementById("selected-info");
  const weatherInfoHTML = `
    <p class="weather-selected-date">${date}</p>
    <div class="weather-temperature-range">
      <span class="weather-min-temperature">${min_temp}°</span>
      <br>
      <span class="weather-max-temperature">${max_temp}°</span>
    </div>
    <h2 class="weather-now-temperature">${Math.ceil((min_temp+max_temp)/2)}°</h2>
    <p class="weather-conditions">${weatherConditions}</p>
  `
  container.innerHTML = weatherInfoHTML;
}
function M_weatherWeekInfoBtnDetection(apiInfo){
  const weekInfoBtn = document.getElementById("week-info");
  weekInfoBtn.addEventListener('click',(event)=>{
    const div = event.target.closest("div");
    // 确保找到的元素是 weekInfoBtn 的子元素
    if (div && weekInfoBtn.contains(div)) {
      const id = apiInfo.length - 1 - Number(div.getAttribute("id")); // 获取按钮的 id
      refreshSelectedInfo(apiInfo[id].date,apiInfo[id].min_temp,apiInfo[id].max_temp,translateForecastToEnglish(apiInfo[id].summary_forecast));
      // console.log(id);
    }
  });
}
function createWeatherBtnOtherDays(date,tempurature,summaryForecastImg,indexNum){
  const container = document.getElementById('week-info');
  const weatherInfoHTML = `
    <div class="weather-btn-other-days" id="${indexNum}">
      <p class="weather-btn-date">${date}</p>
      <p class="weather-btn-temperature">${tempurature}°</p>
      <img src=${translateForecastToImg(summaryForecastImg)} alt="Weather Icon">
    </div>`;
  container.innerHTML += weatherInfoHTML;
}
function formatBtnDate(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以加1
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
}
function translateForecastToEnglish(malayForecast) {
  const forecastTranslationEnglish = {
    "Berjerebu": "Hazy", // Hazy
    "Tiada hujan": "Clear", // No rain
    "Hujan": "Rain", // Rain
    "Hujan di beberapa tempat": "Scattered Rain", // Scattered rain
    "Hujan di satu dua tempat": "Isolated Rain", // Isolated rain
    "Hujan di satu dua tempat di kawasan pantai": "Isolated Rain (Coastal)", // Isolated rain (coastal)
    "Hujan di satu dua tempat di kawasan pedalaman": "Isolated Rain (Inland)", // Isolated rain (inland)
    "Ribut petir": "Thunderstorms", // Thunderstorms
    "Ribut petir di beberapa tempat": "Scattered Thunderstorms", // Scattered thunderstorms
    "Ribut petir di beberapa tempat di kawasan pedalaman": "Scattered Thunderstorms (Inland)", // Scattered thunderstorms (inland)
    "Ribut petir di satu dua tempat": "Isolated Thunderstorms", // Isolated thunderstorms
    "Ribut petir di satu dua tempat di kawasan pantai": "Isolated Thunderstorms (Coastal)", // Isolated thunderstorms (coastal)
    "Ribut petir di satu dua tempat di kawasan pedalaman": "Isolated Thunderstorms (Inland)" // Isolated thunderstorms (inland)
  };
  
  return forecastTranslationEnglish[malayForecast] || "Unknown forecast";
}
function translateForecastToImg(malayForecast){
  const forecastTranslationImg = {
    "Berjerebu": "img/fog.png", // Hazy
    "Tiada hujan": "img/sun.png", // No rain
    "Hujan": "img/rainy.png", // Rain
    "Hujan di beberapa tempat": "img/showers.png", // Scattered rain
    "Hujan di satu dua tempat": "img/heavy-rain.png", // Isolated rain
    "Hujan di satu dua tempat di kawasan pantai": "img/rainy.png", // Isolated rain (coastal)
    "Hujan di satu dua tempat di kawasan pedalaman": "img/heavy-rain.png", // Isolated rain (inland)
    "Ribut petir": "img/thunderstorm.png", // Thunderstorms
    "Ribut petir di beberapa tempat": "img/thunderstorm.png", // Scattered thunderstorms
    "Ribut petir di beberapa tempat di kawasan pedalaman": "img/thunderstorm.png", // Scattered thunderstorms (inland)
    "Ribut petir di satu dua tempat": "img/lightning.png", // Isolated thunderstorms
    "Ribut petir di satu dua tempat di kawasan pantai": "img/thunderstorm.png", // Isolated thunderstorms (coastal)
    "Ribut petir di satu dua tempat di kawasan pedalaman": "img/lightning.png" // Isolated thunderstorms (inland)
  };
  return forecastTranslationImg[malayForecast] || "/img/warning.png";
}

function M_createWeatherBtnAboutWeatherInfo(apiInfo){
  try {
    // 遍历数据并生成按钮
    const funcApiInfo = apiInfo;
    funcApiInfo.slice(-6).reverse().forEach((item,index) => {
      createWeatherBtnOtherDays(formatBtnDate(item.date), Math.ceil((item.min_temp+item.max_temp)/2), item.summary_forecast,index);
    });
  } catch (error) {
    console.error("Error creating weather buttons:", error.message);
  }
}

async function main(){
  const apiInfo = await ApiGetWeather("Kluang");
  M_createWeatherBtnAboutWeatherInfo(apiInfo);
  M_weatherWeekInfoBtnDetection(apiInfo);

}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 调用天气 API 获取数据
    const apiInfo = await ApiGetWeather("Kluang");
    
    refreshSelectedInfo(apiInfo[apiInfo.length].date,apiInfo[apiInfo.length].min_temp,apiInfo[apiInfo.length].max_temp,translateForecastToEnglish(apiInfo[apiInfo.length].summary_forecast));
  }catch (error) {
    console.error("Error initializing weather info:", error.message);
  }
});
main();