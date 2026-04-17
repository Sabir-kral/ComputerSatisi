package az.computer.demo.Controller;

import az.computer.demo.Entity.UserEntity;
import az.computer.demo.Exception.CustomException;
import az.computer.demo.Repo.UserRepo;
import az.computer.demo.Request.LoginRequest;
import az.computer.demo.Response.LoginResponse;
import az.computer.demo.Service.CustomUserDetailsService;
import az.computer.demo.Service.LogService;
import az.computer.demo.Utility.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        return jwtUtil.generateToken(userDetails);
    }
}