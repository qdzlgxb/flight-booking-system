package com.flightbooking.repository;

import com.flightbooking.entity.Flight;
import com.flightbooking.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    Optional<Flight> findByFlightNumber(String flightNumber);
    List<Flight> findByDepartureAirportAndDestinationAirport(Airport departureAirport, Airport destinationAirport);
    List<Flight> findByDepartureAirport(Airport departureAirport);
    List<Flight> findByDestinationAirport(Airport destinationAirport);
} 