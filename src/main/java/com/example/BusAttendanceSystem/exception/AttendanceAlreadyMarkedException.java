package com.example.BusAttendanceSystem.exception;

public class AttendanceAlreadyMarkedException extends RuntimeException {

    public AttendanceAlreadyMarkedException(String message) {
        super(message);
    }
}