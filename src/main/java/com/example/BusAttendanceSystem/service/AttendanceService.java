package com.example.BusAttendanceSystem.service;

import com.example.BusAttendanceSystem.dto.AttendanceSummary;
import com.example.BusAttendanceSystem.entity.Attendance;
import com.example.BusAttendanceSystem.entity.Bus;
import com.example.BusAttendanceSystem.entity.Student;
import com.example.BusAttendanceSystem.exception.AttendanceAlreadyMarkedException;
import com.example.BusAttendanceSystem.exception.BusNotFoundException;
import com.example.BusAttendanceSystem.exception.InvalidBusStudentException;
import com.example.BusAttendanceSystem.exception.StudentNotFoundException;
import com.example.BusAttendanceSystem.repository.AttendanceRepository;
import com.example.BusAttendanceSystem.repository.BusRepository;
import com.example.BusAttendanceSystem.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final BusRepository busRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository,
            BusRepository busRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.busRepository = busRepository;
    }

    // MARK ATTENDANCE
    public Attendance markAttendance(String studentId, Integer busId) {

        // 1. Find Bus
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() ->
                        new BusNotFoundException(
                                "Bus with ID " + busId + " not found"
                        ));

        // 2. Find Student using scanned ID
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student with ID " + studentId + " not found"
                        ));

        // 3. Check whether student belongs to selected bus
        if (student.getBus() == null ||
                !student.getBus().getId().equals(busId)) {

            throw new InvalidBusStudentException(
                    "Student " + studentId +
                            " does not belong to Bus " +
                            bus.getBusNumber()
            );
        }

        // 4. Check duplicate attendance
        LocalDate today = LocalDate.now();

        boolean alreadyPresent =
                attendanceRepository.existsByStudentIdAndAttendanceDate(
                        student.getId(),
                        today
                );

        if (alreadyPresent) {

            throw new AttendanceAlreadyMarkedException(
                    "Attendance already marked for " + studentId
            );
        }

        // 5. Create attendance
        Attendance attendance = new Attendance();

        attendance.setStudent(student);
        attendance.setBus(bus);
        attendance.setAttendanceDate(today);
        attendance.setAttendanceTime(LocalTime.now());
        attendance.setStatus("PRESENT");

        // 6. Save attendance
        return attendanceRepository.save(attendance);
    }


    // GET ALL ATTENDANCE
    public List<Attendance> getAllAttendance() {

        return attendanceRepository.findAll();
    }


    // GET ATTENDANCE SUMMARY FOR A BUS
    public AttendanceSummary getAttendanceSummary(Integer busId) {

        // Check whether bus exists
        busRepository.findById(busId)
                .orElseThrow(() ->
                        new BusNotFoundException(
                                "Bus with ID " + busId + " not found"
                        ));

        // Get all students belonging to this bus
        List<Student> students =
                studentRepository.findByBusId(busId);

        // Get today's attendance
        LocalDate today = LocalDate.now();

        List<Attendance> attendances =
                attendanceRepository.findByBusIdAndAttendanceDate(
                        busId,
                        today
                );

        // Store IDs of present students
        Set<Integer> presentStudentIds =
                attendances.stream()
                        .map(attendance ->
                                attendance.getStudent().getId())
                        .collect(Collectors.toSet());

        // Total students
        int totalStudents = students.size();

        // Present students
        int presentStudents = presentStudentIds.size();

        // Absent students
        int absentStudents =
                totalStudents - presentStudents;

        // Find absent students
        List<AttendanceSummary.AbsentStudent> absentees =
                students.stream()
                        .filter(student ->
                                !presentStudentIds.contains(
                                        student.getId()
                                ))
                        .map(student ->
                                new AttendanceSummary.AbsentStudent(
                                        student.getStudentId(),
                                        student.getName()
                                ))
                        .toList();

        return new AttendanceSummary(
                totalStudents,
                presentStudents,
                absentStudents,
                absentees
        );
    }
}