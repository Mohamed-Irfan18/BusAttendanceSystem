package com.example.BusAttendanceSystem.dto;

public class PresentStudentResponse {

    private String rollNumber;
    private String studentName;

    public PresentStudentResponse(
            String rollNumber,
            String studentName) {

        this.rollNumber = rollNumber;
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public String getStudentName() {
        return studentName;
    }
}