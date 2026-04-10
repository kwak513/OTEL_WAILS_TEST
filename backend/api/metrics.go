package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"kelly_golang_gui/backend/models"
)

// GetMetrics - 메트릭 목록 조회 (POST /api/v1/metrics)
func GetMetrics(limit, offset int, orderBy *models.OrderBy, filters *models.Filters) (*models.MetricsResponse, error) {
	client := NewSigNozClient()

	// 현재 시간과 일주일 전 시간 계산
	now := time.Now()
	oneWeekAgo := now.AddDate(0, 0, -7)

	// 밀리초 단위로 변환
	end := now.UnixMilli()
	start := oneWeekAgo.UnixMilli()

	// 요청 바디 생성
	reqBody := models.MetricsRequest{
		Start:   start,
		End:     end,
		Limit:   limit,
		Offset:  offset,
		OrderBy: orderBy,
		Filters: filters,
	}

	// 기본값 설정
	if reqBody.Limit == 0 {
		reqBody.Limit = 100
	}
	if reqBody.OrderBy == nil {
		reqBody.OrderBy = &models.OrderBy{
			ColumnName: "metric_name",
			Order:      "asc",
		}
	}
	if reqBody.Filters == nil {
		reqBody.Filters = &models.Filters{
			Items: []interface{}{},
			Op:    "AND",
		}
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("JSON 마샬링 실패: %w", err)
	}

	// API URL
	apiURL := fmt.Sprintf("%s/api/v1/metrics", client.BaseURL)

	// HTTP 요청 생성
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("요청 생성 실패: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	client.addAuthHeaders(req)

	// 요청 실행
	resp, err := client.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("요청 실행 실패: %w", err)
	}
	defer resp.Body.Close()

	// 응답 읽기
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("응답 읽기 실패: %w", err)
	}

	// HTTP 상태 코드 확인
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API 오류 (상태 코드: %d): %s", resp.StatusCode, string(body))
	}

	// JSON 파싱
	var result models.MetricsResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("JSON 파싱 실패: %w", err)
	}

	return &result, nil
}
