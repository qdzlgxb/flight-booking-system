package com.flightbooking.controller;

import com.flightbooking.entity.Airport;
import com.flightbooking.entity.Flight;
import com.flightbooking.entity.Booking;
import com.flightbooking.entity.Passenger;
import com.flightbooking.service.AirportService;
import com.flightbooking.service.FlightService;
import com.flightbooking.service.BookingService;
import com.flightbooking.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AirportService airportService;

    @Autowired
    private FlightService flightService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PassengerRepository passengerRepository;

    // 机场管理
    @PostMapping("/airports")
    public ResponseEntity<?> createAirport(@RequestBody Airport airport) {
        try {
            Airport savedAirport = airportService.saveAirport(airport);
            return ResponseEntity.ok(savedAirport);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建机场失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/airports/{id}")
    public ResponseEntity<?> deleteAirport(@PathVariable Long id) {
        try {
            airportService.deleteAirport(id);
            return ResponseEntity.ok("机场删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除机场失败: " + e.getMessage());
        }
    }

    // 航班管理
    @GetMapping("/flights")
    public ResponseEntity<List<Flight>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }

    @PostMapping("/flights")
    public ResponseEntity<?> createFlight(@RequestBody Flight flight) {
        try {
            Flight savedFlight = flightService.saveFlight(flight);
            return ResponseEntity.ok(savedFlight);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建航班失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/flights/{id}")
    public ResponseEntity<?> deleteFlight(@PathVariable Long id) {
        try {
            flightService.deleteFlight(id);
            return ResponseEntity.ok("航班删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除航班失败: " + e.getMessage());
        }
    }

    // 订单管理
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/flights/{flightId}/passengers")
    public ResponseEntity<List<Passenger>> getFlightPassengers(@PathVariable Long flightId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByFlight(flightId);
            List<Passenger> passengers = bookings.stream()
                    .flatMap(booking -> passengerRepository.findByBooking(booking).stream())
                    .toList();
            return ResponseEntity.ok(passengers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 