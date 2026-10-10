'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string; stdout?: (text: string) => void; stderr?: (text: string) => void }) => Promise<any>;
  }
}

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

export interface PyodideRunResult {
  success: boolean;
  output: string;
  error?: string;
  result?: any;
}

export function usePyodide() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Initializing WebAssembly runtime...');
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadScriptAndPyodide() {
      // Load script if not present
      if (!window.loadPyodide && !document.getElementById('pyodide-cdn-script')) {
        const script = document.createElement('script');
        script.id = 'pyodide-cdn-script';
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.async = true;

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN'));
          document.body.appendChild(script);
        });
      }

      if (window.loadPyodide && !pyodideRef.current) {
        setStatusMessage('Loading Python 3.12 WebAssembly engine...');
        try {
          const pyodide = await window.loadPyodide({
            indexURL: PYODIDE_CDN,
          });

          if (isMounted) {
            pyodideRef.current = pyodide;
            setReady(true);
            setLoading(false);
            setStatusMessage('Python 3.12 WebAssembly Engine Ready.');
          }
        } catch (err: any) {
          if (isMounted) {
            setLoading(false);
            setStatusMessage(`Pyodide load failed: ${err.message}`);
          }
        }
      }
    }

    loadScriptAndPyodide();

    return () => {
      isMounted = false;
    };
  }, []);

  const runPython = useCallback(
    async (code: string, setupCode: string = ''): Promise<PyodideRunResult> => {
      if (!pyodideRef.current) {
        return {
          success: false,
          output: '',
          error: 'Python engine is still loading. Please wait a moment...',
        };
      }

      const pyodide = pyodideRef.current;
      const logs: string[] = [];

      try {
        // Redirect stdout/stderr to local logs array
        pyodide.setStdout({
          batched: (text: string) => logs.push(text),
        });
        pyodide.setStderr({
          batched: (text: string) => logs.push(`[ERR] ${text}`),
        });

        if (setupCode) {
          await pyodide.runPythonAsync(setupCode);
        }

        const result = await pyodide.runPythonAsync(code);
        const outputStr = logs.join('\n');

        return {
          success: true,
          output: outputStr,
          result,
        };
      } catch (err: any) {
        return {
          success: false,
          output: logs.join('\n'),
          error: err.message || 'Python execution error',
        };
      }
    },
    []
  );

  return {
    loading,
    ready,
    statusMessage,
    runPython,
  };
}
