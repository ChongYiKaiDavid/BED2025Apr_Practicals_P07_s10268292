module.exports = {
    user: "kk", // Replace with your SQL Server login username
    password: "2006", // Replace with your SQL Server login password
    server: "localhost",
    database: "students_db",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    }}
