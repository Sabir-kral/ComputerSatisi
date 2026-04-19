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

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Pre-flight sorğuları (CORS üçün mütləqdir)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Swagger və API sənədləşməsi
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        // 3. İctimai (Public) Endpoint-lər - Qeydiyyat və Giriş
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/customers", "/api/customers/").permitAll() // ✅ 403 həlli
                        .requestMatchers(HttpMethod.GET, "/api/customers/v1", "/api/customers/v2").permitAll()
                        .requestMatchers("/api/users/verify", "/api/users/resendOTP").permitAll()

                        // 4. Test üçün Computers endpoint-lərini açmısan (Ehtiyac yoxdursa hasRole qoyarsan)
                        .requestMatchers(HttpMethod.POST, "/api/computers/add").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/computers/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/computers/**").permitAll()

                        // 5. Avtorizasiya tələb edən endpoint-lər
                        .requestMatchers(HttpMethod.GET, "/api/customers/profile").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/customers/profile").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/customers/delete").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/customers/buy/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/admins/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/admins/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/admins/**").authenticated()

                        // 6. Admin yolları
                        .requestMatchers(HttpMethod.GET, "/api/logs/v1").hasAuthority("ROLE_ADMIN")

                        // 7. Qalan hər şey
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // Hər yerə icazə
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*")); // Bütün header-lərə icazə
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}