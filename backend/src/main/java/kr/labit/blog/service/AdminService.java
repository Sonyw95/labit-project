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
    public AdminDTO updateAdminInfo(Long adminId, AdminDTO adminDTO) {
        log.info("관리자 정보 수정 시작: adminId={}, 수정 데이터={}", adminId, adminDTO.getName());

        // 기존 관리자 조회
        LabAdmin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("관리자를 찾을 수 없습니다. ID: " + adminId));

        // 기존 값 로깅
        log.debug("수정 전 관리자 정보: name={}, role={}, email={}",
                admin.getName(), admin.getRole(), admin.getEmail());

        // 업데이트 가능한 필드들만 수정 (null이 아닌 경우에만)
        if (adminDTO.getName() != null && !adminDTO.getName().trim().isEmpty()) {
            admin.setName(adminDTO.getName().trim());
        }

        if (adminDTO.getRole() != null && !adminDTO.getRole().trim().isEmpty()) {
            admin.setRole(adminDTO.getRole().trim());
        }

        if (adminDTO.getBio() != null) {
            admin.setBio(adminDTO.getBio().trim().isEmpty() ? null : adminDTO.getBio().trim());
        }

        if (adminDTO.getLocation() != null && !adminDTO.getLocation().trim().isEmpty()) {
            admin.setLocation(adminDTO.getLocation().trim());
        }

        // 이메일은 중요한 정보이므로 별도 검증
        if (adminDTO.getEmail() != null && !adminDTO.getEmail().trim().isEmpty()) {
            String newEmail = adminDTO.getEmail().trim();
            // 이메일 형식 검증

            // 다른 관리자가 동일한 이메일을 사용하는지 확인
            if (!admin.getEmail().equals(newEmail) &&
                    adminRepository.findByEmailAndIsActiveTrue(newEmail).isPresent()) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + newEmail);
            }
            admin.setEmail(newEmail);
        }

        if (adminDTO.getGithubUrl() != null) {
            String githubUrl = adminDTO.getGithubUrl().trim();
            admin.setGithubUrl(githubUrl.isEmpty() ? null : githubUrl);
        }

        if (adminDTO.getStartYear() != null) {
            int currentYear = java.time.LocalDate.now().getYear();
            if (adminDTO.getStartYear() < 2000 || adminDTO.getStartYear() > currentYear) {
                throw new IllegalArgumentException(
                        String.format("시작 연도는 2000년부터 %d년 사이여야 합니다.", currentYear));
            }
            admin.setStartYear(adminDTO.getStartYear());
        }

        // 프로필 이미지 URL 업데이트 (있는 경우)
        if (adminDTO.getProfileImage() != null && !adminDTO.getProfileImage().trim().isEmpty()) {
            admin.setProfileImage(adminDTO.getProfileImage().trim());
        }

        // 저장
        LabAdmin savedAdmin = adminRepository.save(admin);

        // 수정 후 값 로깅
        log.info("관리자 정보 수정 완료: name={}, role={}, email={}",
                savedAdmin.getName(), savedAdmin.getRole(), savedAdmin.getEmail());

        return convertToDTO(savedAdmin);
    }
}
