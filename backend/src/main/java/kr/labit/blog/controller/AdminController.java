package kr.labit.blog.controller;

import kr.labit.blog.dto.AdminDTO;
import kr.labit.blog.service.AdminService;
import kr.labit.blog.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final FileUploadService fileUploadService;

    /**
     * 관리자 정보 조회 (공개 API)
     */
    @GetMapping("/info")
    public ResponseEntity<AdminDTO> getAdminInfo() {
        log.info("관리자 정보 조회 요청");

        try {
            AdminDTO adminInfo = adminService.getActiveAdminInfo();
            return ResponseEntity.ok(adminInfo);
        } catch (Exception e) {
            log.error("관리자 정보 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 관리자 조회수 증가 (공개 API)
     */
    @PostMapping("/views/increment")
    public ResponseEntity<Void> incrementViews() {
        log.info("관리자 조회수 증가 요청");

        try {
            adminService.incrementTotalViews();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("조회수 증가 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 관리자 정보 수정 (인증 필요)
     */
    @PutMapping("/info")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminDTO> updateAdminInfo(@RequestBody AdminDTO adminDTO) {
        log.info("관리자 정보 수정 요청: {}", adminDTO.getName());

        try {
            // 현재 활성 관리자의 ID를 가져와서 업데이트
            AdminDTO currentAdmin = adminService.getActiveAdminInfo();
            AdminDTO updatedAdmin = adminService.updateAdminInfo(currentAdmin.getId(), adminDTO);
            return ResponseEntity.ok(updatedAdmin);
        } catch (Exception e) {
            log.error("관리자 정보 수정 실패", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 관리자 프로필 이미지 업로드 (인증 필요)
     */
    @PostMapping("/profile-image")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        log.info("프로필 이미지 업로드 요청: {}", file.getOriginalFilename());

        try {
            String imageUrl = fileUploadService.uploadProfileImage(file);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "이미지 업로드 성공",
                    "imageUrl", imageUrl
            ));

        } catch (IllegalArgumentException e) {
            log.warn("프로필 이미지 업로드 검증 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));

        } catch (Exception e) {
            log.error("프로필 이미지 업로드 실패", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "서버 오류로 인한 업로드 실패"
            ));
        }
    }

    /**
     * 관리자 권한 검증 (인증 필요)
     */
    @GetMapping("/validate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> validateAdminAccess() {
        log.info("관리자 권한 검증 요청");

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "message", "관리자 권한 확인됨"
        ));
    }
}