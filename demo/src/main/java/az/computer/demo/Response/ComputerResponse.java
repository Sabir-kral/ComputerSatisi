package az.computer.demo.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComputerResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
}
