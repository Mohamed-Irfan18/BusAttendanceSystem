package com.example.BusAttendanceSystem.dto;

import java.util.List;

public class AttendanceSummary {

    private int totalStudents;
    private int presentStudents;
    private int absentStudents;

    private List<AbsentStudent> absentees;

    public AttendanceSummary() {
    }

    public AttendanceSummary(
            int totalStudents,
            int presentStudents,
            int absentStudents,
            List<AbsentStudent> absentees) {

        this.totalStudents = totalStudents;
        this.presentStudents = presentStudents;
        this.absentStudents = absentStudents;
        this.absentees = absentees;
    }

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

    public List<AbsentStudent> getAbsentees() {
        return absentees;
    }

    public void setAbsentees(List<AbsentStudent> absentees) {
        this.absentees = absentees;
    }

    public static class AbsentStudent {

        private String studentId;
        private String name;

        public AbsentStudent() {
        }

        public AbsentStudent(String studentId, String name) {
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