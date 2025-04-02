package com.thabiso.Vid_Pic_Bac.files.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
@Table(name = "file_upload")
public class FileUploader {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    private byte[] image;

    @Lob
    private byte[] video;

    private int likes = 0;  // New field
    private int dislikes = 0;  // New field
    private Long subscriptions = 0L;  // New field

    public FileUploader(String title, byte[] image, byte[] video) {
        this.title = title;
        this.image = image;
        this.video = video;
    }
}
