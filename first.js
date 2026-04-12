const card = document.getElementById('card');
const input = document.getElementById('input');
const addButton = document.getElementById('addButton');

let subjectsData = []
    

addButton.addEventListener("click",(e)=>{
    e.preventDefault();

   if(!input.value.trim()){
    alert("Please enter Subject Name");
    return;
   }

    const subjectName = document.createElement('div');
    subjectName.textContent = input.value.trim().toLowerCase();
    
    const cardContainer = document.createElement('div');
    const subjectCardContainer = document.createElement('div');

    subjectName.className  = "subjectName";

    let presentClass = 0;
    let totalClass = 0;


    const presentButton = document.createElement('button');
    presentButton.id = "presentButton";
    presentButton.textContent = "Present";

    const absentButton = document.createElement('button');
    absentButton.id = "absentButton";
    absentButton.textContent = "Absent";

    const buttonContainer = document.createElement('div');
    buttonContainer.id  ="buttonContainer";

    const Percentagetext = document.createElement('div');
    const Requiredtext = document.createElement('div');

    Percentagetext.className = "Percentagetext";
    Requiredtext.className = "Requiredtext";

    const Status = document.createElement('div');

    buttonContainer.append(presentButton,absentButton);

    // presentbuttons event listener
    presentButton.addEventListener("click",(e)=>{
        presentClass++;
        totalClass++;
        console.log(presentClass,totalClass);
    
        renderFunction(presentClass,totalClass,Percentagetext,Requiredtext,Status);
    });

    // absentButton event listener
    absentButton.addEventListener("click",(e)=>{
        totalClass++;
        console.log(presentClass,totalClass);

        renderFunction(presentClass,totalClass,Percentagetext,Requiredtext,Status);
    });

    
    subjectCardContainer.append(subjectName,buttonContainer,Percentagetext,Requiredtext,Status);
    subjectCardContainer.id  = "subjectCardContainer";
    cardContainer.append(subjectCardContainer);
    cardContainer.id = "cardContainer";

    input.value = "";
    card.append(cardContainer);

     const subjects =  {
        name : subjectName.textContent,
        presentClass:0,
        totalClass:0

    }
    console.log(subjectName);
    console.log(subjectsData);

   subjectsData.push(subjects);
   saveSubject(presentButton,absentButton);
});

function renderFunction(presentClass,totalClass,Percentagetext,Requiredtext,Status) {
    const Percentage = Math.round((presentClass/totalClass)*100); 

 const Requireddays = Math.max(0,Math.ceil((0.75*totalClass-presentClass)/0.25));

    if(Percentage>=75){  
        Status.textContent  =`Safe: Yor Attendance is higer then 75%`;
        Status.classList = "Safe";
    } 
    else {
        Status.textContent = `Warning : Yor Attendance is Lower then 75%`;
        Status.classList = "Warning";
    }

    Percentagetext.textContent = `Percentage : ${Percentage}%`;
    Requiredtext.textContent = `Required Day : ${Requireddays}`;
    
};

function saveSubject(presentButton,absentButton) {
    localStorage.setItem("subjectsData",JSON.stringify(subjectsData));
    }
