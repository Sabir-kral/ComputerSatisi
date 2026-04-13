package az.computer.demo.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "computers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComputerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price;

    @ManyToMany(mappedBy = "sellingComputers")
    private List<CustomerEntity> sellers;

    @ManyToMany(mappedBy = "boughtComputers")
    private List<CustomerEntity> buyers;
}