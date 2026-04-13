package az.computer.demo.Service;

import az.computer.demo.Entity.ComputerEntity;
import az.computer.demo.Entity.CustomerEntity;
import az.computer.demo.Entity.EmailVerificationEntity;
import az.computer.demo.Entity.UserEntity;
import az.computer.demo.Mapper.ComputerMapper;
import az.computer.demo.Mapper.CustomerMapper;
import az.computer.demo.Repo.*;
import az.computer.demo.Request.CustomerRequest;
import az.computer.demo.Response.ComputerResponse;
import az.computer.demo.Response.CustomerResponse;
import az.computer.demo.Response.MessageResponse;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final CustomerRepo customerRepo;
    private final RoleRepo roleRepo;
    private final EmailVerificationRepository emailVerificationRepository;
    private final MailService mailService;
    private final ComputerRepo computerRepo;
    private final LogService logService;

    public MessageResponse register(CustomerRequest request) throws MessagingException {
        userService.isUserExists(request.getEmail());


        UserEntity user = new UserEntity();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIsVerified(false);


        CustomerEntity customer = new CustomerEntity();
        customer.setName(request.getName());
        customer.setSurname(request.getSurname());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setSellingComputers(new ArrayList<>());
        customer.setBoughtComputers(new ArrayList<>());
        customer.setUser(user);




        userRepo.save(user);
        roleRepo.assignCustomerRoles(user.getId());

        customerRepo.save(customer);



        String code = generateCode();
        EmailVerificationEntity entity = new EmailVerificationEntity();
        entity.setToken(code);
        entity.setUser(user);
        entity.setEmail(request.getEmail());
        entity.setExpirationDate(LocalDateTime.now().plusMinutes(2));
        emailVerificationRepository.save(entity);

        mailService.verifyEmail(request.getEmail(), code);

        MessageResponse response = new MessageResponse();
        response.setMessage("Customer registered successfully");
        response.setIsVerified(false);
        logService.add("Customer registered with email: "+customer.getEmail(),"CUSTOMER_REGISTERED");

        return response;
    }

    public CustomerResponse profile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        CustomerEntity student = customerRepo.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Student not found with email: " + username));
        return CustomerMapper.toDTO(student);
    }

    @Transactional
    public MessageResponse buyComputer(Long computerId) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        CustomerEntity customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        ComputerEntity computer = computerRepo.findById(computerId)
                .orElseThrow(() -> new RuntimeException("Computer not found"));

        if (customer.getBoughtComputers().contains(computer)) {
            throw new RuntimeException("Already bought this computer");
        }

        customer.getBoughtComputers().add(computer);

        customer.getSellingComputers().remove(computer);

        customerRepo.save(customer);

        MessageResponse response = new MessageResponse();
        response.setMessage("Computer bought successfully");
        logService.add("Customer bought pc with email: "+customer.getEmail(),"CUSTOMER_BOUGHT");


        return response;
    }



    public MessageResponse updateCustomerProfile(CustomerRequest request, String email) {
        CustomerEntity customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        UserEntity userEntity = customer.getUser();


        customer.setName(request.getName());
        customer.setSurname(request.getSurname());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        userEntity.setEmail(request.getEmail());
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));


        customerRepo.save(customer);
        userRepo.save(userEntity);
        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessage("Customer Updated");
        logService.add("Customer updated with email: "+customer.getEmail(),"CUSTOMER_UPDATED");

        return messageResponse;
    }

    private String generateCode() {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom random = new SecureRandom();
        for (int i = 0; i < 6; i++) {
            codeBuilder.append(characters.charAt(random.nextInt(characters.length())));
        }
        return codeBuilder.toString();
    }



    @Transactional
    public void delete() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        CustomerEntity customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer Not Found"));


        UserEntity user = customer.getUser();

        roleRepo.deleteByUserId(user.getId());

        customerRepo.delete(customer);

        userRepo.delete(user);
        logService.add("Customer deleted with email: "+user.getEmail(),"CUSTOMER_DELETED");

    }
    public List<ComputerResponse> getAllBought(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        CustomerEntity customer = customerRepo.findByEmail(email).orElseThrow(()->new RuntimeException("Not Found"));
        logService.add("Customer gotAllBought pc with email: "+customer.getEmail(),"CUSTOMER_GET");
        return ComputerMapper.toDTOList(customer.getBoughtComputers());


    }
    public List<ComputerResponse> getAll(){
        return ComputerMapper.toDTOList(computerRepo.findAll());

    }

}
