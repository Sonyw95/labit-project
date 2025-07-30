package kr.labit.blog.service;

import kr.labit.blog.dto.AdminDTO;
import kr.labit.blog.entity.LabAdmin;
import kr.labit.blog.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminService {

    private final AdminRepository adminRepository;

    /**
     * 활성화된 관리자 정보 조회
     */
    public AdminDTO getActiveAdminInfo() {
        log.debug("활성화된 관리자 정보 조회 시작");

        LabAdmin admin = adminRepository.findActiveAdmin()
                .orElseThrow(() -> new RuntimeException("활성화된 관리자를 찾을 수 없습니다."));

        AdminDTO adminDTO = convertToDTO(admin);
        log.debug("관리자 정보 조회 완료: {}", adminDTO.getName());

        return adminDTO;
    }

    /**
     * 관리자 조회수 증가
     */
    @Transactional
    public void incrementTotalViews() {
        LabAdmin admin = adminRepository.findActiveAdmin()
                .orElseThrow(() -> new RuntimeException("활성화된 관리자를 찾을 수 없습니다."));

        admin.setTotalViews(admin.getTotalViews() + 1);
        adminRepository.save(admin);

        log.debug("관리자 총 조회수 증가: {}", admin.getTotalViews());
    }

    /**
     * Entity를 DTO로 변환
     */
    private AdminDTO convertToDTO(LabAdmin admin) {
        return AdminDTO.builder()
                .id(admin.getId())
                .name(admin.getName())
                .role(admin.getRole())
                .bio(admin.getBio())
                .profileImage(admin.getProfileImage())
                .location(admin.getLocation())
                .email(admin.getEmail())
                .githubUrl(admin.getGithubUrl())
                .totalViews(formatViews(admin.getTotalViews()))
                .startYear(admin.getStartYear())
                .build();
    }

    /**
     * 조회수를 사용자 친화적인 형태로 포맷팅
     */
    private String formatViews(Long views) {
        if (views == null || views == 0) {
            return "0";
        }

        if (views >= 1_000_000) {
            return String.format("%.1fM", views / 1_000_000.0);
        } else if (views >= 1_000) {
            return String.format("%.1fK", views / 1_000.0);
        } else {
            return views.toString();
        }
    }
}
