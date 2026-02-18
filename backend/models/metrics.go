package models

// MetricsRequest - 메트릭 조회 요청 구조체
type MetricsRequest struct {
	Start   int64    `json:"start"`
	End     int64    `json:"end"`
	Limit   int      `json:"limit"`
	Offset  int      `json:"offset"`
	OrderBy *OrderBy `json:"orderBy,omitempty"`
	Filters *Filters `json:"filters,omitempty"`
}

// OrderBy - 정렬 옵션
type OrderBy struct {
	ColumnName string `json:"columnName"`
	Order      string `json:"order"` // "asc" or "desc"
}

// Filters - 필터 옵션
type Filters struct {
	Items []interface{} `json:"items"`
	Op    string        `json:"op"` // "AND" or "OR"
}

// MetricsResponse - 메트릭 조회 응답 구조체
type MetricsResponse struct {
	Status string      `json:"status"`
	Data   MetricsData `json:"data"`
}

// MetricsData - 메트릭 데이터
type MetricsData struct {
	Metrics []Metric `json:"metrics"`
	Total   int      `json:"total"`
}

// Metric - 개별 메트릭 정보
type Metric struct {
	MetricName   string `json:"metric_name"`
	Description  string `json:"description"`
	Type         string `json:"type"`
	Unit         string `json:"unit"`
	Timeseries   int    `json:"timeseries"`
	Samples      int    `json:"samples"`
	LastReceived int64  `json:"lastReceived"`
}

// QueryRangeResponse - 쿼리 범위 응답 구조체
type QueryRangeResponse struct {
	Status string         `json:"status"`
	Data   QueryRangeData `json:"data"`
}

// QueryRangeData - 쿼리 범위 데이터
type QueryRangeData struct {
	ResultType string             `json:"resultType"`
	Result     []QueryRangeResult `json:"result"`
	Stats      interface{}        `json:"stats"`
}

// QueryRangeResult - 쿼리 범위 결과 항목
type QueryRangeResult struct {
	Metric map[string]string `json:"metric"`
	Values [][]interface{}   `json:"values"` // [[timestamp, value], ...]
}
