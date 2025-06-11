package com.flightbooking.controller;

import com.flightbooking.entity.Flight;
import com.flightbooking.dto.FlightSearchRequest;
import com.flightbooking.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightService flightService;

    @PostMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(@RequestBody FlightSearchRequest searchRequest) {
        try {
            List<Flight> flights = flightService.searchFlights(searchRequest);
            return ResponseEntity.ok(flights);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id)
                .map(flight -> ResponseEntity.ok(flight))
                .orElse(ResponseEntity.notFound().build());
    }
} 