const sql = require("mssql");
const dbConfig = require("../dbConfig.js");

// Get all students
async function getAllStudents() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    const result = await request.query("SELECT * FROM Students");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  } finally {
    if (connection) connection.close();
  }
}

// Get student by ID
async function getStudentById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("student_id", sql.Int, id);
    const result = await request.query("SELECT * FROM Students WHERE student_id = @student_id");
    return result.recordset[0]; 
    // return single record
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  } 
  finally {
    if (connection) connection.close();
  }
}

// Create student
async function createStudent(student_info) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("name", sql.NVarChar, student_info.name);
    request.input("address", sql.NVarChar, student_info.address);

    const query = `
      INSERT INTO Students (name, address)
      VALUES (@name, @address);
      SELECT SCOPE_IDENTITY() AS student_id;
    `;
    const result = await request.query(query);
    const newStudentId = result.recordset[0].student_id;
    return await getStudentById(newStudentId);
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  } finally {
    if (connection) connection.close();
  }
}

// Update student
async function updateStudent(student_info,id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("student_id", sql.Int, id);
    request.input("name", sql.NVarChar, student_info.name);
    request.input("address", sql.NVarChar, student_info.address);
    await request.query("UPDATE Students SET name = @name, address = @address WHERE student_id = @student_id");
    return await getStudentById(id);
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  } finally {
    if (connection) connection.close();
  }
}

// Delete student
async function deleteStudent(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("student_id", sql.Int, id);
    const result = await request.query("DELETE FROM Students WHERE student_id = @student_id");
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  } finally {
    if (connection) connection.close();
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
