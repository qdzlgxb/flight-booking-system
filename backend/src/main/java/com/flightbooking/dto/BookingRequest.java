package com.flightbooking.dto;

public class BookingRequest {
    private Long flightId;
    private String firstName;
    private String lastName;
    private String email;

    public BookingRequest() {}

    public BookingRequest(Long flightId, String firstName, String lastName, String email) {
        this.flightId = flightId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
} 