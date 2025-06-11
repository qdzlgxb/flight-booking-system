package com.flightbooking.repository;

import com.flightbooking.entity.Passenger;
import com.flightbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    List<Passenger> findByBooking(Booking booking);
} 