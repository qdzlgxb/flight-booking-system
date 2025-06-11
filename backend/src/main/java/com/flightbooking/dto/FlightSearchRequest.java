package com.flightbooking.dto;

public class FlightSearchRequest {
    private String flightNumber;
    private String departureAirportCode;
    private String destinationAirportCode;

    public FlightSearchRequest() {}

    public FlightSearchRequest(String flightNumber, String departureAirportCode, String destinationAirportCode) {
        this.flightNumber = flightNumber;
        this.departureAirportCode = departureAirportCode;
        this.destinationAirportCode = destinationAirportCode;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getDepartureAirportCode() {
        return departureAirportCode;
    }

    public void setDepartureAirportCode(String departureAirportCode) {
        this.departureAirportCode = departureAirportCode;
    }

    public String getDestinationAirportCode() {
        return destinationAirportCode;
    }

    public void setDestinationAirportCode(String destinationAirportCode) {
        this.destinationAirportCode = destinationAirportCode;
    }
}