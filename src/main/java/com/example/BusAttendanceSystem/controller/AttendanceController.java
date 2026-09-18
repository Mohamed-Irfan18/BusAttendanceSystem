package com.example.BusAttendanceSystem.controller;

import com.example.BusAttendanceSystem.dto.AttendanceSummary;
import com.example.BusAttendanceSystem.entity.Attendance;
import com.example.BusAttendanceSystem.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // MARK ATTENDANCE
    @PostMapping("/mark")
    public Attendance markAttendance(
            @RequestParam String studentId,
            @RequestParam Integer busId) {

        return attendanceService.markAttendance(
                studentId,
                busId
        );
    }

    // GET ALL ATTENDANCE
    @GetMapping
    public List<Attendance> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }

    // GET ATTENDANCE SUMMARY FOR A BUS
    @GetMapping("/bus/{busId}")
    public AttendanceSummary getAttendanceSummary(
            @PathVariable Integer busId) {

        return attendanceService.getAttendanceSummary(busId);
    }
}