import { useEffect, useState } from 'react';
import { Button, Card, H3, InputGroup } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

const SIGNOZ_API_KEY_STORAGE_KEY = 'SIGNOZ_API_KEY';

export default function SignozAPI() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(SIGNOZ_API_KEY_STORAGE_KEY);
    if (saved) setApiKey(saved);
  }, []);

  return (
    <div style={{ padding: '20px', paddingTop: '32px', paddingBottom: '32px' }}>
      <H3 style={{ marginBottom: '24px' }}>SigNoz API Key</H3>

      <Card>
        <div style={{ padding: 12, maxWidth: 900 }}>
          <div style={{ marginBottom: 25, textAlign: 'left' }}>Enter your SigNoz API key.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <InputGroup
              type="password"
              placeholder="SIGNOZ-API-KEY"
              fill
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1, minWidth: 520 }}
            />
            <Button
              intent="primary"
              text="Submit"
              onClick={() => {
                localStorage.setItem(SIGNOZ_API_KEY_STORAGE_KEY, apiKey.trim());
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
