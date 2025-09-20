// ---------------- DOM ----------------
const cards = document.querySelectorAll(".card");
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

// ---------------- Particles ----------------
particlesJS("particles-js", {
  particles: { number:{ value:80 }, color:{value:"#0ff"}, shape:{type:"circle"}, opacity:{value:0.5}, size:{value:3}, line_linked:{enable:true, distance:120, color:"#0ff"}, move:{enable:true,speed:2} }
});

// ---------------- Open App ----------------
cards.forEach(card=>{
  card.addEventListener("click",()=>{
    const appId = card.dataset.app;
    apps.forEach(a=>a.style.display="none");
    document.getElementById(appId).style.display="flex";
    content.style.display="none";
  });
});

// ---------------- Close App ----------------
function closeApp(){
  apps.forEach(a=>a.style.display="none");
  content.style.display="block";
}

// ---------------- Sidebar ----------------
menuBtn.addEventListener("click", ()=> sidebar.classList.toggle("active"));

// ---------------- Search ----------------
const appsList = ["Calculator","To-Do","Notes","Weather","Music"];
searchInput.addEventListener("input", ()=>{
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML="";
  if(query){
    appsList.forEach(app=>{
      if(app.toLowerCase().includes(query)){
        const div=document.createElement("div");
        div.textContent=app;
        div.onclick=()=> {
          document.querySelector(`.card[data-app="${app.replace(/\s/g,'')}App"]`).click();
          searchResults.style.display="none";
        };
        searchResults.appendChild(div);
      }
    });
    searchResults.style.display="block";
  } else searchResults.style.display="none";
});

// Close search on click outside
document.addEventListener("click", e=>{
  if(!searchInput.contains(e.target)) searchResults.style.display="none";
});

// ---------------- Home / About / Contact ----------------
homeLink.addEventListener("click", ()=>{
  apps.forEach(a=>a.style.display="none");
  content.style.display="block";
  aboutSection.style.display="none";
  contactSection.style.display="none";
});
aboutLink.addEventListener("click", ()=>{
  apps.forEach(a=>a.style.display="none");
  content.style.display="none";
  aboutSection.style.display="block";
  contactSection.style.display="none";
});
contactLink.addEventListener("click", ()=>{
  apps.forEach(a=>a.style.display="none");
  content.style.display="none";
  aboutSection.style.display="none";
  contactSection.style.display="block";
});

// ---------------- Calculator Logic ----------------
const calcDisplay = document.getElementById("calc-display");
const calcButtons = document.querySelectorAll(".calc-buttons button");
calcButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    if(btn.textContent==="C"){ calcDisplay.value=""; return; }
    if(btn.textContent==="="){
      try{ calcDisplay.value=eval(calcDisplay.value); }catch{ calcDisplay.value="Error"; }
      return;
    }
    calcDisplay.value+=btn.textContent;
  });
});

// ---------------- To-Do Logic ----------------
const todoInput = document.getElementById("todo-input");
const addTaskBtn = document.getElementById("add-task");
const todoList = document.getElementById("todo-list");
addTaskBtn.addEventListener("click", ()=>{
  const val = todoInput.value.trim();
  if(val){
    const li=document.createElement("li"); li.textContent=val; todoList.appendChild(li); todoInput.value="";
  }
});

// ---------------- Notes Logic ----------------
const notesText = document.getElementById("notes-text");
const saveNotesBtn = document.getElementById("save-notes");
const clearNotesBtn = document.getElementById("clear-notes");

saveNotesBtn.addEventListener("click", ()=>{
  localStorage.setItem("notes", notesText.value);
  alert("Notes saved!");
});
clearNotesBtn.addEventListener("click", ()=>{
  notesText.value="";
  localStorage.removeItem("notes");
});

// ---------------- Weather Logic ----------------
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");
const API_KEY="d2ee90b40189a7898d08bb277cf56693";

searchBtn.addEventListener("click", ()=> getWeather(cityInput.value));
cityInput.addEventListener("keypress", e=>{ if(e.key==="Enter") searchBtn.click(); });

async function getWeather(city){
  if(!city) return;
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await res.json();
    if(data.cod===200){
      weatherInfo.innerHTML=`<h3>${data.name}, ${data.sys.country}</h3>
      <p>🌡 Temp: ${data.main.temp} °C</p>
      <p>🌥 Condition: ${data.weather[0].main}</p>
      <p>💨 Wind: ${data.wind.speed} m/s</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>`;
    } else weatherInfo.innerHTML="<p>City not found!</p>";
  }catch{ weatherInfo.innerHTML="<p>Error fetching weather</p>"; }
}

// ---------------- Music Logic ----------------
const audio = document.getElementById("music-audio");
const playBtn = document.getElementById("play-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const fileSelector = document.getElementById("file-selector");
const tracks = ["n1.mp3","n3.mp3","n2.mp3"];
let currentTrack = 0;
audio.src=tracks[currentTrack];

playBtn.addEventListener("click", ()=> audio.paused?audio.play():audio.pause());
nextBtn.addEventListener("click", ()=>{
  currentTrack=(currentTrack+1)%tracks.length;
  audio.src=tracks[currentTrack]; audio.play();
});
prevBtn.addEventListener("click", ()=>{
  currentTrack=(currentTrack-1+tracks.length)%tracks.length;
  audio.src=tracks[currentTrack]; audio.play();
});
fileSelector.addEventListener("change", e=>{
  const file=e.target.files[0];
  if(file){ audio.src=URL.createObjectURL(file); audio.play(); }
});
