import { useMemo } from 'react';
import { Card, H3, Tag } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

type LogRow = {
  timestamp: string;
  serviceName: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  body: string;
};

function levelIntent(level: LogRow['level']) {
  switch (level) {
    case 'ERROR':
      return 'danger';
    case 'WARN':
      return 'warning';
    case 'INFO':
      return 'success';
    case 'DEBUG':
    default:
      return 'none';
  }
}

export default function Logs() {
  const rows = useMemo<LogRow[]>(() => {
    return Array.from({ length: 30 }, (_, idx) => {
      const now = Date.now();
      const ts = new Date(now - idx * 15_000).toISOString(); // 15초 간격
      const levels: LogRow['level'][] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
      const level = levels[idx % levels.length];

      const body =
        level === 'ERROR'
          ? `Something failed while processing request id=${1000 + idx}. Retrying...`
          : level === 'WARN'
            ? `Request processed with warnings id=${1000 + idx}.`
            : level === 'DEBUG'
              ? `Debug details for request id=${1000 + idx}: cacheHit=${idx % 2 === 0}.`
              : `Request processed successfully id=${1000 + idx}.`;

      return {
        timestamp: ts,
        serviceName: 'demo-application',
        level,
        body,
      };
    });
  }, []);

  return (
    <div style={{ padding: '20px', paddingTop: '32px', paddingBottom: '32px' }}>
      <H3 style={{ marginBottom: '24px' }}>Logs</H3>

      <Card>
        <div
          style={{
            height: '80vh',
            overflow: 'auto',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {rows.map((row, i) => (
            <Card key={`${row.timestamp}-${i}`} style={{ padding: 12 }}>
              {/* timestamp + service.name */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: 8,
                }}
              >
                <Tag minimal>{row.timestamp}</Tag>
                <Tag intent="primary" minimal>
                  {row.serviceName}
                </Tag>
                <Tag intent={levelIntent(row.level)} minimal>
                  {row.level}
                </Tag>
              </div>

              {/* body */}
              <div
                style={{
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  lineHeight: 1.4,
                }}
              >
                {row.body}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
