package com.flightbooking.controller;

import com.flightbooking.entity.Booking;
import com.flightbooking.dto.BookingRequest;
import com.flightbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest) {
        try {
            Booking booking = bookingService.createBooking(bookingRequest);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("订票失败: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getUserBookings() {
        try {
            List<Booking> bookings = bookingService.getUserBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 