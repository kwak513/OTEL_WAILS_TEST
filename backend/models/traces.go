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
	Status string               `json:"status"`
	Data   TracesQueryRangeData `json:"data"`
}

type TracesQueryRangeData struct {
	ResultType string                `json:"resultType"`
	Result     []TracesQueryRangeItem `json:"result"`
}

type TracesQueryRangeItem struct {
	QueryName string               `json:"queryName"`
	List      []TracesQueryRangeRow `json:"list"`
}

type TracesQueryRangeRow struct {
	Timestamp string               `json:"timestamp"`
	Data      TracesQueryRangeRowData `json:"data"`
}

type TracesQueryRangeRowData struct {
	DurationNano        float64 `json:"durationNano"`
	Name                string  `json:"name"`
	ResponseStatusCode  string  `json:"responseStatusCode"`
	ServiceName         string  `json:"serviceName"`
	SpanID              string  `json:"spanID"`
	TraceID             string  `json:"traceID"`
}

// TraceDetail - 트레이스 상세 정보 구조체
type TraceDetail struct {
	StartTimestampMillis int64         `json:"startTimestampMillis"`
	EndTimestampMillis   int64         `json:"endTimestampMillis"`
	Columns              []string      `json:"columns"`
	Events               []interface{} `json:"events"` // 복잡한 배열 구조이므로 interface{}로 처리
	IsSubTree            bool          `json:"isSubTree"`
}

// TraceDetailResponse - 트레이스 상세 조회 응답 (배열 형태)
type TraceDetailResponse []TraceDetail

// WaterfallRequest - 트레이스 waterfall 요청 구조체
type WaterfallRequest struct {
	SelectedSpanID              *string  `json:"selectedSpanId"`
	IsSelectedSpanIDUnCollapsed bool     `json:"isSelectedSpanIDUnCollapsed"`
	UncollapsedSpans            []string `json:"uncollapsedSpans"`
}

// WaterfallResponse - 트레이스 waterfall 응답 구조체
type WaterfallResponse struct {
	StartTimestampMillis          int64           `json:"startTimestampMillis"`
	EndTimestampMillis            int64           `json:"endTimestampMillis"`
	DurationNano                  int64           `json:"durationNano"`
	RootServiceName               string          `json:"rootServiceName"`
	RootServiceEntryPoint         string          `json:"rootServiceEntryPoint"`
	TotalSpansCount               int             `json:"totalSpansCount"`
	TotalErrorSpansCount          int             `json:"totalErrorSpansCount"`
	ServiceNameToTotalDurationMap map[string]int  `json:"serviceNameToTotalDurationMap"`
	Spans                         []WaterfallSpan `json:"spans"`
	HasMissingSpans               bool            `json:"hasMissingSpans"`
	UncollapsedSpans              []string        `json:"uncollapsedSpans"`
}

// WaterfallSpan - waterfall span 구조체
type WaterfallSpan struct {
	Timestamp        int64             `json:"timestamp"`
	DurationNano     int64             `json:"durationNano"`
	SpanID           string            `json:"spanId"`
	RootSpanID       string            `json:"rootSpanId"`
	TraceID          string            `json:"traceId"`
	HasError         bool              `json:"hasError"`
	Kind             int               `json:"kind"`
	ServiceName      string            `json:"serviceName"`
	Name             string            `json:"name"`
	References       []SpanReference   `json:"references"`
	TagMap           map[string]string `json:"tagMap"`
	Event            []interface{}     `json:"event"`
	RootName         string            `json:"rootName"`
	StatusMessage    string            `json:"statusMessage"`
	StatusCodeString string            `json:"statusCodeString"`
	SpanKind         string            `json:"spanKind"`
	Children         []WaterfallSpan   `json:"children"`
	SubTreeNodeCount int               `json:"subTreeNodeCount"`
	HasChildren      bool              `json:"hasChildren"`
	HasSiblings      bool              `json:"hasSiblings"`
	Level            int               `json:"level"`
}

// SpanReference - span 참조 구조체
type SpanReference struct {
	TraceID string `json:"traceId"`
	SpanID  string `json:"spanId,omitempty"`
	RefType string `json:"refType"`
}
