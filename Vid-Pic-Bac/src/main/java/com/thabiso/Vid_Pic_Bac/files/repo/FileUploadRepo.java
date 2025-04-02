package com.thabiso.Vid_Pic_Bac.files.repo;

import com.thabiso.Vid_Pic_Bac.files.model.FileUploader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileUploadRepo extends JpaRepository<FileUploader, Long> {
}
