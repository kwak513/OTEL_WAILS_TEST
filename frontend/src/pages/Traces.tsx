import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Card, H3 } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Cell, Column, Table } from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';

const DATA_COLUMNS = 6;
const INDEX_COLUMN_WIDTH = 60;
const TOTAL_COLUMNS = 1 + DATA_COLUMNS;

function distributeEqualWidths(totalPx: number, n: number): number[] {
  const base = Math.floor(totalPx / n);
  let remainder = totalPx - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

function centeredHeader(name: string) {
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      {name}
    </div>
  );
}

type TracesTableRow = {
  timestamp: string;
  serviceName: string;
  name: string;
  durationNano: number;
  httpMethod: string;
  responseStatusCode: number;
};

export default function Traces() {
  const rows = useMemo<TracesTableRow[]>(() => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;
    const services = ['frontend', 'backend', 'payments', 'auth'] as const;

    return Array.from({ length: 30 }, (_, idx) => {
      const n = idx + 1;
      const now = Date.now();
      const ts = new Date(now - idx * 60_000).toISOString(); // 1분 간격
      return {
        timestamp: ts,
        serviceName: services[idx % services.length],
        name: `trace-${n}`,
        durationNano: 50_000_000 + n * 3_250_000,
        httpMethod: methods[idx % methods.length],
        responseStatusCode: idx % 10 === 0 ? 500 : 200,
      };
    });
  }, []);

  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

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

  return (
    <div style={{ padding: '20px' }}>
      <H3 style={{ marginBottom: '16px' }}>Traces</H3>
      <Card>
        <div
          ref={tableWrapRef}
          style={{
            position: 'relative',
            height: 'min(60vh, 480px)',
            width: '100%',
          }}
        >
          <Table
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
              nameRenderer={(name) => centeredHeader(name)}
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'center' }}>{i + 1}</Cell>
              )}
            />
            <Column
              name="TIMESTAMP"
              nameRenderer={(name) => centeredHeader(name)}
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'center' }}>
                  {rows[i]?.timestamp ?? ''}
                </Cell>
              )}
            />
            <Column
              name="SERVICE NAME"
              nameRenderer={(name) => centeredHeader(name)}
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'center' }}>
                  {rows[i]?.serviceName ?? ''}
                </Cell>
              )}
            />
            <Column
              name="NAME"
              nameRenderer={(name) => centeredHeader(name)}
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'center' }}>{rows[i]?.name ?? ''}</Cell>
              )}
            />
            <Column
              name="DURATION NANO"
              nameRenderer={(name) => centeredHeader(name)}
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'center' }}>
                  {rows[i]?.durationNano ?? ''}
                </Cell>
              )}
            />
            <Column
              name="HTTP METHOD"
              nameRenderer={(name) => centeredHeader(name)}
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'center' }}>
                  {rows[i]?.httpMethod ?? ''}
                </Cell>
              )}
            />
            <Column
              name="RESPONSE STATUS CODE"
              nameRenderer={(name) => centeredHeader(name)}
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'center' }}>
                  {rows[i]?.responseStatusCode ?? ''}
                </Cell>
              )}
            />
          </Table>

          {rows.length === 0 && (
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
        </div>
      </Card>
    </div>
  );
}
