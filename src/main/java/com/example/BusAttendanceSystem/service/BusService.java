package com.example.BusAttendanceSystem.service;

import com.example.BusAttendanceSystem.entity.Bus;
import com.example.BusAttendanceSystem.repository.BusRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusService {

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    // CREATE
    public Bus saveBus(Bus bus) {
        return busRepository.save(bus);
    }

    // READ ALL
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    // READ BY ID
    public Bus getBusById(Integer id) {
        return busRepository.findById(id).orElse(null);
    }

    // UPDATE
    public Bus updateBus(Bus bus) {
        return busRepository.save(bus);
    }

    // DELETE
    public void deleteBus(Integer id) {
        busRepository.deleteById(id);
    }
}