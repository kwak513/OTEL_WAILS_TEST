import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Card, H3 } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Cell, Column, Table } from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';

import { GetMetrics } from '../../wailsjs/go/main/App';

const DATA_COLUMNS = 5;
const INDEX_COLUMN_WIDTH = 60;
const TOTAL_COLUMNS = 1 + DATA_COLUMNS;
const SIGNOZ_API_KEY_STORAGE_KEY = 'SIGNOZ_API_KEY';

function distributeEqualWidths(totalPx: number, n: number): number[] {
  const base = Math.floor(totalPx / n);
  let remainder = totalPx - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

type MetricsTableRow = {
  metric: string;
  description: string;
  type: string;
  samples: number;
  timeSeries: number;
};

type MetricsApiResponse = {
  status: string;
  data: {
    metrics: Array<{
      metric_name: string;
      description: string;
      type: string;
      unit: string;
      timeseries: number;
      samples: number;
      lastReceived: number;
    }>;
    total: number;
  };
};

export default function Metrics() {
  const [rows, setRows] = useState<MetricsTableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tableWrapRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<Table>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  useLayoutEffect(() => {
    const el = tableWrapRef.current;
    if (!el) return;

    const apply = () => {
      // Subtract a couple pixels to avoid horizontal scrollbar caused by
      // rounding / borders / scrollbars inside the table container.
      const w = Math.floor(el.clientWidth) -16;
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

    // Defer until after paint so the table measures with current widths/styles.
    const raf = requestAnimationFrame(() => {
      t.resizeRowsByApproximateHeight((rowIndex, columnIndex) => {
        const row = rows[rowIndex];
        if (!row) return '';
        switch (columnIndex) {
          case 0:
            return String(rowIndex + 1);
          case 1:
            return row.metric;
          case 2:
            return row.description;
          case 3:
            return row.type;
          case 4:
            return String(row.samples);
          case 5:
            return String(row.timeSeries);
          default:
            return '';
        }
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [rows, columnWidths]);

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
        const json = (await GetMetrics(apiKey)) as unknown as MetricsApiResponse;
        const mapped: MetricsTableRow[] = (json.data?.metrics ?? []).map((m) => ({
          metric: m.metric_name,
          description: m.description ?? '',
          type: m.type ?? '',
          samples: m.samples ?? 0,
          timeSeries: m.timeseries ?? 0,
        }));
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
      <H3 style={{ marginBottom: '24px' }}>Metrics</H3>
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
            columnWidths={columnWidths.length === TOTAL_COLUMNS ? columnWidths : undefined}
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
              name="METRIC"
              cellRenderer={(i) => (
                <Cell wrapText truncated={false} style={{ textAlign: 'left' }}>
                  {rows[i]?.metric ?? ''}
                </Cell>
              )}
            />
            <Column
              name="DESCRIPTION"
              cellRenderer={(i) => (
                <Cell wrapText truncated={false} style={{ textAlign: 'left' }}>
                  {rows[i]?.description ?? ''}
                </Cell>
              )}
            />
            <Column
              name="TYPE"
              cellRenderer={(i) => (
                <Cell wrapText truncated={false} style={{ textAlign: 'left' }}>
                  {rows[i]?.type ?? ''}
                </Cell>
              )}
            />
            <Column
              name="SAMPLES"
              cellRenderer={(i) => (
                <Cell wrapText truncated={false} style={{ textAlign: 'left' }}>
                  {rows[i]?.samples ?? ''}
                </Cell>
              )}
            />
            <Column
              name="TIME SERIES"
              cellRenderer={(i) => (
                <Cell wrapText truncated={false} style={{ textAlign: 'left' }}>
                  {rows[i]?.timeSeries ?? ''}
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
