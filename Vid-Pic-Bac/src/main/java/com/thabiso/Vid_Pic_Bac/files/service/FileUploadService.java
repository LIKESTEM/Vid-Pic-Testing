package com.thabiso.Vid_Pic_Bac.files.service;

import com.thabiso.Vid_Pic_Bac.files.model.FileUploadDTO;
import com.thabiso.Vid_Pic_Bac.files.model.FileUploader;
import com.thabiso.Vid_Pic_Bac.files.repo.FileUploadRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileUploadService {

    @Autowired
    private FileUploadRepo fileUploadRepo;

    public ResponseEntity<String> saveFile(
            String title,
            byte[] imageBytes,
            byte[] videoBytes
    ) {
        FileUploader fileUpload = new FileUploader(title, imageBytes, videoBytes);
        fileUploadRepo.save(fileUpload);
        return new ResponseEntity<>(
                "The files have been persisted successfully!",
                HttpStatus.CREATED
        );
    }

    public List<FileUploadDTO> getAllFiles() {
        return fileUploadRepo.findAll().stream().map(file -> {
            FileUploadDTO dto = new FileUploadDTO();
            dto.setId(file.getId());
            dto.setTitle(file.getTitle());
            dto.setImageUrl("/api/files/" + file.getId() + "/image");
            dto.setVideoUrl("/api/files/" + file.getId() + "/video");
            dto.setLikes(file.getLikes());
            dto.setSubscriptions(file.getSubscriptions());
            dto.setDislikes(file.getDislikes());
            return dto;
        }).collect(Collectors.toList());
    }

    public byte[] getImage(Long id) {
        return fileUploadRepo.findById(id).get().getImage();
    }

    public byte[] getVideo(Long id) {
        return fileUploadRepo.findById(id).get().getVideo();
    }

    public ResponseEntity<String> updateLikes(Long id, boolean isLike) {
        FileUploader file = fileUploadRepo.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        if (isLike) {
            file.setLikes(file.getLikes() + 1);
        } else {
            file.setDislikes(file.getDislikes() + 1);
        }
        fileUploadRepo.save(file);
        return new ResponseEntity<>("Updated successfully!", HttpStatus.OK);
    }

    public ResponseEntity<String> updateSubscriptions(Long id) {
        FileUploader file = fileUploadRepo.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        file.setSubscriptions(file.getSubscriptions() + 1);
        fileUploadRepo.save(file);
        return new ResponseEntity<>("Subscribed successfully!", HttpStatus.OK);
    }

}
