let userTab = document.getElementById("user-weather");
let searchTab = document.getElementById("search-weather");
let searchForm = document.querySelector(".search-container");
let searchInput = document.getElementById("search-input");
let searchdata = document.getElementById("submit-btn");
let loadingScreen = document.querySelector(".loading-container");
let grantAccessContainer = document.querySelector(".grant-location-container");
let userInfoContainer = document.querySelector(".user-info-container");

//initially vairables need
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let oldTab = userTab;
oldTab.classList.add("current-tab");
getfromSessionStorage()


function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab
        oldTab.classList.add("current-tab");
    };

    if (newTab == searchTab) {
        console.log("yes i am searchtab");
        searchForm.classList.add("active");
        grantAccessContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
    }
    else {
        console.log("no i am usertab");
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage()
    }
};

function renderWeatherInfo(weatherInfo) {
    let cityName = document.getElementById("data-cityName");
    let countryIcon = document.getElementById("data-countryIcon");
    let desc = document.getElementById("data-weatherDesc");
    let weatherIcon = document.getElementById("data-weatherIcon");
    let temp = document.getElementById("data-temp");
    let windspeed = document.getElementById("data-windspeed");
    let humidity = document.getElementById("data-humidity");
    let cloudiness = document.getElementById("data-cloudiness");

    cityName.textContent = weatherInfo.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo.sys.country.toLowerCase()}.png`;
    desc.textContent = weatherInfo.weather[0].description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`;
    temp.textContent = `${weatherInfo.main.temp} °C`;
    windspeed.textContent = `${weatherInfo.wind.speed}  m/s`;
    humidity.textContent = `${weatherInfo.main.humidity}%`;
    cloudiness.textContent = `${weatherInfo.clouds.all}%`
}

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        if (data.message == "city not found") {
            userInfoContainer.classList.remove("active");
            alert(data.message);
        }
        renderWeatherInfo(data);
    } catch (error) {
        console.log(error);
    }
}

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

async function fetchUserWeatherInfo(cordinates) {
    const { lat, lon } = cordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {

    }
};

grantAccessContainer.addEventListener("click", getLocation)

userTab.addEventListener("click", () => {
    switchTab(userTab)
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab)
})

searchdata.addEventListener("click", () => {
    let cityName = searchInput.value;
    if (cityName == " ") {
        alert("please Inter The CityName")
        // return
    } else {
        console.log("else condition");
        fetchSearchWeatherInfo(cityName);
    }
})