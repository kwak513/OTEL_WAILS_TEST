import { useMemo } from 'react';
import { Card, H3 } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Cell, Column, Table } from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';

type MetricsTableRow = {
  metric: string;
  description: string;
  type: string;
  samples: number;
  timeSeries: number;
};

export default function Metrics() {
  const rows = useMemo<MetricsTableRow[]>(() => [], []);

  return (
    <div style={{ padding: '20px' }}>
      <H3 style={{ marginBottom: '16px' }}>Metrics</H3>
      <Card>
        <div
          style={{
            position: 'relative',
            height: 'min(60vh, 480px)',
            width: '100%',
          }}
        >
          <Table numRows={rows.length} defaultRowHeight={32} enableGhostCells={false}>
            <Column
              name="METRIC"
              cellRenderer={(i) => <Cell>{rows[i]?.metric ?? ''}</Cell>}
            />
            <Column
              name="DESCRIPTION"
              cellRenderer={(i) => <Cell>{rows[i]?.description ?? ''}</Cell>}
            />
            <Column
              name="TYPE"
              cellRenderer={(i) => <Cell>{rows[i]?.type ?? ''}</Cell>}
            />
            <Column
              name="SAMPLES"
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'right' }}>
                  {rows[i]?.samples ?? ''}
                </Cell>
              )}
            />
            <Column
              name="TIME SERIES"
              cellRenderer={(i) => (
                <Cell style={{ textAlign: 'right' }}>
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
