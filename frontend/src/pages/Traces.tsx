import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Card, H3 } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Cell, Column, Table } from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';

import { GetTraces } from '../../wailsjs/go/main/App';

const DATA_COLUMNS = 6;
const INDEX_COLUMN_WIDTH = 60;
const TOTAL_COLUMNS = 1 + DATA_COLUMNS;
const SIGNOZ_API_KEY_STORAGE_KEY = 'SIGNOZ_API_KEY';
const POLL_INTERVAL_MS = 7_000;

function distributeEqualWidths(totalPx: number, n: number): number[] {
  const base = Math.floor(totalPx / n);
  let remainder = totalPx - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

type TracesTableRow = {
  timestamp: string;
  serviceName: string;
  name: string;
  durationNano: number;
  httpMethod: string;
  responseStatusCode: string;
};

type TracesApiResponse = {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      queryName: string;
      list: Array<{
        timestamp: string;
        data: {
          durationNano: number;
          name: string;
          responseStatusCode: string;
          serviceName: string;
          spanID: string;
          traceID: string;
        };
      }>;
    }>;
  };
};

function extractHttpMethodFromName(name: string): string {
  const first = (name || '').trim().split(/\s+/)[0]?.toUpperCase();
  if (first === 'GET' || first === 'POST' || first === 'PUT' || first === 'DELETE' || first === 'PATCH' || first === 'HEAD' || first === 'OPTIONS') {
    return first;
  }
  return 'N/A';
}

export default function Traces() {
  const [rows, setRows] = useState<TracesTableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tableWrapRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<Table>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const inFlightRef = useRef(false);

  useLayoutEffect(() => {
    const el = tableWrapRef.current;
    if (!el) return;

    const apply = () => {
      // Subtract a few pixels to avoid horizontal scrollbar caused by
      // rounding / borders / scrollbars inside the table container.
      const w = Math.floor(el.clientWidth) - 16;
      const remaining = w - INDEX_COLUMN_WIDTH;
      if (remaining > 0) {
        setColumnWidths([
          INDEX_COLUMN_WIDTH,
          ...distributeEqualWidths(remaining, DATA_COLUMNS),
        ]);
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t = tableRef.current;
    if (!t) return;

    const raf = requestAnimationFrame(() => {
      t.resizeRowsByApproximateHeight((rowIndex, columnIndex) => {
        const row = rows[rowIndex];
        if (!row) return '';
        switch (columnIndex) {
          case 0:
            return String(rowIndex + 1);
          case 1:
            return row.timestamp;
          case 2:
            return row.serviceName;
          case 3:
            return row.name;
          case 4:
            return String(row.durationNano);
          case 5:
            return row.httpMethod;
          case 6:
            return row.responseStatusCode;
          default:
            return '';
        }
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [rows, columnWidths]);

  useEffect(() => {
    let alive = true;

    async function load({ silent }: { silent: boolean }) {
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      const apiKey = (localStorage.getItem(SIGNOZ_API_KEY_STORAGE_KEY) || '').trim();
      if (!apiKey) {
        if (!alive) return;
        setError(
          'SigNoz API key is missing. Please enter it on the API key page and click Submit.',
        );
        setRows([]);
        inFlightRef.current = false;
        return;
      }

      if (!silent) setLoading(true);
      if (alive) setError(null);
      try {
        const json = (await GetTraces(apiKey)) as unknown as TracesApiResponse;
        const list = json.data?.result?.[0]?.list ?? [];
        const mapped: TracesTableRow[] = list.map((item) => ({
          timestamp: item.timestamp,
          serviceName: item.data?.serviceName ?? '',
          name: item.data?.name ?? '',
          durationNano: Number(item.data?.durationNano ?? 0),
          httpMethod: extractHttpMethodFromName(item.data?.name ?? ''),
          responseStatusCode: (item.data?.responseStatusCode || '').trim() || 'N/A',
        }));
        if (alive) setRows(mapped);
      } catch (e) {
        if (alive) {
          setRows([]);
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (alive) setLoading(false);
        inFlightRef.current = false;
      }
    }

    void load({ silent: false });
    const id = window.setInterval(() => {
      void load({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div style={{ padding: '20px', paddingTop: '32px', paddingBottom: '32px' }}>
      <H3 style={{ marginBottom: '24px' }}>Traces</H3>
      <Card>
        <div
          ref={tableWrapRef}
          style={{
            position: 'relative',
            height: '80vh',
            width: '100%',
          }}
        >
          <Table
            ref={tableRef}
            numRows={rows.length}
            defaultRowHeight={32}
            enableGhostCells={false}
            enableRowHeader={false}
            columnWidths={
              columnWidths.length === TOTAL_COLUMNS ? columnWidths : undefined
            }
          >
            <Column
              name=""
              cellRenderer={(i) => (
                <Cell
                  wrapText
                  truncated={false}
                  style={{ textAlign: 'right' }}
                >
                  {i + 1}
                </Cell>
              )}
            />
            <Column
              name="TIMESTAMP"
              cellRenderer={(i) => (
                <Cell
                  wrapText
                  truncated={false}
                  style={{
                    textAlign: 'left',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  {rows[i]?.timestamp ?? ''}
                </Cell>
              )}
            />
            <Column
              name="SERVICE NAME"
              cellRenderer={(i) => (
                <Cell
                  wrapText
                  truncated={false}
                  style={{
                    textAlign: 'left',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  {rows[i]?.serviceName ?? ''}
                </Cell>
              )}
            />
            <Column
              name="NAME"
              cellRenderer={(i) => (
                <Cell
                  wrapText
                  truncated={false}
                  style={{
                    textAlign: 'left',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  {rows[i]?.name ?? ''}
                </Cell>
              )}
            />
            <Column
              name="DURATION NANO"
              cellRenderer={(i) => (
                <Cell
                  wrapText
                  truncated={false}
                  style={{
                    textAlign: 'left',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  {rows[i]?.durationNano ?? ''}
                </Cell>
              )}
            />
            <Column
              name="HTTP METHOD"
              cellRenderer={(i) => (
                <Cell
                  wrapText
                  truncated={false}
                  style={{
                    textAlign: 'left',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  {rows[i]?.httpMethod ?? ''}
                </Cell>
              )}
            />
            <Column
              name="RESPONSE STATUS CODE"
              cellRenderer={(i) => (
                <Cell
                  wrapText
                  truncated={false}
                  style={{
                    textAlign: 'left',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    color:
                      rows[i]?.responseStatusCode === '500' ? '#c23030' : undefined,
                    fontWeight:
                      rows[i]?.responseStatusCode === '500' ? 600 : undefined,
                  }}
                >
                  {rows[i]?.responseStatusCode ?? 'N/A'}
                </Cell>
              )}
            />
          </Table>

          {rows.length === 0 && !loading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 36,
                color: '#5c7080',
                fontSize: '14px',
                pointerEvents: 'none',
              }}
            >
              There is no data.
            </div>
          )}

          {error && (
            <div
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                bottom: 12,
                color: '#c23030',
                fontSize: '12px',
                pointerEvents: 'none',
              }}
            >
              {error}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
