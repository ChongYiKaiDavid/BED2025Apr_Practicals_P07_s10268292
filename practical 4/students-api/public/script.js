const apiUrl = "/students";

async function loadStudents() {
  const res = await fetch(apiUrl);
  const students = await res.json();
  const container = document.getElementById("studentsList");
  container.innerHTML = "";
  students.forEach((s) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${s.name}</strong> (${s.email})
      <a href="edit-student.html?id=${s.id}">Edit</a>
      <button onclick="deleteStudent(${s.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

async function deleteStudent(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  loadStudents();
}

window.onload = loadStudents;
