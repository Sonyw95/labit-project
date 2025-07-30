package kr.labit.blog.controller;

import kr.labit.blog.dto.AdminDTO;
import kr.labit.blog.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;

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
}