package com.example.BusAttendanceSystem.controller;

import com.example.BusAttendanceSystem.entity.Bus;
import com.example.BusAttendanceSystem.service.BusService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buses")
@CrossOrigin
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    // CREATE
    @PostMapping
    public Bus createBus(@RequestBody Bus bus) {
        return busService.saveBus(bus);
    }

    // READ ALL
    @GetMapping
    public List<Bus> getAllBuses() {
        return busService.getAllBuses();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Bus getBusById(@PathVariable Integer id) {
        return busService.getBusById(id);
    }

    // UPDATE
    @PutMapping
    public Bus updateBus(@RequestBody Bus bus) {
        return busService.updateBus(bus);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteBus(@PathVariable Integer id) {
        busService.deleteBus(id);
        return "Bus deleted successfully";
    }
}