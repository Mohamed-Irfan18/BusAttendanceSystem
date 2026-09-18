package com.example.BusAttendanceSystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(StudentNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleStudentNotFound(
            StudentNotFoundException ex) {

        return Map.of("message", ex.getMessage());
    }


    @ExceptionHandler(BusNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleBusNotFound(
            BusNotFoundException ex) {

        return Map.of("message", ex.getMessage());
    }


    @ExceptionHandler(AttendanceAlreadyMarkedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleAttendanceAlreadyMarked(
            AttendanceAlreadyMarkedException ex) {

        return Map.of("message", ex.getMessage());
    }


    @ExceptionHandler(InvalidBusStudentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleInvalidBusStudent(
            InvalidBusStudentException ex) {

        return Map.of("message", ex.getMessage());
    }
}