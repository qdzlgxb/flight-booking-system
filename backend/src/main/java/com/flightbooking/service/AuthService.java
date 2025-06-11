package com.flightbooking.service;

import com.flightbooking.dto.AuthResponse;
import com.flightbooking.dto.LoginRequest;
import com.flightbooking.dto.RegisterRequest;
import com.flightbooking.entity.User;
import com.flightbooking.repository.UserRepository;
import com.flightbooking.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getRole());
    }

    public String register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }

        User user = new User(registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getEmail(),
                registerRequest.getFullName());

        // Set admin role if username contains "admin"
        if (registerRequest.getUsername().toLowerCase().contains("admin")) {
            user.setRole(User.Role.ADMIN);
        }

        userRepository.save(user);

        return "用户注册成功";
    }
}