package com.example.BusAttendanceSystem.controller;

import com.example.BusAttendanceSystem.entity.Student;
import com.example.BusAttendanceSystem.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // CREATE
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    // READ ALL
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Integer id) {
        return studentService.getStudentById(id);
    }

    // GET STUDENTS BY BUS
    @GetMapping("/bus/{busId}")
    public List<Student> getStudentsByBus(@PathVariable Integer busId) {
        return studentService.getStudentsByBus(busId);
    }

    // FIND USING STUDENT ID / BARCODE
    @GetMapping("/student-id/{studentId}")
    public Student getStudentByStudentId(
            @PathVariable String studentId) {

        return studentService.getStudentByStudentId(studentId);
    }

    // UPDATE
    @PutMapping
    public Student updateStudent(@RequestBody Student student) {
        return studentService.updateStudent(student);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Integer id) {
        studentService.deleteStudent(id);
        return "Student deleted successfully";
    }
}