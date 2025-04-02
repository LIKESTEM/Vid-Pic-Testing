package com.thabiso.Vid_Pic_Bac.files.controller;

import com.thabiso.Vid_Pic_Bac.files.model.FileUploadDTO;
import com.thabiso.Vid_Pic_Bac.files.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("title") String title,
            @RequestParam("image") MultipartFile image,
            @RequestParam("video") MultipartFile video,
            @RequestHeader("X-User-Id") String userId  // Retrieve user ID from headers
            ) throws Exception {
        byte[] imageBytes = image.getBytes();
        byte[] videoBytes = video.getBytes();

        System.out.println("Users ID: " + userId);

        return fileUploadService.saveFile(
                title,
                imageBytes,
                videoBytes
        );
    }

    @GetMapping
    public List<FileUploadDTO> getAllFiles() {
        return fileUploadService.getAllFiles();
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(
            @PathVariable Long id
    ) {
        byte[] image = fileUploadService.getImage(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }

    @GetMapping("/{id}/video")
    public ResponseEntity<byte[]> getVideo(
            @PathVariable Long id
    ) {
        byte[] video = fileUploadService.getVideo(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(video);
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<String> likeFile(@PathVariable Long id) {
        return fileUploadService.updateLikes(id, true);
    }

    @PutMapping("/{id}/dislike")
    public ResponseEntity<String> dislikeFile(@PathVariable Long id) {
        return fileUploadService.updateLikes(id, false);
    }

    @PutMapping("/{id}/subscribe")
    public ResponseEntity<String> subscribeFile(@PathVariable Long id) {
        return fileUploadService.updateSubscriptions(id);
    }

}
