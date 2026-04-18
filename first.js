const card = document.getElementById("card");
const input = document.getElementById("input");
const addButton = document.getElementById("addButton");
const subjectCardContainer = document.getElementById("subjectCardContainer");

const STORAGE_KEY = "subjectsData";

addButton.addEventListener("click", (e) => {
  e.preventDefault();

  const name = input.value.trim().toLowerCase().replace(/\s+/g, " ");

  let subjectsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (!input.value.trim()) {
    alert("Please enter Subject Name");
    return;
  }

  if (name.length > 20) {
    alert("Too Long");
    return;
  }
  const isDuplicate = subjectsData.some((subject) => subject.name === name);

  if (isDuplicate) {
    alert("Already Use Subject Name!!");
    return;
  }

  const ValidName = /^[a-zA-Z\s]+$/;

  if (!ValidName.test(name)) {
    alert("Only Letter and Space is allowed!!");
    return;
  }

  const newSubject = {
    name: name,
    presentClass: 0,
    totalClass: 0,
    lastAction:null,
  };

  subjectsData.push(newSubject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjectsData));

  createSubjectCard(newSubject);

  input.value = "";

  addButton.disabled = true;

  setTimeout(() => {
    addButton.disabled = false;
  }, 500);
});

function calculateAttendance(presentClass, totalClass) {
  let Percentage;

  if (totalClass === 0) {
    Percentage = 0;
  } else {
    Percentage = Math.round((presentClass / totalClass) * 100);
  }

  const Requireddays = Math.max(0,Math.ceil((0.75 * totalClass - presentClass) / 0.25));
  return { Percentage, Requireddays };
};

function loadSubject() {
  const data = localStorage.getItem("subjectsData");
  if (!data) {
    return;
  }
  let subjectsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  subjectCardContainer.innerHTML = "";

  for (let subject of subjectsData) {
    createSubjectCard(subject);
  }
};

function createSubjectCard(subject) {
  const name = subject.name;
  let present = subject.presentClass;
  let total = subject.totalClass;

  const result = calculateAttendance(present, total);

  const divCard = document.createElement("div");
  divCard.className = "subjectCard";

  const Title = document.createElement("h2");
  Title.textContent = name;

  const PresentButton = document.createElement("button");
  PresentButton.textContent = "Present";

  const AbsentButton = document.createElement("button");
  AbsentButton.textContent = "Absent";

  const DeleteButton = document.createElement("button");
  DeleteButton.textContent = "Delete";
  DeleteButton.className = "DeleteButton";

  const UndoButton  =document.createElement("button");;
  UndoButton.textContent = "Undo";

  const ButtonContainer = document.createElement("div");
  ButtonContainer.append(PresentButton, AbsentButton);
  ButtonContainer.className = "ButtonContainer";

  const percentageText = document.createElement("div");
  const RequiredText = document.createElement("div");
  const statusText = document.createElement("div");

  percentageText.textContent = `Percentage ${result.Percentage}%`;
  percentageText.className = "percentageText";

  RequiredText.textContent = `Required Days ${result.Requireddays}`;
  RequiredText.className = "RequiredText";

  statusText.textContent = result.Percentage >= 75 ? "Safe" : "Warning";

  statusText.classList.remove("Safe", "Warning");

  statusText.classList.add(result.Percentage >= 75 ? "Safe" : "Warning");

  PresentButton.addEventListener("click", (e) => {
    e.preventDefault();
    upDataSubject(subject.name,"present");

    loadSubject();

    const result = calculateAttendance(present, total);

    percentageText.textContent = `Percentage ${result.Percentage}%`;
    RequiredText.textContent = `Required Days ${result.Requireddays}`;

    statusText.textContent = result.Percentage >= 75 ? "Safe" : "Warning"; 
    statusText.classList.remove("Safe", "Warning");
    statusText.classList.add(result.Percentage >= 75 ? "Safe" : "Warning");
  });

  AbsentButton.addEventListener("click", (e) => {
    e.preventDefault();
    upDataSubject(subject.name,"absent");

    loadSubject();

    const result = calculateAttendance(present, total);

    percentageText.textContent = `Percentage ${result.Percentage}%`;
    RequiredText.textContent = `Required Days ${result.Requireddays}`;

    statusText.textContent = result.Percentage >= 75 ? "Safe" : "Warning";
    statusText.classList.remove("Safe", "Warning");
    statusText.classList.add(result.Percentage >= 75 ? "Safe" : "Warning");
  });

  DeleteButton.addEventListener("click", (e) => {
    let subjectsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    subjectsData = subjectsData.filter((s) => s.name !== subject.name);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjectsData));
    divCard.remove();
  });

  UndoButton.addEventListener("click",(e)=>{
    upDataSubject(subject.name,"Undo");
  })

  function upDataSubject(name,type){
      let subjectsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    subjectsData = subjectsData.map((s) => {
      if (s.name === subject.name) {
        if(type === "present"){
          return {
            ...s,
            presentClass:s.presentClass+1,
            totalClass:s.totalClass + 1, 
            lastAction: "present",
        };
      }
      if(type === "absent"){
        return {
            ...s,
            totalClass:s.totalClass + 1, 
            lastAction:"absent",
        };

      };

    if(type === "Undo"){
      if(s.lastAction=== "present"){
        return {
          ...s,
          presentClass:Math.max(0,s.presentClass-1),
          totalClass:Math.max(0,s.totalClass-1),
          lastAction:null
        };
      }

      if(s.lastAction === "absent"){
        return {
          ...s,
          totalClass:Math.max(0,s.totalClass-1),
          lastAction:null
        };
      }
    }
      
        }
        return s; 
  });


    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjectsData));

    loadSubject();
  }

  divCard.append(Title,ButtonContainer,percentageText,RequiredText,statusText,DeleteButton,UndoButton);
  subjectCardContainer.append(divCard);
}

window.onload = function () {
  loadSubject();
};

