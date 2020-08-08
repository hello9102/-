const city = document.querySelector(".city");
const historied = document.querySelector(".historied");
let historyList = getItem("historyList") || [];
historied.innerHTML = `${historyList}`;
let cityName;
let id = 101010100;
city.innerText = "北京"
//搜索城市
function searchContent() {
    const searchTxt = document.querySelector(".search_txt");
    if(searchTxt.value != '') {
        const cityUrl = `https://geoapi.heweather.net/v2/city/lookup?location=${searchTxt.value}&mode=fuzzy&key=b1eac8ade8b749bfb154b194a06964a4`;
        todayWeather(cityUrl);
        futureWeather(cityUrl);
        lifeStyle(cityUrl);
        searchTxt.value = "";
    }else {
        return alert("请输入城市");
    }
}
//输入框回车监听搜索
function enterSearch() {
    var event = window.event || arguments.callee.caller.arguments[0];
    if (event.keyCode == 13) {
        //搜索的方法
        searchContent();
    }
}
//历史记录
function historyItem() {
    //获取搜索时间并且修改格式
    const historyTime =  new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    historyList.push(`<div class="history-item" data-indexs="index">
                <span class="history-time">${historyTime}</span>
                <span class="history-city">${cityName}</span>
                </div>`);
    setItem("historyList",historyList);
    historied.innerHTML = `${historyList}`;
}
//是否打开历史记录
function isOpen() {
    const history = document.querySelector(".history");
    history.style.height = history.style.height=="0.5rem" ? "1.5rem" : "0.5rem";
}
//关闭生活指数弹窗
function fanhui() {
    lifeStyleTc.innerHTML = "";
    lifeStyleTc.style.display = "none";
}
//localstorage
//存数据
function setItem(key,value) {
    localStorage.setItem(key,JSON.stringify(value));
}
//取
function getItem(key) {
    return JSON.parse(localStorage.getItem(key));
}
//删除
function removeItem() {
    localStorage.removeItem("historyList");
    historyList = [];
    historied.innerHTML = '';
}
//天气实况
let todayWeatherUrl = `https://devapi.heweather.net/v7/weather/now?location=${id}&key=b1eac8ade8b749bfb154b194a06964a4`;
async function todayWeather(url) {
    try{
        //获取Dom节点
        let time = document.querySelector('.time');
        let text = document.querySelector('.text');
        let tmp = document.querySelector('.tmp');
        let fl = document.querySelector('.fl');
        let todayImg = document.querySelector('.todayImg');
        //发送请求，获取和风天气数据
        let res = await axios.get(url);
        if(res.data.status == 404 || res.data.status == 400) {
            alert("请输入正确的城市");
        }else if(url != todayWeatherUrl) {
            id = res.data.location[0].id;
            cityName = res.data.location[0].name;
            city.innerText = `${cityName}`;
            todayWeatherUrl = `https://devapi.heweather.net/v7/weather/now?location=${id}&key=b1eac8ade8b749bfb154b194a06964a4`;
            historyItem();
        }
        res = await axios.get(todayWeatherUrl);
        //对响应回来的时间进行转换
        let getTime = res.data.updateTime;
        today = getTime.split('T')[0] + ' ' + getTime.split('T')[1].split('+')[0];
        //把响应回来的数据插入到页面中
        time.innerText = today;
        text.innerText = res.data.now.text;
        tmp.innerText = `温度：${res.data.now.temp}℃`;
        fl.innerText = `体感温度:${res.data.now.feelsLike}℃`;
        todayImg.src = `https://cdn.heweather.com/cond_icon/${res.data.now.icon}.png`;
    }catch(err) {
        console.log(err,'实况天气请求失败');
    }
}
//未来三天预报
let futureWeatherUrl = `https://devapi.heweather.net/v7/weather/3d?location=${id}&key=b1eac8ade8b749bfb154b194a06964a4`;
async function futureWeather(url) {
    try {
        //获取Dom节点
        const futureIcon = document.querySelectorAll('.futureIcon');
        const txt = document.querySelectorAll('.txt');
        const max = document.querySelectorAll('.max');
        const min = document.querySelectorAll('.min');
        //发送请求，获取和风天气数据
        let res = await axios.get(url);
        if(res.data.status == 404 || res.data.status == 400) {
            return;
        }else if(url != futureWeatherUrl) {
            id = res.data.location[0].id;
            futureWeatherUrl = `https://devapi.heweather.net/v7/weather/3d?location=${id}&key=b1eac8ade8b749bfb154b194a06964a4`;
        }
        res = await axios.get(futureWeatherUrl);
        //天气icon
        futureIcon[0].src = `https://cdn.heweather.com/cond_icon/${res.data.daily[0].iconDay}.png`;
        futureIcon[1].src = `https://cdn.heweather.com/cond_icon/${res.data.daily[1].iconDay}.png`;
        futureIcon[2].src = `https://cdn.heweather.com/cond_icon/${res.data.daily[2].iconDay}.png`;
        //天气情况
        txt[0].innerText = res.data.daily[0].textDay===res.data.daily[0].textNight ? `${res.data.daily[0].textDay}` : `${res.data.daily[0].textDay}转${res.data.daily[0].textNight}`;
        txt[1].innerText = res.data.daily[1].textDay===res.data.daily[1].textNight ? `${res.data.daily[1].textDay}` : `${res.data.daily[1].textDay}转${res.data.daily[1].textNight}`;
        txt[2].innerText = res.data.daily[2].textDay===res.data.daily[2].textNight? `${res.data.daily[2].textDay}` : `${res.data.daily[2].textDay}转${res.data.daily[2].textNight}`;
        //最高温度与最低温度
        max[0].innerText = `${res.data.daily[0].tempMax}°/`;
        max[1].innerText = `${res.data.daily[1].tempMax}°/`;
        max[2].innerText = `${res.data.daily[2].tempMax}°/`;
        min[0].innerText = `${res.data.daily[0].tempMin}°`;
        min[1].innerText = `${res.data.daily[1].tempMin}°`;
        min[2].innerText = `${res.data.daily[2].tempMin}°`;
    }catch(err) {
        console.log(err,'未来天气请求出错！');
    }
}
//生活指数
let lifeStylUrl = `https://free-api.heweather.net/s6/weather/lifestyle?location=${id}&key=b1eac8ade8b749bfb154b194a06964a4`;
const lifeStyleItem = document.querySelectorAll('.lifestyle-item');
const lifeStyleTc = document.querySelector(".lifestyle-tc");
async function lifeStyle(url) {
    try { 
        //发送请求，获取和风天气数据
        let res = await axios.get(url);
        if(res.data.status == 404 || res.data.status == 400) {
            return;
        }else if(url != lifeStylUrl) {
            id = res.data.location[0].id;
            lifeStylUrl = `https://free-api.heweather.net/s6/weather/lifestyle?location=${id}&key=b1eac8ade8b749bfb154b194a06964a4`;
        }
        res = await axios.get(lifeStylUrl);
        //lifeStyleItem是个伪数组，无法使用数组的方法，需要调用下面这个操作遍历
        Array.prototype.forEach.call(lifeStyleItem,(item,index) => {
            item.onclick = () => {
                lifeStyleTc.innerHTML += `<img class="fanhui" onclick="fanhui()" src="./images/back.png" alt="返回">
                    <h2>${item.dataset.indexs}指数</h2>
                    <span>${res.data.HeWeather6[0].lifestyle[index].brf}</span>
                    <p>“${res.data.HeWeather6[0].lifestyle[index].txt}”</p>`;
                lifeStyleTc.style.display = "block";
            }
        });
    }catch(err) {
        console.log(err,"生活指数请求失败");
    }
}

todayWeather(todayWeatherUrl);
futureWeather(futureWeatherUrl);
lifeStyle(lifeStylUrl);