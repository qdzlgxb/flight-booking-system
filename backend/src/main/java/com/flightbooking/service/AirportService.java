package com.flightbooking.service;

import com.flightbooking.entity.Airport;
import com.flightbooking.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AirportService {

    @Autowired
    private AirportRepository airportRepository;

    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    public Optional<Airport> getAirportById(Long id) {
        return airportRepository.findById(id);
    }

    public Optional<Airport> getAirportByCode(String code) {
        return airportRepository.findByCode(code);
    }

    public Airport saveAirport(Airport airport) {
        if (airportRepository.existsByCode(airport.getCode())) {
            throw new RuntimeException("机场代码已存在");
        }
        return airportRepository.save(airport);
    }

    public void deleteAirport(Long id) {
        airportRepository.deleteById(id);
    }
} 