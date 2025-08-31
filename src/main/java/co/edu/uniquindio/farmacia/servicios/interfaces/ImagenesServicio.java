package co.edu.uniquindio.farmacia.servicios.interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ImagenesServicio {
    String subirImagen(MultipartFile imagen) throws Exception;

    void eliminarImagen(String nombreImagen) throws Exception;
}
