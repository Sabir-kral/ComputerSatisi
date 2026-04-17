package az.computer.demo.Entity;

import az.computer.demo.Service.CustomUserDetailsService;
import az.computer.demo.Utility.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth

                        // 🔥 Swagger açıq
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // 🔥 OPTIONS (CORS üçün vacib)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔥 SƏNİN COMMENTLƏRİN (UNCOMMENT EDİLDİ)
                        .requestMatchers(HttpMethod.POST,"/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/customers/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/customers/profile").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/customers/v1").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/customers/v2").authenticated()

                        .requestMatchers(HttpMethod.PUT, "/api/customers/profile").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/customers/delete").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/customers/buy/**").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/computers/add").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/computers/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/computers/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/logs/v1").hasAuthority("ROLE_ADMIN")

                        .anyRequest().permitAll()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .userDetailsService(userDetailsService);

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔥 CORS CONFIG (Cloud Shell əlavə edildi)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "https://8080-cs-cd73c805-74e7-4b92-ab0b-47e3eb1b4c29.cs-europe-west4-fycr.cloudshell.dev"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}