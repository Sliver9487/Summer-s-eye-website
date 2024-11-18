async function ApiGetWeather(prefix){
  try{
    const APIresponse = await fetch(`https://api.data.gov.my/weather/forecast?contains=${prefix}@location__location_name`,{method:"GET"});
    if (!APIresponse.ok) {
      throw new Error("API get Error! StatusCode:${APIresponse.status}");
    }

    const data = await APIresponse.json();
    return data[0];
  }catch (error) {
    // 捕获错误并打印到控制台
    console.error("Error fetching weather data:", error.message);
    throw error; // 如果需要，可以让调用者处理错误
  }
}

// function addPLabel(targetLabelId,LabelType){//String String
//   const targetDiv = document.getElementById(targetLabelId);
//   const Label = document.createElement(LabelType);
//   Label.textContent = '动态插入字段！！';
//   targetDiv.appendChild(Label);
// }

// const div = document.getElementsByClassName('weather-week-info');
// const testBtn = document.getElementById('test');

// testBtn.addEventListener('click',()=>{
//   addPLabel("week-info",'p');
// });
console.log(ApiGetWeather("Kluang"));