// 获取天气数据函数
async function ApiGetWeather(prefix) {
  try {
    // 请求新数据
    const APIresponse = await fetch(`https://api.data.gov.my/weather/forecast?contains=${prefix}@location__location_name`, { method: "GET" });
    if (!APIresponse.ok) {
      throw new Error(`API get Error! StatusCode: ${APIresponse.status}`);
    }
    const data = await APIresponse.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
}

// 刷新选中天气信息
function refreshSelectedInfo(date, min_temp, max_temp, weatherConditions) {
  const container = document.getElementById("selected-info");
  const weatherInfoHTML = `
    <p class="weather-selected-date">${date}</p>
    <div class="weather-temperature-range">
      <span class="weather-min-temperature">${min_temp}°</span>
      <br>
      <span class="weather-max-temperature">${max_temp}°</span>
    </div>
    <h2 class="weather-now-temperature">${Math.ceil((min_temp + max_temp) / 2)}°</h2>
    <p class="weather-conditions">${weatherConditions}</p>
  `;
  container.innerHTML = weatherInfoHTML;
}

// 创建天气按钮
function M_createWeatherBtnAboutWeatherInfo(apiInfo) {
  try {
    const container = document.getElementById('week-info');
    let weatherButtonsHTML = ''; // 批量生成 HTML
    apiInfo.slice(-6).reverse().forEach((item, index) => {
      weatherButtonsHTML += `
        <div class="weather-btn-other-days" id="${index}">
          <p class="weather-btn-date">${formatBtnDate(item.date)}</p>
          <p class="weather-btn-temperature">${Math.ceil((item.min_temp + item.max_temp) / 2)}°</p>
          <img src="${translateForecastToImg(item.summary_forecast)}" alt="Weather Icon">
        </div>`;
    });
    container.innerHTML = weatherButtonsHTML; // 一次性更新 DOM
  } catch (error) {
    console.error("Error creating weather buttons:", error.message);
  }
}

// 按钮点击事件监听
function M_weatherWeekInfoBtnDetection(apiInfo) {
  const weekInfoBtn = document.getElementById("week-info");
  weekInfoBtn.addEventListener('click', (event) => {
    const div = event.target.closest("div");
    if (div && weekInfoBtn.contains(div)) {
      const id = apiInfo.length - 1 - Number(div.getAttribute("id")); // 获取按钮的 id
      refreshSelectedInfo(
        apiInfo[id].date,
        apiInfo[id].min_temp,
        apiInfo[id].max_temp,
        translateForecastToEnglish(apiInfo[id].summary_forecast)
      );
    }
  });
}

// 格式化日期
function formatBtnDate(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以加1
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
}

// 翻译天气条件为英文
function translateForecastToEnglish(malayForecast) {
  const forecastTranslationEnglish = {
    "Berjerebu": "Hazy",
    "Tiada hujan": "Clear",
    "Hujan": "Rain",
    "Hujan di beberapa tempat": "Scattered Rain",
    "Hujan di satu dua tempat": "Isolated Rain",
    "Hujan di satu dua tempat di kawasan pantai": "Isolated Rain (Coastal)",
    "Hujan di satu dua tempat di kawasan pedalaman": "Isolated Rain (Inland)",
    "Ribut petir": "Thunderstorms",
    "Ribut petir di beberapa tempat": "Scattered Thunderstorms",
    "Ribut petir di beberapa tempat di kawasan pedalaman": "Scattered Thunderstorms (Inland)",
    "Ribut petir di satu dua tempat": "Isolated Thunderstorms",
    "Ribut petir di satu dua tempat di kawasan pantai": "Isolated Thunderstorms (Coastal)",
    "Ribut petir di satu dua tempat di kawasan pedalaman": "Isolated Thunderstorms (Inland)"
  };
  return forecastTranslationEnglish[malayForecast] || "Unknown forecast";
}

// 翻译天气条件为图片路径
function translateForecastToImg(malayForecast) {
  const forecastTranslationImg = {
    "Berjerebu": "img/fog.png",
    "Tiada hujan": "img/sun.png",
    "Hujan": "img/rainy.png",
    "Hujan di beberapa tempat": "img/showers.png",
    "Hujan di satu dua tempat": "img/heavy_rain.png",
    "Hujan di satu dua tempat di kawasan pantai": "img/rainy.png",
    "Hujan di satu dua tempat di kawasan pedalaman": "img/heavy-rain.png",
    "Ribut petir": "img/thunderstorm.png",
    "Ribut petir di beberapa tempat": "img/thunderstorm.png",
    "Ribut petir di beberapa tempat di kawasan pedalaman": "img/thunderstorm.png",
    "Ribut petir di satu dua tempat": "img/lightning.png",
    "Ribut petir di satu dua tempat di kawasan pantai": "img/thunderstorm.png",
    "Ribut petir di satu dua tempat di kawasan pedalaman": "img/lightning.png"
  };
  return forecastTranslationImg[malayForecast] || "/img/warning.png";
}

//////////
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/Summer-s-eye-website/service_worker.js',{scope: '/Summer-s-eye-website/'})
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
      console.log('Service Worker registration failed:', error);
    });
}
// 主流程：页面加载时初始化
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const apiInfo = await ApiGetWeather("Kluang");

    if (apiInfo && apiInfo.length > 0) {
      const latestWeather = apiInfo[apiInfo.length - 1];
      refreshSelectedInfo(
        latestWeather.date,
        latestWeather.min_temp,
        latestWeather.max_temp,
        translateForecastToEnglish(latestWeather.summary_forecast)
      );

      M_createWeatherBtnAboutWeatherInfo(apiInfo);
      M_weatherWeekInfoBtnDetection(apiInfo);
    } else {
      console.warn("No weather data available.");
    }
  } catch (error) {
    console.error("Error initializing weather info:", error.message);
  }
});


