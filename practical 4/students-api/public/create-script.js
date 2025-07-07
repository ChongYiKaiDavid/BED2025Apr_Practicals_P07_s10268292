document.getElementById("createStudentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const student = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value
  };
  await fetch("/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  window.location.href = "students.html";
});
