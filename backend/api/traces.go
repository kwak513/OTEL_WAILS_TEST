package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"kelly_golang_gui/backend/models"
)

// QueryTracesRange - 트레이스 쿼리 범위 조회 (POST /api/v3/query_range)
func QueryTracesRange(limit int, orderBy []models.OrderByItem) (*models.TracesQueryRangeResponse, error) {
	client := NewSigNozClient()

	// 현재 시간과 24시간 전 시간 계산
	now := time.Now()
	twentyFourHoursAgo := now.Add(-24 * time.Hour)

	// 밀리초 단위로 변환
	end := now.UnixMilli()
	start := twentyFourHoursAgo.UnixMilli()
	step := 60 // 고정값

	// 기본값 설정
	if limit == 0 {
		limit = 50
	}
	if orderBy == nil || len(orderBy) == 0 {
		orderBy = []models.OrderByItem{
			{
				ColumnName: "timestamp",
				Order:      "desc",
			},
		}
	}

	// 요청 바디 생성
	reqBody := models.TracesQueryRangeRequest{
		Start: start,
		End:   end,
		Step:  step,
		CompositeQuery: models.CompositeQuery{
			QueryType: "builder",
			PanelType: "list",
			BuilderQueries: map[string]models.BuilderQuery{
				"A": {
					QueryName:         "A",
					DataSource:        "traces", // 고정값
					AggregateOperator: "noop",
					SelectColumns: []models.SelectColumn{
						{ColumnName: "timestamp", Key: "timestamp", DataType: "int64", Type: "tag"},
						{ColumnName: "traceID", Key: "traceID", DataType: "string", Type: "tag"},
						{ColumnName: "serviceName", Key: "serviceName", DataType: "string", Type: "tag"},
						{ColumnName: "name", Key: "name", DataType: "string", Type: "tag"},
						{ColumnName: "durationNano", Key: "durationNano", DataType: "float64", Type: "tag"},
					},
					AggregateAttribute: models.AggregateAttribute{
						ID:       "------false",
						DataType: "empty",
						Key:      "",
						Type:     "",
					},
					TimeAggregation:  "rate",
					SpaceAggregation: "sum",
					Functions:        []interface{}{},
					Filters: models.TracesFilters{
						Items: []interface{}{},
						Op:    "AND",
					},
					Expression:   "A",
					Disabled:     false,
					StepInterval: 60,
					Having:       []interface{}{},
					Limit:        limit,
					OrderBy:      orderBy,
					GroupBy:       []interface{}{},
					Legend:       "",
					ReduceTo:     "avg",
				},
			},
		},
		FormatForWeb: true,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("JSON 마샬링 실패: %w", err)
	}

	// API URL
	apiURL := fmt.Sprintf("%s/api/v3/query_range", client.BaseURL)

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
	var result models.TracesQueryRangeResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("JSON 파싱 실패: %w", err)
	}

	return &result, nil
}
