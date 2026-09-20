package com.example.BusAttendanceSystem.dto;

import java.util.List;

public class AttendanceSummary {

    private int totalStudents;
    private int presentStudents;
    private int absentStudents;

    private boolean attendanceRecorded;
    private String message;

    private List<AbsentStudent> absentees;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public AttendanceSummary() {
    }


    // =========================================================
    // EXISTING CONSTRUCTOR
    // =========================================================

    public AttendanceSummary(
            int totalStudents,
            int presentStudents,
            int absentStudents,
            List<AbsentStudent> absentees) {

        this.totalStudents = totalStudents;
        this.presentStudents = presentStudents;
        this.absentStudents = absentStudents;

        // Existing reports are considered valid attendance reports
        this.attendanceRecorded = true;
        this.message = "Attendance available";

        this.absentees = absentees;
    }


    // =========================================================
    // NEW CONSTRUCTOR
    // =========================================================

    public AttendanceSummary(
            int totalStudents,
            int presentStudents,
            int absentStudents,
            boolean attendanceRecorded,
            String message,
            List<AbsentStudent> absentees) {

        this.totalStudents = totalStudents;
        this.presentStudents = presentStudents;
        this.absentStudents = absentStudents;
        this.attendanceRecorded = attendanceRecorded;
        this.message = message;
        this.absentees = absentees;
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }


    public int getPresentStudents() {
        return presentStudents;
    }

    public void setPresentStudents(int presentStudents) {
        this.presentStudents = presentStudents;
    }


    public int getAbsentStudents() {
        return absentStudents;
    }

    public void setAbsentStudents(int absentStudents) {
        this.absentStudents = absentStudents;
    }


    public boolean isAttendanceRecorded() {
        return attendanceRecorded;
    }

    public void setAttendanceRecorded(boolean attendanceRecorded) {
        this.attendanceRecorded = attendanceRecorded;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public List<AbsentStudent> getAbsentees() {
        return absentees;
    }

    public void setAbsentees(List<AbsentStudent> absentees) {
        this.absentees = absentees;
    }


    // =========================================================
    // ABSENT STUDENT
    // =========================================================

    public static class AbsentStudent {

        private String studentId;
        private String name;


        public AbsentStudent() {
        }


        public AbsentStudent(
                String studentId,
                String name) {

            this.studentId = studentId;
            this.name = name;
        }


        public String getStudentId() {
            return studentId;
        }

        public void setStudentId(String studentId) {
            this.studentId = studentId;
        }


        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}