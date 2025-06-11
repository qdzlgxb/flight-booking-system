package com.flightbooking.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "BOOKING")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(nullable = false, length = 20)
    private String reference;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false)
    private Timestamp bookingTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    // Constructors
    public Booking() {}

    public Booking(User user, Flight flight, String reference, String status, 
                   Timestamp bookingTime, BigDecimal totalPrice) {
        this.user = user;
        this.flight = flight;
        this.reference = reference;
        this.status = status;
        this.bookingTime = bookingTime;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(Timestamp bookingTime) {
        this.bookingTime = bookingTime;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
} 