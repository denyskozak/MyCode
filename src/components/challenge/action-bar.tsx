import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button, Card, Flex, Text } from '@radix-ui/themes';
import { codeTemplates } from '../../data/templates';
import { useChallengeStore } from '../../store/useChallengeStore';

export function ActionBar() {
  const runCode = useChallengeStore((s) => s.runCode);
  const submitCode = useChallengeStore((s) => s.submitCode);
  const requestTemplateInsert = useChallengeStore((s) => s.requestTemplateInsert);
  const runState = useChallengeStore((s) => s.runState);
  const submitState = useChallengeStore((s) => s.submitState);

  return (
    <Card>
      <Flex align="center" justify="between" gap="3" wrap="wrap">
        <Flex gap="2" wrap="wrap">
          <Button onClick={() => void runCode()} disabled={runState === 'running'}>
            {runState === 'running' ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={() => void submitCode()} disabled={submitState === 'submitting'} color="green">
            {submitState === 'submitting' ? 'Submitting...' : 'Submit'}
          </Button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="soft">Insert Template</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content">
                {codeTemplates.map((template) => (
                  <DropdownMenu.Item
                    key={template.key}
                    className="dropdown-item"
                    onSelect={() => requestTemplateInsert(template.key)}
                  >
                    {template.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
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
