package models

// LogsQueryRangeRequest - 로그 쿼리 범위 요청 구조체 (traces와 동일한 구조 사용)

// LogsQueryRangeResponse - 로그 쿼리 범위 응답 구조체
type LogsQueryRangeResponse struct {
	Status string         `json:"status"`
	Data   LogsQueryData  `json:"data"`
}

// LogsQueryData - 로그 쿼리 데이터
type LogsQueryData struct {
	ResultType string           `json:"resultType"`
	Result     []LogsQueryResult `json:"result"`
}

// LogsQueryResult - 로그 쿼리 결과 항목
type LogsQueryResult struct {
	QueryName string      `json:"queryName"`
	List      []LogEntry  `json:"list"`
}

// LogEntry - 로그 엔트리
type LogEntry struct {
	Timestamp string    `json:"timestamp"`
	Data      LogData   `json:"data"`
}

// LogData - 로그 데이터
type LogData struct {
	AttributesBool   map[string]bool   `json:"attributes_bool"`
	AttributesNumber map[string]float64 `json:"attributes_number"`
	AttributesString map[string]string  `json:"attributes_string"`
	Body             string             `json:"body"`
	ID               string             `json:"id"`
	ResourcesString  map[string]string  `json:"resources_string"`
	ServiceName      string             `json:"serviceName"`
	ScopeName        string             `json:"scope_name"`
	ScopeString      map[string]string  `json:"scope_string"`
	ScopeVersion     string             `json:"scope_version"`
	SeverityNumber   int                `json:"severity_number"`
	SeverityText     string             `json:"severity_text"`
	SpanID           string             `json:"span_id"`
	TraceFlags       int                `json:"trace_flags"`
	TraceID          string             `json:"trace_id"`
}
