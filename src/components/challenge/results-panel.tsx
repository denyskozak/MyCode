import * as Progress from '@radix-ui/react-progress';
import * as Tabs from '@radix-ui/react-tabs';
import { Card, Flex, ScrollArea, Text } from '@radix-ui/themes';
import { StatusBadge } from '../ui/status-badge';
import { useChallengeStore } from '../../store/useChallengeStore';

export function ResultsPanel() {
  const results = useChallengeStore((s) => s.results);
  const runState = useChallengeStore((s) => s.runState);
  const submitState = useChallengeStore((s) => s.submitState);
  const currentLogs = useChallengeStore((s) => s.currentLogs);

  if (!results) {
    return (
      <Card>
        <Text color="gray" size="2">
          No runs yet.
        </Text>
      </Card>
    );
  }

  const percent = Math.round((results.passed / Math.max(1, results.total)) * 100);

  return (
    <Card>
      <Tabs.Root defaultValue="results">
        <Tabs.List className="tabs-list tabs-list-compact">
          <Tabs.Trigger value="results" className="tabs-trigger">Results</Tabs.Trigger>
          <Tabs.Trigger value="console" className="tabs-trigger">Console ({currentLogs.length})</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="results" className="tabs-content">
          <Flex direction="column" gap="3" pt="3">
            <Flex align="center" justify="between">
              <StatusBadge status={results.status} />
              <Text size="1" color="gray">
                Runner: {runState} · Submit: {submitState}
              </Text>
            </Flex>

            <Progress.Root className="progress-root" value={percent}>
              <Progress.Indicator className="progress-indicator" style={{ transform: `translateX(-${100 - percent}%)` }} />
            </Progress.Root>

            <Flex justify="between" wrap="wrap" gap="2">
              <Text size="2">Passed {results.passed}/{results.total} tests</Text>
              <Text size="2" color="gray">{results.durationMs} ms</Text>
            </Flex>

            {results.errorMessage && (
              <Text size="2" color="red">
                {results.errorMessage}
              </Text>
            )}

            {results.failedCase && (
              <Card variant="surface">
                <Flex direction="column" gap="1">
                  <Text size="1" weight="bold">Failed case input</Text>
                  <Text size="1" color="gray">{String(results.failedCase.input)}</Text>
                  <Text size="1" weight="bold">Expected output</Text>
                  <Text size="1" color="green">{String(results.failedCase.expected)}</Text>
                  <Text size="1" weight="bold">Actual output</Text>
                  <Text size="1" color="amber">{String(results.failedCase.actual)}</Text>
                </Flex>
              </Card>
            )}
          </Flex>
        </Tabs.Content>

        <Tabs.Content value="console" className="tabs-content">
          <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 220 }}>
            <Flex direction="column" gap="2" pt="3">
              {currentLogs.length === 0 ? (
                <Text size="2" color="gray">No console output.</Text>
              ) : (
                currentLogs.map((log, index) => (
                  <Card key={`${log.level}-${index}`} variant="surface">
                    <Text size="1" color={log.level === 'error' ? 'red' : log.level === 'warn' ? 'amber' : 'gray'}>
                      [{log.level}] {log.message}
                    </Text>
                  </Card>
                ))
              )}
            </Flex>
          </ScrollArea>
        </Tabs.Content>
      </Tabs.Root>
    </Card>
  );
}
