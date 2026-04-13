package az.computer.demo.Mapper;


import az.computer.demo.Entity.ComputerEntity;
import az.computer.demo.Entity.CustomerEntity;
import az.computer.demo.Response.ComputerResponse;
import az.computer.demo.Response.CustomerResponse;

import java.util.List;
import java.util.stream.Collectors;

public class CustomerMapper {
    public static CustomerResponse toDTO(CustomerEntity entity){
        CustomerResponse response = new CustomerResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setSurname(entity.getSurname());
        response.setEmail(entity.getEmail());
        response.setPassword(entity.getPassword());

        return response;
    }
    public static List<CustomerResponse> toDTOList(List<CustomerEntity> entities){
        return entities.stream().map(CustomerMapper::toDTO).collect(Collectors.toList());
    }
}
