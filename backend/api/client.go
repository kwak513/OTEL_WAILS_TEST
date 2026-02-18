package api

import (
	"net/http"
	"os"
	"strings"
	"time"
)

// SigNozClient - SigNoz API 클라이언트
type SigNozClient struct {
	BaseURL  string
	APIKey   string
	Client   *http.Client
}

// NewSigNozClient - 새로운 SigNozClient 인스턴스 생성
func NewSigNozClient() *SigNozClient {
	baseURL := os.Getenv("SIGNOZ_BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}
	
	apiKey := os.Getenv("SIGNOZ_API_KEY")
	if apiKey == "" {
		apiKey = "ziMEAJ/R890WVtOV7+jw9JJUmPGnAlm7wSrMjv0vlE0=" // 기본값 (개발용)
	}

	return &SigNozClient{
		BaseURL: strings.TrimSuffix(baseURL, "/"),
		APIKey:  apiKey,
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// addAuthHeaders - 인증 헤더 추가
func (c *SigNozClient) addAuthHeaders(req *http.Request) {
	if c.APIKey != "" {
		req.Header.Set("SIGNOZ-API-KEY", c.APIKey)
	}
}
