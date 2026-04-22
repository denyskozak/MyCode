import * as Dialog from '@radix-ui/react-dialog';
import { Button, Card, Flex, Text } from '@radix-ui/themes';
import { useChallengeStore } from '../../store/useChallengeStore';

export function ActionBar() {
  const runCode = useChallengeStore((s) => s.runCode);
  const submitCode = useChallengeStore((s) => s.submitCode);
  const runState = useChallengeStore((s) => s.runState);
  const submitState = useChallengeStore((s) => s.submitState);

  return (
    <Card>
      <Flex align="center" justify="between" gap="3">
        <Flex gap="2">
          <Button onClick={() => void runCode()} disabled={runState === 'running'}>
            {runState === 'running' ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={() => void submitCode()} disabled={submitState === 'submitting'} color="green">
            {submitState === 'submitting' ? 'Submitting...' : 'Submit'}
          </Button>
        </Flex>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="ghost" size="1">
              Shortcuts
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="dialog-content">
              <Text as="p" weight="bold">
                Keyboard shortcuts
              </Text>
              <Text as="p" size="2" color="gray">
                Cmd/Ctrl + Enter to run. Shift + Enter to submit.
              </Text>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Flex>
    </Card>
  );
}
