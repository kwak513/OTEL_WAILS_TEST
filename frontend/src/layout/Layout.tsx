import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Menu, MenuItem, Button } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div style={{ display: 'flex', height: '100vh', margin: 0, padding: 0 }}>
            {/* 왼쪽 사이드바 */}
            <div
                style={{
                    width: collapsed ? '50px' : '200px',
                    backgroundColor: '#30404d',
                    borderRight: '1px solid #1c2127',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    color: '#f5f8fa',
                    transition: 'width 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* 토글 버튼 */}
                <div
                    style={{
                        padding: '10px',
                        display: 'flex',
                        justifyContent: collapsed ? 'center' : 'flex-end',
                        borderBottom: '1px solid #1c2127',
                    }}
                >
                    <Button
                        icon={collapsed ? 'menu' : 'menu-closed'}
                        minimal
                        small
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ color: '#f5f8fa' }}
                    />
                </div>

                {/* 메뉴 */}
                <Menu
                    large={false}
                    style={{
                        backgroundColor: 'transparent',
                        padding: '10px 0',
                        color: '#f5f8fa',
                        flex: 1,
                    }}
                >
                    <MenuItem
                        text={collapsed ? undefined : 'Dashboard'}
                        icon="dashboard"
                        active={isActive('/dashboard')}
                        onClick={() => navigate('/dashboard')}
                        style={{ color: '#f5f8fa' }}
                        title={collapsed ? 'Dashboard' : undefined}
                    />
                    <MenuItem
                        text={collapsed ? undefined : 'Metrics'}
                        icon="timeline-line-chart"
                        active={isActive('/metrics')}
                        onClick={() => navigate('/metrics')}
                        style={{ color: '#f5f8fa' }}
                        title={collapsed ? 'Metrics' : undefined}
                    />
                    <MenuItem
                        text={collapsed ? undefined : 'Traces'}
                        icon="path-search"
                        active={isActive('/traces')}
                        onClick={() => navigate('/traces')}
                        style={{ color: '#f5f8fa' }}
                        title={collapsed ? 'Traces' : undefined}
                    />
                    <MenuItem
                        text={collapsed ? undefined : 'Logs'}
                        icon="console"
                        active={isActive('/logs')}
                        onClick={() => navigate('/logs')}
                        style={{ color: '#f5f8fa' }}
                        title={collapsed ? 'Logs' : undefined}
                    />
                </Menu>
            </div>

            {/* 오른쪽 컨텐츠 영역 */}
            <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#f5f8fa' }}>
                <Outlet />
            </div>
        </div>
    );
}
