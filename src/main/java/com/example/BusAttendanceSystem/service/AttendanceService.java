package com.example.BusAttendanceSystem.service;

import com.example.BusAttendanceSystem.dto.PresentStudentResponse;
import com.example.BusAttendanceSystem.dto.AttendanceCheckResponse;
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


    // =========================================================
    // MARK ATTENDANCE
    // =========================================================

    public Attendance markAttendance(
            String studentId,
            Integer busId) {

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() ->
                        new BusNotFoundException(
                                "Bus with ID " + busId + " not found"
                        ));

        Student student =
                studentRepository.findByStudentId(studentId)
                        .orElseThrow(() ->
                                new StudentNotFoundException(
                                        "Student with ID " +
                                                studentId +
                                                " not found"
                                ));

        if (student.getBus() == null ||
                !student.getBus().getId().equals(busId)) {

            throw new InvalidBusStudentException(
                    "Student " +
                            studentId +
                            " does not belong to Bus " +
                            bus.getBusNumber()
            );
        }

        LocalDate today = LocalDate.now();

        boolean alreadyPresent =
                attendanceRepository
                        .existsByStudentIdAndAttendanceDate(
                                student.getId(),
                                today
                        );

        if (alreadyPresent) {
            throw new AttendanceAlreadyMarkedException(
                    "Attendance already marked for " +
                            studentId
            );
        }

        Attendance attendance = new Attendance();

        attendance.setStudent(student);
        attendance.setBus(bus);
        attendance.setAttendanceDate(today);
        attendance.setAttendanceTime(LocalTime.now());
        attendance.setStatus("PRESENT");

        return attendanceRepository.save(attendance);
    }


    // =========================================================
    // CHECK STUDENT
    // =========================================================

    public AttendanceCheckResponse checkAttendance(
            String studentId,
            Integer busId) {

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() ->
                        new BusNotFoundException(
                                "Bus with ID " +
                                        busId +
                                        " not found"
                        ));

        Student student =
                studentRepository.findByStudentId(studentId)
                        .orElseThrow(() ->
                                new StudentNotFoundException(
                                        "Student with ID " +
                                                studentId +
                                                " not found"
                                ));

        if (student.getBus() == null) {

            return new AttendanceCheckResponse(
                    "APPROVAL_REQUIRED",
                    "Student " +
                            student.getName() +
                            " is not assigned to any bus. " +
                            "Allow this student to travel on Bus " +
                            bus.getBusNumber() +
                            "?",
                    student.getStudentId(),
                    student.getName(),
                    null,
                    bus.getId()
            );
        }

        Integer assignedBusId =
                student.getBus().getId();

        if (assignedBusId.equals(busId)) {

            markAttendance(
                    studentId,
                    busId
            );

            return new AttendanceCheckResponse(
                    "PRESENT",
                    "Attendance marked successfully",
                    student.getStudentId(),
                    student.getName(),
                    assignedBusId,
                    bus.getId()
            );
        }

        return new AttendanceCheckResponse(
                "APPROVAL_REQUIRED",
                "Student " +
                        student.getName() +
                        " is not assigned to Bus " +
                        bus.getBusNumber() +
                        ". Allow this student to travel on Bus " +
                        bus.getBusNumber() +
                        "?",
                student.getStudentId(),
                student.getName(),
                assignedBusId,
                bus.getId()
        );
    }


    // =========================================================
    // ALLOW STUDENT FROM ANOTHER BUS
    // =========================================================

    public Attendance allowAttendance(
            String studentId,
            Integer busId) {

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() ->
                        new BusNotFoundException(
                                "Bus with ID " +
                                        busId +
                                        " not found"
                        ));

        Student student =
                studentRepository.findByStudentId(studentId)
                        .orElseThrow(() ->
                                new StudentNotFoundException(
                                        "Student with ID " +
                                                studentId +
                                                " not found"
                                ));

        LocalDate today = LocalDate.now();

        boolean alreadyPresent =
                attendanceRepository
                        .existsByStudentIdAndAttendanceDate(
                                student.getId(),
                                today
                        );

        if (alreadyPresent) {
            throw new AttendanceAlreadyMarkedException(
                    "Attendance already marked for " +
                            studentId
            );
        }

        Attendance attendance = new Attendance();

        attendance.setStudent(student);

        // Record the bus actually travelled
        attendance.setBus(bus);

        attendance.setAttendanceDate(today);

        attendance.setAttendanceTime(
                LocalTime.now()
        );

        attendance.setStatus("PRESENT");

        return attendanceRepository.save(attendance);
    }


    // =========================================================
    // GET ALL ATTENDANCE
    // =========================================================

    public List<Attendance> getAllAttendance() {

        return attendanceRepository.findAll();
    }


    // =========================================================
    // GET TODAY'S ATTENDANCE SUMMARY
    // =========================================================

    public AttendanceSummary getAttendanceSummary(
            Integer busId) {

        busRepository.findById(busId)
                .orElseThrow(() ->
                        new BusNotFoundException(
                                "Bus with ID " +
                                        busId +
                                        " not found"
                        ));

        List<Student> students =
                studentRepository.findByBusId(busId);

        LocalDate today = LocalDate.now();

        List<Attendance> attendances =
                attendanceRepository
                        .findByBusIdAndAttendanceDate(
                                busId,
                                today
                        );

        Set<Integer> presentStudentIds =
                attendances.stream()
                        .map(attendance ->
                                attendance
                                        .getStudent()
                                        .getId())
                        .collect(Collectors.toSet());

        int totalStudents =
                students.size();

        int presentStudents =
                presentStudentIds.size();

        int absentStudents =
                totalStudents -
                        presentStudents;

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

    // =========================================================
// GET TODAY'S PRESENT STUDENTS
// =========================================================

    public List<PresentStudentResponse> getPresentStudents(
            Integer busId) {

        // Check whether bus exists
        busRepository.findById(busId)
                .orElseThrow(() ->
                        new BusNotFoundException(
                                "Bus with ID " + busId +
                                        " not found"
                        ));

        // Get today's date
        LocalDate today = LocalDate.now();

        // Get today's present attendance records
        List<Attendance> attendances =
                attendanceRepository
                        .findByBusIdAndAttendanceDateAndStatus(
                                busId,
                                today,
                                "PRESENT"
                        );

        // Convert Attendance entities into DTOs
        return attendances.stream()
                .map(attendance ->
                        new PresentStudentResponse(
                                attendance.getStudent().getStudentId(),
                                attendance.getStudent().getName()
                        )
                )
                .toList();
    }


    // =========================================================
    // GET ATTENDANCE SUMMARY FOR SELECTED DATE
    // =========================================================

    public AttendanceSummary getAttendanceSummaryByDate(
            Integer busId,
            LocalDate date) {

        // 1. Check whether bus exists
        busRepository.findById(busId)
                .orElseThrow(() ->
                        new BusNotFoundException(
                                "Bus with ID " +
                                        busId +
                                        " not found"
                        ));

        // 2. Get students belonging to this bus
        List<Student> students =
                studentRepository.findByBusId(busId);

        // 3. Get attendance for selected date
        List<Attendance> attendances =
                attendanceRepository
                        .findByBusIdAndAttendanceDate(
                                busId,
                                date
                        );

        // 4. No attendance recorded for this date
        if (attendances.isEmpty()) {

            return new AttendanceSummary(
                    students.size(),
                    0,
                    0,
                    false,
                    "No attendance recorded for this date",
                    List.of()
            );
        }

        // 5. Store IDs of present students
        Set<Integer> presentStudentIds =
                attendances.stream()
                        .map(attendance ->
                                attendance
                                        .getStudent()
                                        .getId())
                        .collect(Collectors.toSet());

        // 6. Calculate totals
        int totalStudents =
                students.size();

        int presentStudents =
                presentStudentIds.size();

        int absentStudents =
                totalStudents -
                        presentStudents;

        // 7. Find absent students
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

        // 8. Return report
        return new AttendanceSummary(
                totalStudents,
                presentStudents,
                absentStudents,
                true,
                "Attendance available",
                absentees
        );
    }
}