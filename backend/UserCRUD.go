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

	"encoding/json"

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

// getDB - DB 연결 가져오기
func (u *UserCrud) getDB() (*sql.DB, error) {
	u.mu.Lock()
	defer u.mu.Unlock()
	
	if u.db == nil {
		return nil, fmt.Errorf("DB가 연결되지 않았습니다")
	}
	return u.db, nil
}

// Create - 사용자 생성 (INSERT)
func (u *UserCrud) Create(name, email string, age int) (string, error) {
	// 1. DB 연결 가져오기
	db, err := u.getDB()
	if err != nil {
		return "", err
	}
	
	// 2. SQL 문 작성 (INSERT)
	sql := "INSERT INTO users (name, email, age) VALUES (?, ?, ?)"
	
	// 3. SQL 실행
	res, err := db.Exec(sql, name, email, age)
	if err != nil {
		return "", fmt.Errorf("생성 실패: %v", err)
	}
	
	// 4. 생성된 ID 가져오기
	id, _ := res.LastInsertId()
	
	// 5. 성공 메시지 반환
	return fmt.Sprintf("사용자 생성 성공! (ID: %d)", id), nil
}

// Update - 사용자 수정 (UPDATE)
func (u *UserCrud) Update(id int, name, email string, age int) (string, error) {
	// 1. DB 연결 가져오기
	db, err := u.getDB()
	if err != nil {
		return "", err
	}
	
	// 2. SQL 문 작성 (UPDATE)
	sql := "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?"
	
	// 3. SQL 실행
	res, err := db.Exec(sql, name, email, age, id)
	if err != nil {
		return "", fmt.Errorf("수정 실패: %v", err)
	}
	
	// 4. 수정된 행 개수 가져오기
	rowsAffected, _ := res.RowsAffected()
	
	// 5. 수정된 행이 없으면 오류
	if rowsAffected == 0 {
		return "", fmt.Errorf("ID %d인 사용자를 찾을 수 없습니다", id)
	}

	// 6. 성공 메시지 반환
	return fmt.Sprintf("사용자 수정 성공! (ID: %d)", id), nil
}


// ReadAll - 모든 사용자 조회 (SELECT)
func (u *UserCrud) ReadAll() (string, error) {
	// 1. DB 연결 가져오기
	db, err := u.getDB()
	if err != nil {
		return "", err
	}
	
	// 2. SQL 문 작성 (SELECT)
	sql := "SELECT id, name, email, age, created_at FROM users ORDER BY id"
	
	// 3. SQL 실행 (Query 사용 - SELECT는 Query!)
	rows, err := db.Query(sql)
	if err != nil {
		return "", fmt.Errorf("조회 실패: %v", err)
	}
	defer rows.Close() // 반드시 닫기


	// 4. 결과를 배열로 저장
	var users []map[string]interface{}
	for rows.Next() {
		var id, age int
		var name, email, createdAt string
		
		// 각 행의 데이터 읽기
		if err := rows.Scan(&id, &name, &email, &age, &createdAt); err != nil {
			return "", err
		}
		
		// 맵으로 저장
		users = append(users, map[string]interface{}{
			"id":         id,
			"name":       name,
			"email":      email,
			"age":        age,
			"created_at": createdAt,
		})
	}

	// 5. JSON으로 변환
	result := map[string]interface{}{
		"count": len(users),
		"data":  users,
	}
	jsonData, _ := json.Marshal(result)
	
	// 6. JSON 문자열 반환
	return string(jsonData), nil
}

// Delete - 사용자 삭제 (DELETE)
func (u *UserCrud) Delete(id int) (string, error) {
	// 1. DB 연결 가져오기
	db, err := u.getDB()
	if err != nil {
		return "", err
	}
	
	// 2. SQL 문 작성 (DELETE)
	sql := "DELELTE FROM users WHERE id = ?"
	
	// 3. SQL 실행
	res, err := db.Exec(sql, id)
	if err != nil {
		return "", fmt.Errorf("삭제 실패: %v", err)
	}
	
	// 4. 삭제된 행 개수 가져오기
	rowsAffected, _ := res.RowsAffected()
	
	// 5. 삭제된 행이 없으면 오류
	if rowsAffected == 0 {
		return "", fmt.Errorf("ID %d인 사용자를 찾을 수 없습니다", id)
	}

	// 6. 성공 메시지 반환
	return fmt.Sprintf("사용자 삭제 성공! (ID: %d)", id), nil
}
