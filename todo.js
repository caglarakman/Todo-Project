const form = document.getElementById("todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.getElementById("filter");
const addButton = document.getElementById("add-button")
const clearButton = document.getElementById("clear-todos");
const togglebtn = document.querySelector("#toggle-btn");
const theBody = document.querySelector("body");
const switchOver = document.querySelector("#check");
const filterSelect = document.getElementById("filter-select");
const theCard = document.querySelector("#card");

eventListeners();

function eventListeners(){
  form.addEventListener("submit",addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
  togglebtn.addEventListener("click", switchToggle);
  document.addEventListener("DOMContentLoaded", saveToggleState);
  secondCardBody.addEventListener("click", checkTodoState);
  secondCardBody.addEventListener("mouseup", checkTodo);
  filterSelect.addEventListener("click",filterByState);
}

function filterByState(e){
  for(let i=0; i<todoList.childElementCount;i++){
    switch (filterSelect.value) {
      case "1":
        for(let i=0; i<todoList.childElementCount;i++){
          if(todoList.children[i].firstElementChild.firstElementChild.firstElementChild.className==="fa fa-remove"){
            todoList.children[i].setAttribute("style", "display:none !important");
          }else{
            todoList.children[i].setAttribute("style", "display:block ;opacity:0.45;")
          }
        }
        break;
      case "2":
        for(let i=0; i<todoList.childElementCount;i++){
          if(todoList.children[i].firstElementChild.firstElementChild.firstElementChild.className==="fa fa-check"){
            todoList.children[i].setAttribute("style", "display:none !important");
          }else{
            todoList.children[i].setAttribute("style", "display:block")
          }
        }
        break;
      default:
        for(let i=0; i<todoList.childElementCount;i++){
          if(todoList.children[i].firstElementChild.firstElementChild.firstElementChild.className==="fa fa-check"){
            todoList.children[i].setAttribute("style", "display:block ; opacity:0.45;")
          }else{
            todoList.children[i].setAttribute("style", "display:block");
          }
        }
        break;
    }
  }
}

function checkTodoState(e){
  if(e.target.className==="fa fa-check"){
    addCompletedTodoToStorage(e.target.parentElement.parentElement.parentElement.textContent);
  }
  else if(e.target.className==="fa fa-remove"){
    let completedTodos = getCompletedTodosFromStorage(); 
    for(let i=0 ; i<completedTodos.length ;i++){
      if(completedTodos[i]===e.target.parentElement.parentElement.parentElement.textContent){
        completedTodos.splice(i,1);
        localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
        break;
      }
    }
  }
}

function addCompletedTodoToStorage(completedTodo){
  let completedTodos = getCompletedTodosFromStorage();
  completedTodos.push(completedTodo);
  localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
}

function checkTodo(e){
  const targetIcon = e.target;
  if(targetIcon.className ==="fa fa-check" || targetIcon.className ==="fa fa-remove"){
    switch (targetIcon.className) {
      case "fa fa-check":
        targetIcon.parentElement.parentElement.parentElement.setAttribute("style","text-decoration:none; opacity:1;");
        targetIcon.parentElement.parentElement.className = "d-flex justify-content-between active"
        targetIcon.className ="fa fa-remove";
        break;
      case "fa fa-remove":
        targetIcon.parentElement.parentElement.parentElement.setAttribute("style"," opacity:0.45;");
        
        targetIcon.parentElement.parentElement.className = "d-flex justify-content-between"
        targetIcon.className ="fa fa-check";
        break;
    }
  }
}


function saveToggleState(){
  if(localStorage.getItem("toggleState")===null){
    localStorage.setItem("toggleState", togglebtn.className);
  }
  togglebtn.className = localStorage.getItem("toggleState");
  if(togglebtn.className==="toggle-btn"){
    theBody.style.background="rgb(45, 75, 39)";
  }else{
    theBody.style.background = "rgb(153, 196, 145)";
  }
}

function switchToggle () {
  switch (togglebtn.className) {
    case "toggle-btn active":
      togglebtn.className="toggle-btn";
      theBody.style.background="rgb(45, 75, 39)";
    
      break;
    case "toggle-btn":
      togglebtn.className="toggle-btn active";
      theBody.style.background = "rgb(153, 196, 145)";
      break;
  }
  localStorage.setItem("toggleState", togglebtn.className);
}

function clearAllTodos(){
  if(confirm("Tümünü silmek istediğinize emin misimiz? ")){
    //todoList.innerHTML="";
    while(!(todoList.firstElementChild === null)){
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
    localStorage.removeItem("completedTodos");
    localStorage.removeItem("incompletedTodos");
  }
  const listItems = document.querySelectorAll(".list-group-item.d-flex.justify-content-between");
  //listItems.remove();
}

function filterTodos(){
  let filterValue = filter.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item.d-flex.justify-content-between");
  for(let i=0 ;i<listItems.length ;i++){
    const text = listItems[i].textContent.toLowerCase();
    if(text.indexOf(filterValue) === -1){
      listItems[i].setAttribute("style", "display:none !important")
    }else{
      switch (listItems[i].firstElementChild.firstElementChild.firstElementChild.className) {
        case "fa fa-remove":
          listItems[i].setAttribute("style", "display:block")
          break;
        case "fa fa-check":
          listItems[i].setAttribute("style", "display:block;  opacity:0.45;")
          break;
      }
    }
  }
}

function deleteTodo(e){
  if(e.target.className==="fas fa-trash-alt"){
    e.target.parentElement.parentElement.parentElement.remove();
    showAlert("primary","Todo silindi..");
    deleteTodosFromStorage(e.target.parentElement.parentElement.parentElement.textContent);
  }
}

function deleteTodosFromStorage(deletetodo){
  let todos = getTodosFromStorage();
  let completedTodos = getCompletedTodosFromStorage();
  for(let i=0 ; i<todos.length ;i++){
    if(todos[i]===deletetodo){
      todos.splice(i,1);
    }
  }
  localStorage.setItem("todos", JSON.stringify(todos));

  for(let i=0 ; i<completedTodos.length ;i++){
    if(completedTodos[i]===deletetodo){
      completedTodos.splice(i,1);
    }
  }
  localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
}

function loadAllTodosToUI(){
  let todos = getTodosFromStorage();
  for(let i=0 ; i<todos.length ;i++){
    addTodoToUI(todos[i]);
  }
  // todos.forEach(function(todo){
  //   addTodoToUI(todo)
  // })
}

function addTodo(e){
  const newTodo = todoInput.value.trim();

  if(newTodo===""){
    showAlert("danger","Lütfen bir todo girin..");
  }else if(!checkTodoExist(newTodo)){
    showAlert("danger","Todo zaten var..");
  }
  else{
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo başarıyla eklendi...")
  }
  e.preventDefault();
}

function checkTodoExist(todo){
  let todos = getTodosFromStorage();
  for(let i=0 ;i<todos.length;i++){
    if(todo===todos[i]){
      return false;
    }
  }
  return true;
}

function addTodoToUI(newTodo){

//   <li class="list-group-item d-flex justify-content-between ">
//   Todo 1
//   <div class="d-flex justify-content-between active">
//     <a class="check-item">
//       <i class="fa fa-remove"></i>
//     </a>
//     <a href="#" class="delete-item">
//       <i class="fas fa-trash-alt"></i>
//     </a>
//   </div>
//  </li>  

  let completedTodos = getCompletedTodosFromStorage();
  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex justify-content-between";
  const div = document.createElement("div");
  div.className = "d-flex justify-content-between active";
  const link1 = document.createElement("a");
  link1.className = "check-item";
  link1.innerHTML = "<i class='fa fa-remove'></i>"
  const link2 = document.createElement("a");
  link2.className = "delete-item";
  
  link2.innerHTML = "<i class='fas fa-trash-alt'></i>"
  listItem.appendChild(document.createTextNode(newTodo));
  div.appendChild(link1);
  div.appendChild(link2);
  listItem.appendChild(div);
  for(let i=0 ;i<completedTodos.length ;i++){
    if(listItem.textContent===completedTodos[i]){
      listItem.firstElementChild.firstElementChild.firstElementChild.className = "fa fa-check";
      listItem.firstElementChild.firstElementChild.className = "d-flex justify-content-between";
      listItem.setAttribute("style", " opacity:0.45;");
     // listItem.textContent.setAttribute("style","text-decoration: line-through;");
    }
  }
  todoList.appendChild(listItem);
  todoInput.value="";
}

function showAlert(type,message){

  //   <div class="alert alert-danger mt-3" role="alert">
  //   This is a danger alert—check it out!
  // </div>

  const alert = document.createElement("div");
  alert.className ="alert alert-"+type+" mt-3";
  alert.textContent = message;
  if(firstCardBody.childElementCount===1){
    firstCardBody.appendChild(alert);
  }
  setTimeout(function(){
    alert.remove();
  },1000)
}

function addTodoToStorage(newTodo){
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodosFromStorage(){
  let todos;
  if(localStorage.getItem("todos")===null){
    todos = [];
  }else{
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function getCompletedTodosFromStorage(){
  let completedTodos;
  if(localStorage.getItem("completedTodos")===null){
    completedTodos = [];
  }else{
    completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
  }
  return completedTodos;
}