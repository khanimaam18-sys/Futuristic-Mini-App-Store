// ---------------- DOM Elements ----------------
const carouselCards = document.querySelectorAll(".carousel-card");
const apps = document.querySelectorAll(".app-container");
const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const homeLink = document.getElementById("home-link");
const aboutLink = document.getElementById("about-link");
const contactLink = document.getElementById("contact-link");
const content = document.querySelector(".content");
const aboutSection = document.getElementById("about");
const contactSection = document.getElementById("contact");
const loadingPortal = document.getElementById("loading-portal");

// ---------------- Particles ----------------
particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    color: { value: "#0ff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: { enable: true, distance: 120, color: "#0ff" },
    move: { enable: true, speed: 2 }
  }
});

// ---------------- Helper Functions ----------------
function openApp(appId) {
  loadingPortal.style.display = "flex";
  setTimeout(() => {
    loadingPortal.style.display = "none";
    apps.forEach(a => a.style.display = "none");
    document.getElementById(appId).style.display = "flex";
    content.style.display = "none";
    aboutSection.style.display = "none";
    contactSection.style.display = "none";
  }, 1200);
}

function closeApp() {
  apps.forEach(a => a.style.display = "none");
  content.style.display = "block";
}

// ---------------- Carousel ----------------
let angle = 0;

function updateCarousel() {
  const total = carouselCards.length;
  const radius = 60;
  let frontCardIndex = 0;

  carouselCards.forEach((card, i) => {
    const cardAngle = (360 / total) * i + angle;
    const rad = cardAngle * (Math.PI / 180);
    const x = radius * Math.sin(rad);
    const z = radius * Math.cos(rad);
    const scale = (z + radius) / (2 * radius) * 0.5 + 0.5;
    card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
    card.style.opacity = scale;
    card.style.zIndex = Math.floor(scale * 100);

    if (scale === Math.max(...Array.from(carouselCards).map(c => {
      const cz = parseFloat(c.style.transform.split('translateZ(')[1]) || 0;
      return ((cz + radius) / (2 * radius) * 0.5 + 0.5);
    }))) frontCardIndex = i;
  });

  carouselCards.forEach((card, i) => {
    if (i === frontCardIndex) {
      card.style.boxShadow = `
        0 0 30px #0ff,
        0 0 60px #0ff,
        0 0 100px rgba(63, 94, 251, 0.7),
        0 0 150px rgba(252, 70, 107, 0.5),
        0 0 200px rgba(0,255,255,0.4) inset`;
    } else {
      card.style.boxShadow = `
        0 0 15px #0ff,
        0 0 30px #0ff,
        0 0 50px #0ff inset,
        0 0 80px rgba(63, 94, 251, 0.5),
        0 0 100px rgba(252, 70, 107, 0.3)`;
    }
  });
}

carouselCards.forEach(card => {
  card.addEventListener("click", () => openApp(card.dataset.app));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") angle += 30;
  if (e.key === "ArrowLeft") angle -= 30;
  updateCarousel();
});

setInterval(() => { angle += 0.5; updateCarousel(); }, 30);
updateCarousel();

// ---------------- Sidebar ----------------
menuBtn.addEventListener("click", () => sidebar.classList.toggle("active"));
document.addEventListener("click", e => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) sidebar.classList.remove("active");
});

// ---------------- Search ----------------
const appsList = ["Calculator", "To-Do", "Notes", "Weather", "Music"];
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML = "";
  if (query) {
    appsList.forEach(app => {
      if (app.toLowerCase().includes(query)) {
        const div = document.createElement("div");
        div.textContent = app;
        div.onclick = () => {
          document.querySelector(`.carousel-card[data-app="${app.replace(/\s/g,'')}App"]`).click();
          searchResults.style.display = "none";
          searchInput.value = "";
        };
        searchResults.appendChild(div);
      }
    });
    searchResults.style.display = "block";
  } else searchResults.style.display = "none";
});
document.addEventListener("click", e => { if (!searchInput.contains(e.target)) searchResults.style.display = "none"; });

// ---------------- Navigation ----------------
homeLink.addEventListener("click", () => { apps.forEach(a => a.style.display = "none"); content.style.display="block"; aboutSection.style.display="none"; contactSection.style.display="none"; });
aboutLink.addEventListener("click", () => { apps.forEach(a => a.style.display = "none"); content.style.display="none"; aboutSection.style.display="block"; contactSection.style.display="none"; });
contactLink.addEventListener("click", () => { apps.forEach(a => a.style.display = "none"); content.style.display="none"; aboutSection.style.display="none"; contactSection.style.display="block"; });

// ---------------- Clock ----------------
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2,"0");
  const minutes = String(now.getMinutes()).padStart(2,"0");
  const seconds = String(now.getSeconds()).padStart(2,"0");
  document.getElementById("current-time").textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateTime,1000); updateTime();

// ---------------- Calculator ----------------
const calcDisplay = document.getElementById("calc-display");
document.querySelectorAll(".calc-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    if(btn.textContent==="C") calcDisplay.value="";
    else if(btn.textContent==="="){
      try{calcDisplay.value = eval(calcDisplay.value);}
      catch{calcDisplay.value="Error";}
    } else calcDisplay.value+=btn.textContent;
  });
});

// ---------------- To-Do ----------------
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
document.getElementById("add-task").addEventListener("click", () => {
  const val = todoInput.value.trim();
  if(val){ const li=document.createElement("li"); li.textContent=val; todoList.appendChild(li); todoInput.value=""; saveTasks(); }
});
function saveTasks(){ const tasks=[]; todoList.querySelectorAll("li").forEach(li=>tasks.push(li.textContent)); localStorage.setItem("tasks",JSON.stringify(tasks)); }
window.addEventListener("load", ()=>{ JSON.parse(localStorage.getItem("tasks")||"[]").forEach(t=>{ const li=document.createElement("li"); li.textContent=t; todoList.appendChild(li); }); });

// ---------------- Notes ----------------
const notesText = document.getElementById("notes-text");
document.getElementById("save-notes").addEventListener("click", () => { localStorage.setItem("notes", notesText.value); alert("Notes saved!"); });
document.getElementById("clear-notes").addEventListener("click", () => { notesText.value=""; localStorage.removeItem("notes"); });
window.addEventListener("load", ()=>{ if(localStorage.getItem("notes")) notesText.value=localStorage.getItem("notes"); });

// ---------------- Weather ----------------
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");
const API_KEY = "d2ee90b40189a7898d08bb277cf56693";

searchBtn.addEventListener("click", () => getWeather(cityInput.value));
cityInput.addEventListener("keypress", e => { if(e.key==="Enter") searchBtn.click(); });

async function getWeather(city){
  if(!city) return;
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await res.json();
    if(data.cod===200){
      weatherInfo.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>🌡 Temp: ${data.main.temp} °C</p>
        <p>🌥 Condition: ${data.weather[0].main}</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>`;
    } else weatherInfo.innerHTML="<p>City not found!</p>";
  } catch { weatherInfo.innerHTML="<p>Error fetching weather</p>"; }
}

// ---------------- Music Player ----------------
const audio = document.getElementById("music-audio");
const tracks = ["n1.mp3","n3.mp3","n2.mp3"];
let currentTrack=0;
audio.src = tracks[currentTrack];
document.getElementById("play-btn").addEventListener("click", ()=>audio.paused?audio.play():audio.pause());
document.getElementById("next-btn").addEventListener("click", ()=>{ currentTrack=(currentTrack+1)%tracks.length; audio.src=tracks[currentTrack]; audio.play(); });
document.getElementById("prev-btn").addEventListener("click", ()=>{ currentTrack=(currentTrack-1+tracks.length)%tracks.length; audio.src=tracks[currentTrack]; audio.play(); });
document.getElementById("file-selector").addEventListener("change", e => {
  const file=e.target.files[0]; if(file){ audio.src=URL.createObjectURL(file); audio.play(); }
});

// ---------------- AI Orb ----------------
const aiOrb = document.getElementById("ai-orb");
const aiChat = document.getElementById("ai-chat");
const aiMessage = document.getElementById("ai-message");
const aiYes = document.getElementById("ai-yes");
const aiNo = document.getElementById("ai-no");
const appsArray = ["calculatorApp","todoApp","notesApp","weatherApp","musicApp"];
const messages = ["⚡ How about trying something new?","🚀 Feeling adventurous? I can open an app for you!","🌌 Let’s explore the futuristic world!"];

aiOrb.addEventListener("click", () => {
  aiChat.style.display = aiChat.style.display==="flex"?"none":"flex";
  aiMessage.textContent = messages[Math.floor(Math.random()*messages.length)];
});
aiYes.addEventListener("click", ()=>{ openApp(appsArray[Math.floor(Math.random()*appsArray.length)]); aiChat.style.display="none"; });
aiNo.addEventListener("click", ()=>{ aiChat.style.display="none"; });
