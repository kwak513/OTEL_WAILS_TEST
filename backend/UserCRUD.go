package backend

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"

	_"modernc.org/sqlite"

)

const defaultDBPath = "database/mysqlite.db"

// 데이터베이스 연결과 작업
type UserCrud struct{
	ctx context.Context
	mu sync.Mutex
	db *sql.DB
}

// UserCrud 인스턴스
func NewUserCrud() *UserCrud {
	return &UserCrud{}
}

// 앱 시작 시, 자동 실행되는 함수
func (u *UserCrud) Startup(ctx context.Context) {

	u.ctx = ctx

	// DB 연결
	if _, err := u.Connect(defaultDBPath); err != nil {
		log.Printf("[UserCrud] DB 연결 실패: %v", err)
		return
	}

	// 2. 테이블 생성
	if err := u.createTable(); err != nil {
		log.Printf("[UserCrud] 테이블 생성 실패: %v", err)
	} else {
		log.Printf("[UserCrud] 테이블 생성 성공!")
	}
}

// openWithWAL - WAL 모드로 SQLite 데이터베이스 열기
func (u *UserCrud) openWithWAL(dbPath string) (*sql.DB, error) {
	// 경로 정리
	path := strings.TrimSpace(dbPath)
	if path == "" {
		path = defaultDBPath
	}
	
	// 폴더가 없으면 생성
	if dir := filepath.Dir(path); dir != "" && dir != "." {
		os.MkdirAll(dir, 0755)
	}
	
	// SQLite 연결 문자열 (WAL 모드)
	dsn := path + "?_pragma=journal_mode(WAL)&_pragma=busy_timeout(5000)"
	
	// 데이터베이스 열기
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, err
	}
	
	// 연결 테스트
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}
	
	// WAL 모드 설정
	db.Exec("PRAGMA journal_mode=WAL")
	
	return db, nil
}

// Connect - 데이터베이스 연결
func (u *UserCrud) Connect(dbPath string) (string, error) {
	u.mu.Lock()
	defer u.mu.Unlock()
	
	// 기존 연결이 있으면 닫기
	if u.db != nil {
		u.db.Close()
		u.db = nil
	}
	
	// 새 연결 열기
	db, err := u.openWithWAL(dbPath)
	if err != nil {
		return "", err
	}
	
	u.db = db
	return fmt.Sprintf("SQLite 연결 성공: %s", dbPath), nil
}

// createTable - users 테이블 생성
func (u *UserCrud) createTable() error {
	u.mu.Lock()
	defer u.mu.Unlock()
	
	// DB 연결 확인
	if u.db == nil {
		return fmt.Errorf("DB가 연결되지 않았습니다")
	}
	
	// SQL 문 작성
	sql := `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		age INTEGER,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`
	
	// SQL 실행
	_, err := u.db.Exec(sql)
	return err
}