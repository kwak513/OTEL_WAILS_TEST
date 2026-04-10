import { Button, Card, H3, InputGroup } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

export default function SignozAPI() {
  return (
    <div style={{ padding: '20px', paddingTop: '32px', paddingBottom: '32px' }}>
      <H3 style={{ marginBottom: '24px' }}>SigNoz API Key</H3>

      <Card>
        <div style={{ padding: 12, maxWidth: 900 }}>
          <div style={{ marginBottom: 25, textAlign: 'left' }}>Enter your SigNoz API key.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <InputGroup placeholder="" fill style={{ flex: 1, minWidth: 520 }} />
            <Button intent="primary" text="Submit" />
          </div>
        </div>
      </Card>
    </div>
  );
}
