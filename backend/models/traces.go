package models

// TracesQueryRangeRequest - 트레이스 쿼리 범위 요청 구조체
type TracesQueryRangeRequest struct {
	Start          int64          `json:"start"`
	End            int64          `json:"end"`
	Step           int            `json:"step"`
	CompositeQuery CompositeQuery `json:"compositeQuery"`
	FormatForWeb   bool           `json:"formatForWeb"`
}

// CompositeQuery - 복합 쿼리 구조체
type CompositeQuery struct {
	QueryType      string                  `json:"queryType"`
	PanelType      string                  `json:"panelType"`
	BuilderQueries map[string]BuilderQuery `json:"builderQueries"`
}

// BuilderQuery - 빌더 쿼리 구조체
type BuilderQuery struct {
	QueryName          string             `json:"queryName"`
	DataSource         string             `json:"dataSource"`
	AggregateOperator  string             `json:"aggregateOperator"`
	SelectColumns      []SelectColumn     `json:"selectColumns"`
	AggregateAttribute AggregateAttribute `json:"aggregateAttribute"`
	TimeAggregation    string             `json:"timeAggregation"`
	SpaceAggregation   string             `json:"spaceAggregation"`
	Functions          []interface{}      `json:"functions"`
	Filters            TracesFilters      `json:"filters"`
	Expression         string             `json:"expression"`
	Disabled           bool               `json:"disabled"`
	StepInterval       int                `json:"stepInterval"`
	Having             []interface{}      `json:"having"`
	Limit              int                `json:"limit"`
	OrderBy            []OrderByItem      `json:"orderBy"`
	GroupBy            []interface{}      `json:"groupBy"`
	Legend             string             `json:"legend"`
	ReduceTo           string             `json:"reduceTo"`
}

// SelectColumn - 선택 컬럼 구조체
type SelectColumn struct {
	ColumnName string `json:"columnName"`
	Key        string `json:"key"`
	DataType   string `json:"dataType"`
	Type       string `json:"type"`
}

// AggregateAttribute - 집계 속성 구조체
type AggregateAttribute struct {
	ID       string `json:"id"`
	DataType string `json:"dataType"`
	Key      string `json:"key"`
	Type     string `json:"type"`
}

// TracesFilters - 트레이스 필터 구조체
type TracesFilters struct {
	Items []interface{} `json:"items"`
	Op    string        `json:"op"`
}

// OrderByItem - 정렬 항목 구조체
type OrderByItem struct {
	ColumnName string `json:"columnName"`
	Order      string `json:"order"`
}

// TracesQueryRangeResponse - 트레이스 쿼리 범위 응답 구조체
type TracesQueryRangeResponse struct {
	Status string      `json:"status"`
	Data   interface{} `json:"data"` // 응답 구조가 복잡하므로 interface{}로 처리
}
