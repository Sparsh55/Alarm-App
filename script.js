//initialization
let timecountint = document.querySelector(".timer1");
const hours1 = document.getElementById("hours1");
const minutes1 = document.getElementById("minutes1");
const seconds1 = document.getElementById("seconds1");
const alarmsrunning = document.querySelector(".alarmsrunning");
const alarmSection = alarmsrunning.querySelector(".alarm");
const alarmset = document.getElementById("set");
const checker1 =document.getElementById("checker");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.wav");
let initialHour = 0,initialMinute = 0, alarmIndex = 0;
var alarmInterval;

//Append zeroes for single digit
const addzeros = (value) => (value < 10 ? "0" + value : value);

//Search for value in object
const lookinobject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return true;
    }
  });
  return [exists, alarmObject, objIndex];
};

//Display Time
function showclcok() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    addzeros(date.getHours()),
    addzeros(date.getMinutes()),
    addzeros(date.getSeconds()),
  ];

  var m="AM";

  if(hours>12){
    m="PM";
    hours=addzeros(hours%12);
  }
  if(hours==0){
    hours=12;
  }

  //Display time
  timecountint.innerHTML = `<span class="clocktick">${hours}</span>:<span class="clocktick">${minutes}</span>:<span class="clocktick">${seconds}</span><span class="clocktick ampm">${m}</span>`;;
  

  function showNotification(text){
    alert(text);
    return false;
  }

  if(alarmsArray.length==0){
    alarmsrunning.style.display = "none";
  }else{
    alarmsrunning.style.display = "block";
     
  }

  //Alarm
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {

      

      if (`${alarm.alarmHour}:${alarm.alarmMinute}:${alarm.alarmSeconds}:${alarm.checker}` === `${hours}:${minutes}:${seconds}:${m}`) {
        
        alarmSound.play();
        alarmSound.loop = true;

        if(!alarm.hasRang){
          showNotification("Alarm rang");
          alarm.hasRang=true;
        }

      }
    }
  });
}

const inputCheckHrs = (inputValue) => {
  
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = addzeros(inputValue);
  }else if(inputValue > 12){
    inputValue = "00";
  }
  return inputValue;
};

const inputCheckMins = (inputValue) => {

  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = addzeros(inputValue);
  }else if(inputValue > 59){
    inputValue = "00";
  }
  return inputValue;
};

hours1.addEventListener("input", () => {
  hours1.value = inputCheckHrs(hours1.value);
});

minutes1.addEventListener("input", () => {
  minutes1.value = inputCheckMins(minutes1.value);
});

seconds1.addEventListener("input", () => {
  seconds1.value = inputCheckMins(seconds1.value);
});

//Create alarm div

const createAlarm = (alarmObj) => {
  //Keys from object
  const { id, alarmHour, alarmMinute, alarmSeconds , checker } = alarmObj;
  //Alarm div
  let alarmDiv = document.createElement("div");
  
  alarmDiv.classList.add("alarm");
  alarmDiv.innerHTML = `<span>${alarmHour} : ${alarmMinute} : ${alarmSeconds} ${checker}</span>`;

  //checkbox
  let alarmInnerDiv = document.createElement("div");
  alarmInnerDiv.setAttribute("data-id", id);
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmInnerDiv.append(checkbox);

  //Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmInnerDiv.append(deleteButton);
  alarmDiv.appendChild(alarmInnerDiv);
  alarmsrunning.appendChild(alarmDiv);
};

//Set Alarm
alarmset.addEventListener("click", () => {
  alarmIndex += 1;

  //alarmObject
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hours1.value}_${minutes1.value}_${seconds1.value}`;
  alarmObj.alarmHour = hours1.value;
  alarmObj.alarmMinute = minutes1.value;
  alarmObj.alarmSeconds = seconds1.value;
  alarmObj.isActive = false;
  alarmObj.checker = checker1.value;
  alarmObj.hasRang = false;
  console.log(alarmObj);
  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  hours1.value = addzeros(initialHour);
  minutes1.value = addzeros(initialMinute);
});

//Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  console.log(searchId);
  let [exists, obj, index] = lookinobject("id", searchId);
  console.log(obj);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

//Stop alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = lookinobject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
};

//delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = lookinobject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
};

window.onload = () => {
  alarmInterval=setInterval(showclcok);
  initialHour = 0;
  initialMinute = 0;
  initialSecond = 0;
  alarmIndex = 0;
  alarmsArray = [];
  seconds1.value = addzeros(initialSecond);
  hours1.value = addzeros(initialHour);
  minutes1.value = addzeros(initialMinute);
};
