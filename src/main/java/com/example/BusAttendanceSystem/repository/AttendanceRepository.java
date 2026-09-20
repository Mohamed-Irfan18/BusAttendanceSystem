package com.example.BusAttendanceSystem.repository;
import com.example.BusAttendanceSystem.entity.Attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    boolean existsByStudentIdAndAttendanceDate(
            Integer studentId,
            LocalDate attendanceDate
    );

    List<Attendance> findByBusIdAndAttendanceDate(
            Integer busId,
            LocalDate attendanceDate
    );

    List<Attendance> findByBusIdAndAttendanceDateAndStatus(
            Integer busId,
            LocalDate attendanceDate,
            String status
    );
}