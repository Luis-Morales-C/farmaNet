package co.edu.uniquindio.farmacia.dto.global;

public record MensajeDTO<T>(
        boolean error,
        T respuesta
) {
}