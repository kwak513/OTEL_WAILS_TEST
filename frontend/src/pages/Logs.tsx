import { useMemo } from 'react';
import { Card, H3, Tag } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

type LogRow = {
  timestamp: string;
  serviceName: string;
  body: string;
};

export default function Logs() {
  const rows = useMemo<LogRow[]>(() => {
    return Array.from({ length: 30 }, (_, idx) => {
      const now = Date.now();
      const ts = new Date(now - idx * 15_000).toISOString(); // 15초 간격

      const body =
        idx % 10 === 0
          ? `Something failed while processing request id=${1000 + idx}. Retrying...`
          : `Request processed successfully id=${1000 + idx}.`;

      return {
        timestamp: ts,
        serviceName: 'demo-application',
        body,
      };
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <H3 style={{ marginBottom: '16px' }}>Logs</H3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
    </div>
  );
}
