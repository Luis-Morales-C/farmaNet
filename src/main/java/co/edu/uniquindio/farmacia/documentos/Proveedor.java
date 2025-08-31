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
@Document(collection = "proveedores")
public class Proveedor implements Serializable {
    @Id
    @EqualsAndHashCode.Include
    private String idProveedor;
    private String nombre;
    private String telefono;
    private String direccion;
}
