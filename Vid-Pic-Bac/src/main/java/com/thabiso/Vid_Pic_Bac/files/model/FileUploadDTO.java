package com.thabiso.Vid_Pic_Bac.files.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class FileUploadDTO {
    private Long id;
    private String title;
    private String imageUrl;
    private String videoUrl;
    private int likes;
    private int dislikes;
    private Long subscriptions;

    public FileUploadDTO(Long id, String title,
                         String imageUrl, String videoUrl,
                         int likes, int dislikes,
                         Long subscriptions
    ) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
        this.likes = likes;
        this.dislikes = dislikes;
        this.subscriptions = subscriptions;
    }
}
