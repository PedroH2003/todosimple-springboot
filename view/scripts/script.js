const tasksEndpoint = "http://localhost:8080/task";
const userEndpoint = "http://localhost:8080/user";


function hideLoader() {
  document.getElementById("loading").style.display = "none";
}


function show(tasks) {
  let tab = `<thead>
            <th scope="col">#</th>
            <th scope="col">Description</th>
            <th scope="col">Ações</th>
        </thead>`;

  for (let task of tasks) {
    tab += `
            <tr>
                <td scope="row">${task.id}</td>
                <td contenteditable="true" onblur="updateTask(${task.id}, this.innerText)">${task.description}</td>
                <td>
                  <button class="btn btn-danger" onclick="deleteTask(${task.id})">Excluir</button>
                </td>
            </tr>
        `;
  }

  document.getElementById("tasks").innerHTML = tab;
}

async function getTasks() {
  let key = "Authorization";
  const response = await fetch(`${tasksEndpoint}/user`, {
    method: "GET",
    headers: new Headers({
      Authorization: localStorage.getItem(key),
    }),
  });

  var data = await response.json();
  console.log(data);
  if (response) hideLoader();
  show(data);
}

// Função para excluir task
async function deleteTask(id) {
  const response = await fetch(`${tasksEndpoint}/${id}`, {
    method: "DELETE",
    headers: new Headers({
      Authorization: localStorage.getItem("Authorization"),
    }),
  });

  if (response) {
    getTasks(); // Recarrega as tasks
  } else {
    console.error('Erro ao excluir a task');
  }
}

// Função para atualizar task
async function updateTask(id, newDescription) {
  const response = await fetch(`${tasksEndpoint}/${id}`, {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    }),
    body: JSON.stringify({ description: newDescription }),
  });

  if (!response) {
    console.error('Erro ao atualizar a task');
  }
}

// Função para adicionar nova task
async function addTask() {
  const description = document.getElementById("newTaskDescription").value;
  
  const response = await fetch(tasksEndpoint, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    }),
    body: JSON.stringify({ description: description }),
  });

  if (response) {
    getTasks(); // Recarrega as tasks
    document.getElementById("newTaskDescription").value = ""; // Limpa o campo de input
  } else {
    console.error('Erro ao adicionar a task');
  }
}

async function deleteUser() {
  let key = "Authorization";
  const response = await fetch(userEndpoint, {
    method: "DELETE",
    headers: new Headers({
      Authorization: localStorage.getItem(key),
    }),
  });  

  if (response) {
    localStorage.removeItem("Authorization");
    window.location = "/view/login.html";
  } else {
    console.error('Erro ao excluir usuário');
  }
}


document.addEventListener("DOMContentLoaded", function (event) {
  if (!localStorage.getItem("Authorization"))
    window.location = "/view/login.html";

  document.getElementById("addTaskButton").addEventListener("click", addTask);
  getTasks();
});
