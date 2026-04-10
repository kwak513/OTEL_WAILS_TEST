import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Card, H3 } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Cell, Column, Table } from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';

const DATA_COLUMNS = 5;
const INDEX_COLUMN_WIDTH = 60;
const TOTAL_COLUMNS = 1 + DATA_COLUMNS;

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

export default function Metrics() {
  const rows = useMemo<MetricsTableRow[]>(() => {
    return Array.from({ length: 30 }, (_, idx) => {
      const n = idx + 1;
      return {
        metric: `metric${n}`,
        description: `desc${n}`,
        type: n % 3 === 0 ? 'gauge' : n % 3 === 1 ? 'counter' : 'histogram',
        samples: 1000 + n * 37,
        timeSeries: 10 + (n % 7) * 3,
      };
    });
  }, []);
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

  return (
    <div style={{ padding: '20px', paddingTop: '32px' }}>
      <H3 style={{ marginBottom: '16px' }}>Metrics</H3>
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
