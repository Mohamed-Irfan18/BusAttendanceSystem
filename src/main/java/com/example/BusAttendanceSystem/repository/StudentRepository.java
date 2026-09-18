package com.example.BusAttendanceSystem.repository;

import com.example.BusAttendanceSystem.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    Optional<Student> findByStudentId(String studentId);

    List<Student> findByBusId(Integer busId);
}