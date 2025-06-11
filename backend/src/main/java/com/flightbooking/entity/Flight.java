package com.flightbooking.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "FLIGHT")
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String flightNumber;

    @ManyToOne
    @JoinColumn(name = "departure_airport_id", nullable = false)
    private Airport departureAirport;

    @ManyToOne
    @JoinColumn(name = "destination_airport_id", nullable = false)
    private Airport destinationAirport;

    @Column(nullable = false)
    private Date departureDate;

    @Column(nullable = false)
    private Time departureTime;

    @Column(nullable = false)
    private Time arrivalTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // Constructors
    public Flight() {}

    public Flight(String flightNumber, Airport departureAirport, Airport destinationAirport,
                  Date departureDate, Time departureTime, Time arrivalTime, BigDecimal price) {
        this.flightNumber = flightNumber;
        this.departureAirport = departureAirport;
        this.destinationAirport = destinationAirport;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public Airport getDepartureAirport() {
        return departureAirport;
    }

    public void setDepartureAirport(Airport departureAirport) {
        this.departureAirport = departureAirport;
    }

    public Airport getDestinationAirport() {
        return destinationAirport;
    }

    public void setDestinationAirport(Airport destinationAirport) {
        this.destinationAirport = destinationAirport;
    }

    public Date getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(Date departureDate) {
        this.departureDate = departureDate;
    }

    public Time getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(Time departureTime) {
        this.departureTime = departureTime;
    }

    public Time getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(Time arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
} 