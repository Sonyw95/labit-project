package kr.labit.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "LAB_ACTIVITY_LOG")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Comment("활동 로그 테이블")
public class LabActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ACTIVITY_LOG_SEQ")
    @SequenceGenerator(name = "ACTIVITY_LOG_SEQ", sequenceName = "LAB_ACTIVITY_LOG_SEQ", allocationSize = 1)
    @Comment("활동 로그 ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    @Comment("사용자")
    private LabUsers user;

    @Column(name = "ACTION", nullable = false, length = 200)
    @Comment("수행한 액션")
    private String action;

    @Column(name = "DESCRIPTION", length = 1000)
    @Comment("액션 설명")
    private String description;

    @Column(name = "STATUS", nullable = false, length = 20)
    @Comment("상태 (success, failed, warning)")
    private String status;

    @Column(name = "IP_ADDRESS", length = 45)
    @Comment("IP 주소")
    private String ipAddress;

    @Column(name = "USER_AGENT", length = 500)
    @Comment("User Agent")
    private String userAgent;

    @Column(name = "RESOURCE_TYPE", length = 50)
    @Comment("리소스 타입")
    private String resourceType;

    @Column(name = "RESOURCE_ID")
    @Comment("리소스 ID")
    private Long resourceId;

    @Column(name = "OLD_VALUE", columnDefinition = "CLOB")
    @Comment("이전 값")
    private String oldValue;

    @Column(name = "NEW_VALUE", columnDefinition = "CLOB")
    @Comment("새로운 값")
    private String newValue;

    @CreatedDate
    @Column(name = "CREATED_DATE", nullable = false, updatable = false)
    @Comment("생성일시")
    private LocalDateTime createdDate;
}