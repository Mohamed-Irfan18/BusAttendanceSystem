package com.example.BusAttendanceSystem.service;

import com.example.BusAttendanceSystem.entity.Student;
import com.example.BusAttendanceSystem.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // CREATE
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // READ ALL
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // READ BY ID
    public Student getStudentById(Integer id) {
        return studentRepository.findById(id).orElse(null);
    }

    // FIND BY STUDENT ID / BARCODE VALUE
    public Student getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId).orElse(null);
    }

    // GET STUDENTS BY BUS
    public List<Student> getStudentsByBus(Integer busId) {
        return studentRepository.findByBusId(busId);
    }

    // UPDATE
    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }

    // DELETE
    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }
}