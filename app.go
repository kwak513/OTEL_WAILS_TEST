package main

import (
	"context"
	"fmt"
	"time"

	"kelly_golang_gui/backend/api"
	"kelly_golang_gui/backend/models"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetMetrics(apiKey string) (*models.MetricsResponse, error) {
	now := time.Now()
	end := now.UnixMilli()
	start := now.Add(-24 * time.Hour).UnixMilli()

	return api.GetMetrics(
		apiKey,
		start,
		end,
		100,
		0,
		&models.OrderBy{ColumnName: "metric_name", Order: "asc"},
		&models.Filters{Items: []interface{}{}, Op: "AND"},
	)
}
