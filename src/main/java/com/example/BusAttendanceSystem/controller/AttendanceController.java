package com.example.BusAttendanceSystem.controller;

import com.example.BusAttendanceSystem.dto.AttendanceCheckResponse;
import com.example.BusAttendanceSystem.dto.AttendanceSummary;
import com.example.BusAttendanceSystem.entity.Attendance;
import com.example.BusAttendanceSystem.service.AttendanceService;
import com.example.BusAttendanceSystem.dto.PresentStudentResponse;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }


    // =========================================================
    // MARK ATTENDANCE
    // =========================================================

    @PostMapping("/mark")
    public Attendance markAttendance(
            @RequestParam String studentId,
            @RequestParam Integer busId) {

        return attendanceService.markAttendance(
                studentId,
                busId
        );
    }


    // =========================================================
    // CHECK ATTENDANCE
    // =========================================================

    @PostMapping("/check")
    public AttendanceCheckResponse checkAttendance(
            @RequestParam String studentId,
            @RequestParam Integer busId) {

        return attendanceService.checkAttendance(
                studentId,
                busId
        );
    }


    // =========================================================
    // ALLOW STUDENT FROM ANOTHER BUS
    // =========================================================

    @PostMapping("/allow")
    public Attendance allowAttendance(
            @RequestParam String studentId,
            @RequestParam Integer busId) {

        return attendanceService.allowAttendance(
                studentId,
                busId
        );
    }

    // =========================================================
// GET TODAY'S PRESENT STUDENTS
// =========================================================

    @GetMapping("/bus/{busId}/present")
    public List<PresentStudentResponse> getPresentStudents(
            @PathVariable Integer busId) {

        return attendanceService.getPresentStudents(
                busId
        );
    }


    // =========================================================
    // GET ALL ATTENDANCE
    // =========================================================

    @GetMapping
    public List<Attendance> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }


    // =========================================================
    // GET TODAY'S ATTENDANCE SUMMARY
    // =========================================================

    @GetMapping("/bus/{busId}")
    public AttendanceSummary getAttendanceSummary(
            @PathVariable Integer busId) {

        return attendanceService.getAttendanceSummary(
                busId
        );
    }


    // =========================================================
    // GET ATTENDANCE SUMMARY FOR SELECTED DATE
    // =========================================================

    @GetMapping("/bus/{busId}/date")
    public AttendanceSummary getAttendanceSummaryByDate(
            @PathVariable Integer busId,
            @RequestParam LocalDate date) {

        return attendanceService.getAttendanceSummaryByDate(
                busId,
                date
        );
    }
}