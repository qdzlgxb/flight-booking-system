package com.flightbooking.repository;

import com.flightbooking.entity.Booking;
import com.flightbooking.entity.User;
import com.flightbooking.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByFlight(Flight flight);
    List<Booking> findByStatus(String status);
} 