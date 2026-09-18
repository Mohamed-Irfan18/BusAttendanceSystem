package com.example.BusAttendanceSystem.repository;

import com.example.BusAttendanceSystem.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Integer> {

}