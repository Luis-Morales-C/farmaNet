package co.edu.uniquindio.farmacia.servicios.impl;

import co.edu.uniquindio.farmacia.servicios.interfaces.ImagenesServicio;
import com.google.api.gax.paging.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.google.cloud.storage.*;
import com.google.firebase.cloud.StorageClient;
import java.util.UUID;

@Service
public class ImagenesServicioImpl implements ImagenesServicio {
    @Override
    public String subirImagen(MultipartFile multipartFile) throws Exception{
        Bucket bucket = StorageClient.getInstance().bucket();
        String fileName = String.format( "%s-%s", UUID.randomUUID().toString(), multipartFile.getOriginalFilename() );
        Blob blob = bucket.create( fileName, multipartFile.getInputStream(), multipartFile.getContentType() );

        return String.format(
                "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucket.getName(),
                blob.getName()
        );
    }

    @Override
    public void eliminarImagen(String nombreImagenOriginal) throws Exception {
        Bucket bucket = StorageClient.getInstance().bucket();
        Page<Blob> blobs = bucket.list(Storage.BlobListOption.prefix(""));

        for (Blob blob : blobs.iterateAll()) {
            if (blob.getName().endsWith(nombreImagenOriginal)) {
                boolean deleted = blob.delete();
                if (!deleted) {
                    throw new Exception("No se pudo eliminar la imagen, verifica los permisos y el estado del archivo.");
                } else {
                    System.out.println("Imagen eliminada exitosamente.");
                }
                return;
            }
        }

        throw new Exception("La imagen especificada no existe en el almacenamiento o el nombre es incorrecto.");
    }


}