package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"kelly_golang_gui/backend/models"
)

// QueryLogsRange - 로그 쿼리 범위 조회 (POST /api/v3/query_range)
func QueryLogsRange(apiKey string, start int64, end int64, step int, limit int, orderBy []models.OrderByItem) (*models.LogsQueryRangeResponse, error) {
	client := NewSigNozClientWithAPIKey(apiKey)

	// 기본값 설정
	if step == 0 {
		step = 60
	}
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
					DataSource:        "logs", // 고정값
					AggregateOperator: "noop",
					SelectColumns: []models.SelectColumn{
						{ColumnName: "timestamp", Key: "timestamp", DataType: "int64", Type: "tag"},
						{ColumnName: "body", Key: "body", DataType: "string", Type: "tag"},
						{ColumnName: "severity_text", Key: "severity_text", DataType: "string", Type: "tag"},
						{ColumnName: "serviceName", Key: "serviceName", DataType: "string", Type: "tag"},
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
		return nil, errors.New("API 요청에 실패했습니다.")
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
	var result models.LogsQueryRangeResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("JSON 파싱 실패: %w", err)
	}

	return &result, nil
}
