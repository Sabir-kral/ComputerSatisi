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
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepo userRepo;
    private final LogService logService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest request ) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            ));
        }catch (BadCredentialsException e) {
            throw new RuntimeException("Daxil edilen melumatlar yanlisdir");
        }

        UserDetails user = userDetailsService.loadUserByUsername(request.getEmail());
        UserEntity users = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        if (users.getIsVerified()==false){
             new CustomException("User Didnt verify","Verify",500);

            return null;

        }
        logService.add("User logined with email: "+users.getEmail(),"USER_LOGINED");



        return new LoginResponse(users.getId(),request.getEmail(), accessToken);
    }
}