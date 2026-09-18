package com.example.BusAttendanceSystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Roll number printed on the ID card / barcode
    @Column(unique = true, nullable = false)
    private String studentId;

    private String name;

    private String department;

    private Integer year;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    public Student() {
    }

    public Student(Integer id, String studentId, String name,
                   String department, Integer year, Bus bus) {
        this.id = id;
        this.studentId = studentId;
        this.name = name;
        this.department = department;
        this.year = year;
        this.bus = bus;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }
}