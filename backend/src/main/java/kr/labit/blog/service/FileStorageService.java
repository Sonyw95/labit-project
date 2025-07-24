package kr.labit.blog.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.file-upload.path:/uploads}")
    private String uploadPath;

    @Value("${app.file-upload.max-size:52428800}")
    private long maxFileSize;

    @Value("${app.file-upload.allowed-types:jpg,jpeg,png,gif,webp,svg,pdf,doc,docx,txt,zip}")
    private String allowedTypes;

    /**
     * 파일 저장
     */
    public String storeFile(MultipartFile file) {
        validateFile(file);

        try {
            // 날짜별 폴더 생성
            String dateFolder = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            Path uploadDir = Paths.get(uploadPath, dateFolder);
            Files.createDirectories(uploadDir);

            // 고유한 파일명 생성
            String originalFileName = file.getOriginalFilename();
            String extension = getFileExtension(originalFileName);
            String uniqueFileName = UUID.randomUUID().toString() + "." + extension;

            // 파일 저장
            Path targetPath = uploadDir.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // 웹에서 접근 가능한 URL 반환
            String fileUrl = "/uploads/" + dateFolder + "/" + uniqueFileName;

            log.info("파일 저장 완료: {} -> {}", originalFileName, fileUrl);
            return fileUrl;

        } catch (Exception e) {
            log.error("파일 저장 중 오류 발생: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("파일 저장에 실패했습니다.", e);
        }
    }

    /**
     * 파일 삭제
     */
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith("/uploads/")) {
                Path filePath = Paths.get(uploadPath, fileUrl.substring("/uploads/".length()));
                Files.deleteIfExists(filePath);
                log.info("파일 삭제 완료: {}", fileUrl);
            }
        } catch (IOException e) {
            log.error("파일 삭제 중 오류 발생: {}", fileUrl, e);
        }
    }

    /**
     * 파일 유효성 검사
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일은 업로드할 수 없습니다.");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("파일 크기가 너무 큽니다. 최대 " + (maxFileSize / 1024 / 1024) + "MB까지 가능합니다.");
        }

        String extension = getFileExtension(file.getOriginalFilename());
        if (!isAllowedFileType(extension)) {
            throw new IllegalArgumentException("지원하지 않는 파일 형식입니다: " + extension);
        }
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }

        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
            return fileName.substring(lastDotIndex + 1).toLowerCase();
        }

        return "";
    }

    /**
     * 허용된 파일 타입 확인
     */
    private boolean isAllowedFileType(String extension) {
        if (extension.isEmpty()) {
            return false;
        }

        String[] allowed = allowedTypes.split(",");
        for (String type : allowed) {
            if (type.trim().equalsIgnoreCase(extension)) {
                return true;
            }
        }

        return false;
    }
}
