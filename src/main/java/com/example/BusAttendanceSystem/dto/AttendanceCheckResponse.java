package com.example.BusAttendanceSystem.dto;

public class AttendanceCheckResponse {

    private String status;
    private String message;
    private String studentId;
    private String studentName;
    private Integer assignedBusId;
    private Integer currentBusId;

    public AttendanceCheckResponse(
            String status,
            String message,
            String studentId,
            String studentName,
            Integer assignedBusId,
            Integer currentBusId) {

        this.status = status;
        this.message = message;
        this.studentId = studentId;
        this.studentName = studentName;
        this.assignedBusId = assignedBusId;
        this.currentBusId = currentBusId;
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

    public Integer getAssignedBusId() {
        return assignedBusId;
    }

    public Integer getCurrentBusId() {
        return currentBusId;
    }
}