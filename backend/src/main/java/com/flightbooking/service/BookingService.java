package com.flightbooking.service;

import com.flightbooking.entity.Booking;
import com.flightbooking.entity.Flight;
import com.flightbooking.entity.User;
import com.flightbooking.entity.Passenger;
import com.flightbooking.repository.BookingRepository;
import com.flightbooking.repository.FlightRepository;
import com.flightbooking.repository.UserRepository;
import com.flightbooking.repository.PassengerRepository;
import com.flightbooking.dto.BookingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Transactional
    public Booking createBooking(BookingRequest bookingRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        Flight flight = flightRepository.findById(bookingRequest.getFlightId())
                .orElseThrow(() -> new RuntimeException("航班不存在"));

        // 创建订单
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setReference(generateBookingReference());
        booking.setStatus("CONFIRMED");
        booking.setBookingTime(new Timestamp(System.currentTimeMillis()));
        booking.setTotalPrice(flight.getPrice());

        booking = bookingRepository.save(booking);

        // 创建乘客信息
        Passenger passenger = new Passenger();
        passenger.setBooking(booking);
        passenger.setFirstName(bookingRequest.getFirstName());
        passenger.setLastName(bookingRequest.getLastName());
        passenger.setEmail(bookingRequest.getEmail());

        passengerRepository.save(passenger);

        return booking;
    }

    public List<Booking> getUserBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        return bookingRepository.findByUser(user);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByFlight(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("航班不存在"));
        return bookingRepository.findByFlight(flight);
    }

    private String generateBookingReference() {
        return "BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
} 