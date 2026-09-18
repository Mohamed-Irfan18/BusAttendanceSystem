package com.example.BusAttendanceSystem.exception;

public class BusNotFoundException extends RuntimeException {

    public BusNotFoundException(String message) {
        super(message);
    }
}