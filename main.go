package main

import (
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	"kelly_golang_gui/backend"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure

	userCrud := backend.NewUserCrud()

	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "kelly_golang_gui",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			userCrud.Startup(ctx) // UserCrud 초기화 (DB 연결 + 테이블 생성)
		},
		Bind: []interface{}{
			app,
			userCrud,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
