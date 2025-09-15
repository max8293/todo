// Hae todo-lomake, input ja lista DOM:sta
const form = document.querySelector(".todo-form");
const input = document.querySelector("#task");
const list = document.querySelector(".todo-list");

// Varmistetaan, että lomake on olemassa ennen tapahtumankuuntelijan liittämistä
if (form) {
  // Lataa tehtävät kun sivu on valmis
  document.addEventListener("DOMContentLoaded", loadTasks);

  // Lomakkeen lähetys
  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // estä oletustoiminto
    const task = input.value.trim(); // hae inputin arvo ja poista tyhjät välit
    if (task) {
      const newTask = await addTask(task); // lisää tehtävä tietokantaan
      if (newTask) renderTask(newTask); // lisää DOMiin vain uusi tehtävä
      input.value = ""; // tyhjennä kenttä
    }
  });
}

// Funktio: renderoi tehtävä DOMiin
function renderTask(taskObj) {
  const li = document.createElement("li");
  li.textContent = taskObj.task;

  // Klikkaus poistaa/tägää tehtävän tehdyksi
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", async (e) => {
    e.stopPropagation(); // estä li:n click tapahtuma
    await deleteTask(taskObj.id);
    li.remove();
  });

  li.appendChild(delBtn);
  list.appendChild(li);
}

// Funktio: lataa kaikki tehtävät tietokannasta
async function loadTasks() {
  if (!list) return; // jos listaa ei ole, lopeta
  list.innerHTML = "";
  try {
    const res = await fetch("../php/get_task.php");
    const data = await res.json();
    if (Array.isArray(data)) {
      data.forEach((task) => renderTask(task));
    } else if (data.error) {
      console.error(data.error);
    }
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

// Funktio: lisää tehtävän tietokantaan
async function addTask(task) {
  const formData = new FormData();
  formData.append("task", task);
  try {
    const res = await fetch("../php/add_task.php", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success && data.id) {
      return { id: data.id, task }; // palautetaan uusi tehtävä
    } else {
      console.error(data.error);
      return null;
    }
  } catch (err) {
    console.error("Error adding task:", err);
    return null;
  }
}

// Funktio: poista tehtävä tietokannasta
async function deleteTask(taskId) {
  const formData = new FormData();
  formData.append("task_id", taskId);
  try {
    const res = await fetch("../php/delete_task.php", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.success) {
      console.error(data.error);
    }
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

// ------------------- GDPR TOIMINNOT -------------------

// Käyttäjän tilin poisto
function deleteAccount() {
  if (confirm("Haluatko varmasti poistaa tilisi? Tätä ei voi peruuttaa.")) {
    fetch("../php/delete_account.php", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Tili poistettu onnistuneesti.");
          window.location.href = "../pages/login.html";
        } else {
          alert("Virhe: " + data.error);
        }
      });
  }
}

// Käyttäjän tietojen vienti JSON-tiedostona
function exportData() {
  fetch("../php/export_data.php")
    .then((response) => {
      if (!response.ok) throw new Error("Tietojen vienti epäonnistui");
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my_tasks.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((err) => alert(err.message));
}

// Liitä GDPR nav-linkit tapahtumankuuntelijoihin
document.addEventListener("DOMContentLoaded", () => {
  const deleteBtn = document.getElementById("delete-account-btn"); // nav link
  if (deleteBtn) {
    deleteBtn.addEventListener("click", deleteAccount);
  }

  const exportBtn = document.getElementById("export-data-btn"); // nav link
  if (exportBtn) {
    exportBtn.addEventListener("click", exportData);
  }
});
