import * as Progress from '@radix-ui/react-progress';
import { Card, Flex, ScrollArea, Text } from '@radix-ui/themes';
import { StatusBadge } from '../ui/status-badge';
import { useChallengeStore } from '../../store/useChallengeStore';

export function ResultsPanel() {
  const results = useChallengeStore((s) => s.results);
  const runState = useChallengeStore((s) => s.runState);
  const submitState = useChallengeStore((s) => s.submitState);

  if (!results) {
    return (
      <Card>
        <Text color="gray" size="2">
          No runs yet.
        </Text>
      </Card>
    );
  }

  const percent = Math.round((results.passedCount / Math.max(1, results.totalCount)) * 100);

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Flex align="center" justify="between">
          <StatusBadge status={results.status} />
          <Text size="1" color="gray">
            Runner: {runState} · Submit: {submitState}
          </Text>
        </Flex>

        <Progress.Root className="progress-root" value={percent}>
          <Progress.Indicator className="progress-indicator" style={{ transform: `translateX(-${100 - percent}%)` }} />
        </Progress.Root>

        <Text size="2">
          Passed {results.passedCount}/{results.totalCount} tests
        </Text>

        {results.error && <Text size="2" color="red">{results.error}</Text>}

        <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 200 }}>
          <Flex direction="column" gap="2">
            {results.details.map((detail) => (
              <Card key={detail.id} variant="surface">
                <Flex direction="column" gap="1">
                  <Text size="1" weight="bold">
                    {detail.hidden ? 'Hidden test' : 'Input'}: {detail.input}
                  </Text>
                  <Text size="1" color="gray">
                    Expected: {detail.expected}
                  </Text>
                  <Text size="1" color={detail.passed ? 'green' : 'amber'}>
                    Actual: {detail.actual ?? 'n/a'}
                  </Text>
                  {!detail.passed && detail.error && (
                    <Text size="1" color="red">
                      Error: {detail.error}
                    </Text>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        </ScrollArea>
      </Flex>
    </Card>
  );
}
