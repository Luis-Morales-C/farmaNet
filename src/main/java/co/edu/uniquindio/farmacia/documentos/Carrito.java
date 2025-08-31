package co.edu.uniquindio.farmacia.documentos;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Document(collection = "carritos")
public class Carrito implements Serializable {
    @Id
    @EqualsAndHashCode.Include
    private String idCarrito;
    private LocalDateTime fecha;
    private String idCliente; // referencia al cliente
    private List<DetalleCarrito> items;
}

