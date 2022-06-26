import FormComponent from "./components/form-component.js";
import todoValidator from "./helpers/validators/todo-validator.js";
import ApiService from "./helpers/api-service.js";

// Surandame elementę, į kurį dėsime TodoItem'us
const todoList = document.querySelector('.js-todo-list'); // <div class="js-todo-list todo-list"></div>

// Funkcija, kuri priimą objektą, ir pagal priimtą objektą, sukurią naują TodoItem'ą į įdeda jį
// į "todoList" kintamajį
const displayTodoItem = ({
  completed,
  title,
  id,
}) => {
  const todoItem = document.createElement('div'); // <div></div>
  todoItem.className = 'list-item'; // <div class="list-item'"></div>

  const checkbox = document.createElement('i');  // <i></i>
  checkbox.className = 'bi-square';  // <i class="bi bi-square"></i>
  if (completed) checkbox.className = 'bi-check-square'; // <i class="bi bi-check-square"></i>
  checkbox.addEventListener('click', async () => {
    console.log({ title, completed });
    await ApiService.updateTodo({
      id,
      completed: !checkbox.classList.contains('bi-check-square')
    });

    checkbox.classList.toggle('bi-check-square');
  });

  const todoItemText = document.createElement('div'); // <div></div>
  todoItemText.className = 'todo-list__item__text'; // <div class="todo-list__item__text"></div>
  todoItemText.innerText = title; // <div class="todo-list__item__text">{{ title }}</div>

  const btnDelete = document.createElement('i'); // <i></i>
  btnDelete.className = 'bi bi-x-square'; // <i class="bi bi-x-square"</i>
  btnDelete.innerText = ' '; // <i class="button">✖</i>
  btnDelete.addEventListener('click', async () => {
    await ApiService.deleteTodo(id);
    todoItem.remove();
  });

  todoItem.append(  // <div class="list-item">
    checkbox,       //   <div class="checkbox checked"></div>
    todoItemText,   //   <div class="todo-list__item__text">{{ text }}</div>
    btnDelete       //   <button class="button">✖</button>
  );                // </div>

  /*
   <div class="js-todo-list todo-list">
      {todoItem}  <- afterBegin
      ...
   </div>
  */
  todoList.insertAdjacentElement('afterBegin', todoItem);
}

// Kuriame Formos komponentą, kuris konstravimo metu paruošia validavimo procesą
const formAddTodo = new FormComponent(
  '.js-add-todo-item', /* selector */
  todoValidator, /* formatErrors */
  // OnSuccess handler
  async ({ title }) => {
    const createdTodo = await ApiService.createTodo({ title });
    displayTodoItem(createdTodo);
  }
);

// Pradinių duomenų parsiuntimas
const todos = await ApiService.fetchTodos();
todos.forEach(displayTodoItem);
