package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"kelly_golang_gui/backend/models"
)

// QueryTracesRange - 트레이스 쿼리 범위 조회 (POST /api/v3/query_range)
func QueryTracesRange(apiKey string, start, end int64, step int, limit int, orderBy []models.OrderByItem) (*models.TracesQueryRangeResponse, error) {
	client := NewSigNozClientWithAPIKey(apiKey)

	// 기본값 설정
	if limit == 0 {
		limit = 50
	}
	if step == 0 {
		step = 60
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
						{ColumnName: "responseStatusCode", Key: "responseStatusCode", DataType: "int64", Type: "tag"},
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
					GroupBy:      []interface{}{},
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

// GetTraceDetail - 트레이스 상세 조회 (GET /api/v1/traces/{traceId})
func GetTraceDetail(traceId string) (*models.TraceDetailResponse, error) {
	client := NewSigNozClient()

	// API URL 생성 (traceId를 URL 경로에 포함)
	apiURL := fmt.Sprintf("%s/api/v1/traces/%s", client.BaseURL, url.PathEscape(traceId))

	// HTTP 요청 생성
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("요청 생성 실패: %w", err)
	}

	// 인증 헤더 추가
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

	// JSON 파싱 (배열 형태)
	var result models.TraceDetailResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("JSON 파싱 실패: %w", err)
	}

	return &result, nil
}

// GetTraceWaterfall - 트레이스 waterfall 조회 (POST /api/v2/traces/waterfall/{traceId})
func GetTraceWaterfall(traceId string, selectedSpanId *string, uncollapsedSpans []string) (*models.WaterfallResponse, error) {
	client := NewSigNozClient()

	// 요청 바디 생성
	reqBody := models.WaterfallRequest{
		SelectedSpanID:              selectedSpanId,
		IsSelectedSpanIDUnCollapsed: false,
		UncollapsedSpans:            uncollapsedSpans,
	}

	// 기본값 설정
	if uncollapsedSpans == nil {
		reqBody.UncollapsedSpans = []string{}
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("JSON 마샬링 실패: %w", err)
	}

	// API URL 생성 (traceId를 URL 경로에 포함)
	apiURL := fmt.Sprintf("%s/api/v2/traces/waterfall/%s", client.BaseURL, url.PathEscape(traceId))

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
	var result models.WaterfallResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("JSON 파싱 실패: %w", err)
	}

	return &result, nil
}
