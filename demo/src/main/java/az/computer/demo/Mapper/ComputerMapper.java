package az.computer.demo.Mapper;

import az.computer.demo.Entity.ComputerEntity;
import az.computer.demo.Entity.CustomerEntity;
import az.computer.demo.Response.ComputerResponse;
import az.computer.demo.Response.CustomerResponse;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;


public class ComputerMapper {
    public static ComputerResponse toDTO(ComputerEntity entity){
        ComputerResponse response = new ComputerResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setDescription(entity.getDescription());
        response.setPrice(entity.getPrice());

        return response;
    }

    public static List<ComputerResponse> toDTOList(List<ComputerEntity> entities){
        return entities.stream().map(ComputerMapper::toDTO).collect(Collectors.toList());
    }
}
