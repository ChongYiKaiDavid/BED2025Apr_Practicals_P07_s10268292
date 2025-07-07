const studentModel = require("../models/studentModel")

async function getAllStudents(req,res){
    try{
        const student = await studentModel.getAllStudents();
        
        res.status(200).json(student)
    }
    catch(error){
        res.send(error)
    }

}

//
async function getStudentById(req,res){
    try{
        const student_id = req.params.id
        const student = await studentModel.getStudentById(student_id)
        if(!student){
            res.status(404).json("Student not found")
        }
        else{
        res.status(200).json(student)}}
    
    catch(error){
        res.send(error)
    }

}

//
async function createStudent(req,res){
    try{
        const id = req.params.id
        const data = req.body
        const student = await studentModel.createStudent(data,id)
       
        res.status(201).json(student)

    }
    catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating Student" });
  }
}
//
async function updateStudent(req,res){
   try{
    const id = req.params.id;
    const body = req.body
    const student = await studentModel.updateStudent(body,id)
      if(!student){
            res.status(404).json("Student not found")
        }
        else{
    res.status(200).json(student)}
   }
   catch(error){
    res.json("An Error Occur"+ error)
   }
}
//
async function deleteStudent(req,res){
    try{
        const id = req.params.id
        const student = await studentModel.deleteStudent(id)
         if(!student){
            res.status(404).json("Student not found")
        }
        else{
        res.status(204).json("delete successfull")}
    }
    catch(error){
        res.send(error)
    }
}
module.exports={
    deleteStudent,getAllStudents,getStudentById,updateStudent,createStudent
}
