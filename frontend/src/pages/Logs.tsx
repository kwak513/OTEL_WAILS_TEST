import { useEffect, useState } from 'react';
import { Card, H3, Tag } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

import { GetLogs } from '../../wailsjs/go/main/App';

type LogRow = {
  timestamp: string;
  serviceName: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  body: string;
};

type LogsApiResponse = {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      queryName: string;
      list: Array<{
        timestamp: string;
        data: {
          body: string;
          severity_text: string;
          serviceName?: string;
          resources_string?: Record<string, string>;
        };
      }>;
    }>;
  };
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
  const SIGNOZ_API_KEY_STORAGE_KEY = 'SIGNOZ_API_KEY';
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const apiKey = (localStorage.getItem(SIGNOZ_API_KEY_STORAGE_KEY) || '').trim();
      if (!apiKey) {
        setError(
          'SigNoz API key is missing. Please enter it on the API key page and click Submit.',
        );
        setRows([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const json = (await GetLogs(apiKey)) as unknown as LogsApiResponse;
        const list = json.data?.result?.[0]?.list ?? [];

        const mapped: LogRow[] = list.map((item) => {
          const levelRaw = (item.data?.severity_text || '').trim().toUpperCase();
          const level: LogRow['level'] =
            levelRaw === 'ERROR' || levelRaw === 'WARN' || levelRaw === 'INFO' || levelRaw === 'DEBUG'
              ? (levelRaw as LogRow['level'])
              : 'INFO';

          const serviceName =
            item.data?.resources_string?.['service.name']?.trim() ||
            item.data?.serviceName?.trim() ||
            '';

          return {
            timestamp: item.timestamp,
            serviceName,
            level,
            body: item.data?.body ?? '',
          };
        });

        setRows(mapped);
      } catch (e) {
        setRows([]);
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    void load();
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
          {rows.length === 0 && !loading && (
            <div style={{ color: '#5c7080', fontSize: 14, padding: 8 }}>There is no data.</div>
          )}

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
                  {row.serviceName || 'N/A'}
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

        {error && (
          <div style={{ padding: 12, paddingTop: 0, color: '#c23030', fontSize: 12 }}>
            {error}
          </div>
        )}
      </Card>
    </div>
  );
}
