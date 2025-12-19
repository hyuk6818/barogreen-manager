// src/main/java/com/example/demo/controller/AdminReportController.java
package com.example.demo.controller;

import com.example.demo.controller.dto.DeleteWithReasonRequest;
import com.example.demo.controller.dto.PagedResponse;
import com.example.demo.mapper.NotificationMapper;
import com.example.demo.model.Notification;
import com.example.demo.model.Report;
import com.example.demo.service.CorrectionRequestService;
import com.example.demo.service.ReportService;
import com.example.demo.util.LocalFileStorage;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class AdminReportController {

    private final ReportService reportService;
    private final LocalFileStorage storage;
    private final NotificationMapper notificationMapper;
    private final CorrectionRequestService correctionRequestService;

    public AdminReportController(ReportService reportService,
                                 LocalFileStorage storage,
                                 NotificationMapper notificationMapper,
                                 CorrectionRequestService correctionRequestService) {
        this.reportService = reportService;
        this.storage = storage;
        this.notificationMapper = notificationMapper;
        this.correctionRequestService = correctionRequestService;
    }

    /** 멀티파트로 바로 신고 생성(관리자/테스트용) */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Report create(
            @RequestPart(value = "status",  required = false) String status,
            @RequestPart(value = "address", required = false) String address,
            @RequestPart(value = "note",    required = false) String note,
            @RequestPart(value = "lat") Double lat,
            @RequestPart(value = "lng") Double lng,
            @RequestPart(value = "file",    required = false) MultipartFile file
    ) throws Exception {

        Report r = new Report();
        r.setLat(lat);
        r.setLng(lng);
        r.setStatus(status);
        r.setAddress(address);
        r.setNote(note);

        if (file != null && !file.isEmpty()) {
            String url = storage.save(file);
            r.setPhotoUri(url);
        }
        return reportService.create(r);
    }

    @GetMapping("/{id}")
    public Report get(@PathVariable Long id) {
        return reportService.get(id);
    }

    /** 간단 리스트: q(주소/메모 LIKE), status, page, size */
    @GetMapping
    public PagedResponse<Report> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        List<Report> items = reportService.list(q, status, page, size);
        int total = reportService.count(q, status);
        return new PagedResponse<>(items, total, page, size);
    }


    @PutMapping("/{id}/status")
    public Map<String, Object> updateStatus(@PathVariable Long id,
                                            @RequestBody Map<String, String> body) {
        boolean ok = reportService.updateStatus(id, body.get("status"));
        return Map.of("ok", ok);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        return Map.of("ok", reportService.remove(id));
    }

    @PostMapping("/{reportId}/delete-with-reason")
    public ResponseEntity<?> deleteWithReason(
            @PathVariable Long reportId,
            @RequestBody DeleteWithReasonRequest body
    ) {
        String reason = body.getReason();
        if (reason == null || reason.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("ok", false, "message", "reason is required"));
        }

        // 1) 신고 조회
        Report report = reportService.get(reportId);

        // 1-1) 신고가 이미 삭제된 경우에도 "정정요청 정리"는 성공 처리
        if (report == null) {
            // 정정요청만 정리
            try {
                correctionRequestService.markResolvedByReportId(reportId);
            } catch (Exception ignore) {}

            // 이미 지워진 신고이므로 ok = true 로 반환 (프론트에서는 성공 처리)
            return ResponseEntity.ok(
                    Map.of(
                            "ok", true,
                            "alreadyDeleted", true,
                            "message", "report already deleted, correction requests resolved"
                    )
            );
        }

        // 2) 알림 생성 (reporterId 를 memberLoginId 로 사용)
        String reporterId = report.getReporterId();
        if (reporterId != null
                && !reporterId.isBlank()
                && !"guest".equalsIgnoreCase(reporterId)) { // 게스트는 알림 X
            Notification n = new Notification();
            n.setMemberLoginId(reporterId); // REPORTS.REPORTER_ID 에 로그인ID 저장했다고 가정
            n.setReportId(reportId);
            n.setMessage("회원님이 접수하신 신고가 삭제되었습니다. 사유: " + reason);
            n.setCreatedAt(LocalDateTime.now());
            n.setRead(false);

            notificationMapper.insert(n);
        }

        // 3) 신고 삭제
        boolean ok = reportService.remove(reportId);

        // 4) 관련 정정요청들 RESOLVED 처리
        try {
            correctionRequestService.markResolvedByReportId(reportId);
        } catch (Exception ignore) {}

        return ResponseEntity.ok(Map.of("ok", ok));
    }

}
