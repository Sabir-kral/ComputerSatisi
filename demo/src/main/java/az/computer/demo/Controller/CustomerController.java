package az.computer.demo.Controller;

import az.computer.demo.Request.CustomerRequest;
import az.computer.demo.Response.ComputerResponse;
import az.computer.demo.Response.CustomerResponse;
import az.computer.demo.Response.MessageResponse;
import az.computer.demo.Service.CustomerService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;

    @PostMapping
    public MessageResponse register(@RequestBody @Valid CustomerRequest studentRequest) throws MessagingException {
        return service.register(studentRequest);
    }

    @PutMapping("/profile")
    public MessageResponse update(@RequestParam String email, @RequestBody CustomerRequest request){
        return service.updateCustomerProfile(request,email);
    }

    @DeleteMapping("/delete")
    public void delete(){
        service.delete();
    }

    @GetMapping("/profile")
    public CustomerResponse profile(){
        return service.profile();
    }
    @GetMapping("/v1")
    public List<ComputerResponse> getAllBought(){
        return service.getAllBought();
    }
    @GetMapping("/v2")
    public List<ComputerResponse> getAll(){
        return service.getAll();
    }



    @PostMapping("/buy/{computerId}")
    public MessageResponse buyComputer(@PathVariable Long computerId){
        return service.buyComputer(computerId);
    }
}