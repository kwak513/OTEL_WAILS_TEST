import { useState, useEffect } from 'react';
import { Button, Card, InputGroup, NumericInput } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Cell, Column, Table2 } from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';
import * as UserCrud from '../../wailsjs/go/backend/UserCrud';

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  created_at: string;
};

export default function UserCRUD() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  // ReadAll - 모든 사용자 조회
  const loadUsers = async () => {
    try {

        setUsers([]);
      const result = await UserCrud.ReadAll();
      const data = JSON.parse(result);
    //   setUsers(data.data || []);
    setUsers([...(data.data || [])]);
      setMessage(`조회 성공: ${data.count}건`);
    } catch (error) {
      setMessage(`조회 실패: ${error}`);
    }
  };

  // 컴포넌트 마운트시 자동 조회
  useEffect(() => {
    loadUsers();
  }, []);

  // Create - 사용자 생성
  const handleCreate = async () => {
    if (!name || !email) {
      setMessage('이름과 이메일을 입력하세요');
      return;
    }
    try {
      const result = await UserCrud.Create(name, email, age);
      setMessage(result);
      setName('');
      setEmail('');
      setAge(0);
      loadUsers(); // 목록 새로고침
    } catch (error) {
      setMessage(`생성 실패: ${error}`);
    }
  };

  // Update - 사용자 수정
  const handleUpdate = async () => {
    if (!editId) return;
    try {
      const result = await UserCrud.Update(editId, name, email, age);
      setMessage(result);
      setEditId(null);
      setName('');
      setEmail('');
      setAge(0);
      loadUsers(); // 목록 새로고침
    } catch (error) {
      setMessage(`수정 실패: ${error}`);
    }
  };

  // Delete - 사용자 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const result = await UserCrud.Delete(id);
      setMessage(result);
      loadUsers(); // 목록 새로고침
    } catch (error) {
      setMessage(`삭제 실패: ${error}`);
    }
  };

  // 수정 모드로 전환
  const startEdit = (user: User) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
  };

  // 테이블 렌더러
  const idCellRenderer = (rowIndex: number) => (
    <Cell>{users[rowIndex].id}</Cell>
  );
  const nameCellRenderer = (rowIndex: number) => (
    <Cell>{users[rowIndex].name}</Cell>
  );
  const emailCellRenderer = (rowIndex: number) => (
    <Cell>{users[rowIndex].email}</Cell>
  );
  const ageCellRenderer = (rowIndex: number) => (
    <Cell>{users[rowIndex].age}</Cell>
  );
  const actionCellRenderer = (rowIndex: number) => (
    <Cell>
      <Button
        small
        intent="warning"
        onClick={() => startEdit(users[rowIndex])}
      >
        수정
      </Button>
      <Button
        small
        intent="danger"
        onClick={() => handleDelete(users[rowIndex].id)}
        style={{ marginLeft: '5px' }}
      >
        삭제
      </Button>
    </Cell>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>사용자 CRUD</h1>

      {message && (
        <Card style={{ marginBottom: '20px', backgroundColor: '#f0f0f0' }}>
          {message}
        </Card>
      )}

      <Card style={{ marginBottom: '20px' }}>
        <h2>{editId ? '사용자 수정' : '사용자 생성'}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <InputGroup
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputGroup
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <NumericInput
            placeholder="나이"
            value={age}
            onValueChange={(v) => setAge(v)}
          />
          {editId ? (
            <div>
              <Button intent="primary" onClick={handleUpdate}>
                수정
              </Button>
              <Button
                onClick={() => {
                  setEditId(null);
                  setName('');
                  setEmail('');
                  setAge(0);
                }}
                style={{ marginLeft: '10px' }}
              >
                취소
              </Button>
            </div>
          ) : (
            <Button intent="primary" onClick={handleCreate}>
              생성
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <h2>사용자 목록</h2>
        <Button
          intent="success"
          onClick={() => {
            console.log('새로고침 버튼 클릭됨');
            loadUsers();
          }}
          style={{ marginBottom: '10px' }}
        >
          새로고침
        </Button>
        <div style={{ height: '400px', overflow: 'auto' }}>
          <Table2 numRows={users.length}>
            <Column name="ID" cellRenderer={idCellRenderer} />
            <Column name="이름" cellRenderer={nameCellRenderer} />
            <Column name="이메일" cellRenderer={emailCellRenderer} />
            <Column name="나이" cellRenderer={ageCellRenderer} />
            <Column name="작업" cellRenderer={actionCellRenderer} />
          </Table2>
        </div>
      </Card>
    </div>
  );
}