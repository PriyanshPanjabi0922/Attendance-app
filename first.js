const card = document.getElementById('card');
const input = document.getElementById('input');
const addButton = document.getElementById('addButton');
const subjectCardContainer = document.getElementById('subjectCardContainer');

const STORAGE_KEY = "subjectsData";

addButton.addEventListener("click",(e)=>{
    e.preventDefault();


    if(!input.value.trim()){
        alert("Please enter Subject Name");
        return;
    }

    const name = input.value.trim().toLowerCase();

    let subjectsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const newSubject = {
        name: name,
        presentClass: 0,
        totalClass: 0
    };

    subjectsData.push(newSubject);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjectsData));

    let presentClass = 0;
    let totalClass = 0;

    input.value = "";

});

function calculateAttendance(presentclass,totalClass){
    let Percentage;
    
    if(totalClass===0){
        Percentage =0;
    }else{
        Percentage = Math.round((presentclass/totalClass)*100); 
    }
    
    const Requireddays = Math.max(0,Math.ceil((0.75*totalClass-presentclass)/0.25));
     let Status; 
    if(Percentage>=75){  
        
        Status  =`Safe: Yor Attendance is higer then 75%`;
        Status.classList = "Safe";
    } 
    else {
        Status = `Warning : Yor Attendance is Lower then 75%`;
        Status.classList = "Warning";
    }
    return {Percentage,Status,Requireddays};
}

function renderFunction(Percentage,Requireddays,Percentagetext,Requiredtext,Status) {
   
    Percentagetext.textContent = `Percentage : ${Percentage}%`;
    Requiredtext.textContent = `Required Day : ${Requireddays}`;
    subjectCardContainer.append(Percentagetext,Requiredtext,Status);
    
};
function saveSubject(presentButton,absentButton) {
    localStorage.setItem("subjectsData",JSON.stringify(subjectsData));

    }

function loadSubject(){

        const data = localStorage.getItem("subjectsData");
        if(!data) {
             return;
        }

        const subjectData = JSON.parse(data);
        subjectCardContainer.innerHTML = "";
             for(let subject of subjectData){
            createSubjectCard(subject);
        }  
    }

function createSubjectCard(subject){

    const name = subject.name;
    let present =subject.presentClass;
    let total = subject.totalClass;

    const result = calculateAttendance(present,total);

   const divCard = document.createElement('div');
   divCard.className = "subjectCard";

   const Title = document.createElement('h2');
   Title.textContent = name;

   const PresentButton = document.createElement('button');
   PresentButton.textContent = "Present";

   const AbsentButton = document.createElement('button');
   AbsentButton.textContent = "Absent";

   const ButtonContainer = document.createElement('div');
   ButtonContainer.append(PresentButton,AbsentButton);
   ButtonContainer.className = "ButtonContainer";
   const percentageText = document.createElement('div');
   const RequiredText = document.createElement('div');
   const statusText = document.createElement('div');

   percentageText.textContent =`Percentage ${result.Percentage}%`;
   percentageText.className = "percentageText";

   RequiredText.textContent = `Required Days ${result.Requireddays}`;
   RequiredText.className = "RequiredText";

  statusText.textContent = result.Percentage >= 75 
    ? "Safe" 
    : "Warning";

statusText.classList.remove("Safe", "Warning");  // 🔥 important

statusText.classList.add(
    result.Percentage >= 75 ? "Safe" : "Warning"
);

   PresentButton.addEventListener("click",(e)=>{
    e.preventDefault();
    present++;
    total++

    const result = calculateAttendance(present,total);

    percentageText.textContent =`Percentage ${result.Percentage}%`;
   RequiredText.textContent = `Required Days ${result.Requireddays}`;
   
   statusText.textContent = result.Percentage >= 75 
    ? "Safe" 
    : "Warning";

statusText.classList.remove("Safe", "Warning");  // 🔥 important

statusText.classList.add(
    result.Percentage >= 75 ? "Safe" : "Warning"
);

   });

   AbsentButton.addEventListener("click",(e)=>{
    e.preventDefault();
    total++

    const result = calculateAttendance(present,total);

    percentageText.textContent =`Percentage ${result.Percentage}%`;
   RequiredText.textContent = `Required Days ${result.Requireddays}`;
   
   statusText.textContent = result.Percentage >= 75 
    ? "Safe" 
    : "Warning";

statusText.classList.remove("Safe", "Warning");  // 🔥 important

statusText.classList.add(
    result.Percentage >= 75 ? "Safe" : "Warning"
);

   
   });

   divCard.append(Title,ButtonContainer,percentageText,RequiredText,statusText);
    subjectCardContainer.append(divCard);
        
}
    window.onload = function() {
        loadSubject();
    };
