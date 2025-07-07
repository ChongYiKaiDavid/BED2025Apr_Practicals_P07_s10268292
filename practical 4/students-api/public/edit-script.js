const id = new URLSearchParams(window.location.search).get("id");
async function loadStudent() {
  const res = await fetch(`/students/${id}`);
  const student = await res.json();
  document.getElementById("id").value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
}
document.getElementById("editStudentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const student = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value
  };
  await fetch(`/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  window.location.href = "students.html";
});
window.onload = loadStudent;
