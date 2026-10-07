package com.example.BusAttendanceSystem.dto;

public class AttendanceCheckResponse {

    private String status;
    private String message;
    private String studentId;
    private String studentName;
    private Integer assignedBusNumber;
    private Integer currentBusNumber;

    public AttendanceCheckResponse(
            String status,
            String message,
            String studentId,
            String studentName,
            Integer assignedBusNumber,
            Integer currentBusNumber) {

        this.status = status;
        this.message = message;
        this.studentId = studentId;
        this.studentName = studentName;
        this.assignedBusNumber = assignedBusNumber;
        this.currentBusNumber = currentBusNumber;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public Integer getAssignedBusNumber() {
        return assignedBusNumber;
    }

    public Integer getCurrentBusNumber() {
        return currentBusNumber;
    }
}