import * as Collapsible from '@radix-ui/react-collapsible';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tabs from '@radix-ui/react-tabs';
import { Box, Button, Card, Flex, ScrollArea, Separator, Text } from '@radix-ui/themes';
import { ResultsPanel } from './results-panel';
import { useActiveTask, useChallengeStore } from '../../store/useChallengeStore';

export function TaskPanel() {
  const task = useActiveTask();
  const tasks = useChallengeStore((s) => s.tasks);
  const activeTaskId = useChallengeStore((s) => s.activeTaskId);
  const setActiveTask = useChallengeStore((s) => s.setActiveTask);
  const activeTab = useChallengeStore((s) => s.activeTab);
  const setActiveTab = useChallengeStore((s) => s.setActiveTab);
  const isHintsOpen = useChallengeStore((s) => s.isHintsOpen);
  const setHintsOpen = useChallengeStore((s) => s.setHintsOpen);
  const progress = useChallengeStore((s) => s.progress);

  if (!task) return null;

  return (
    <Card style={{ height: '100%' }}>
      <Flex direction="column" height="100%">
        <Flex align="start" justify="between" p="3" gap="2">
          <Box>
            <Text as="p" size="5" weight="bold">
              {task.title}
            </Text>
            <Text as="p" size="1" color="gray">
              {task.pattern} · {task.difficulty}
            </Text>
            <Text as="p" size="2" mt="1">
              {task.descriptionShort}
            </Text>
          </Box>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="soft">Tasks</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content">
                {tasks.map((item) => (
                  <DropdownMenu.Item key={item.id} className="dropdown-item" onSelect={() => setActiveTask(item.id)}>
                    {item.title} {activeTaskId === item.id ? '✓' : ''}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </Flex>

        <Separator size="4" />

        <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as 'description' | 'results')}>
          <Tabs.List className="tabs-list">
            <Tabs.Trigger value="description" className="tabs-trigger">Mission</Tabs.Trigger>
            <Tabs.Trigger value="results" className="tabs-trigger">Results</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="description" className="tabs-content">
            <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 560 }}>
              <Flex direction="column" gap="3" p="3">
                <Text size="2">{task.narrative}</Text>
                <Card variant="surface">
                  <Text size="2">🎯 {task.objective}</Text>
                </Card>
                <Text size="1" color="gray">
                  Signature: {task.signature}
                </Text>
                <Separator size="4" />

                <Text size="2" weight="bold">
                  Examples
                </Text>
                {task.examples.map((example, idx) => (
                  <Card key={`${task.id}-example-${idx}`} variant="surface">
                    <Text size="1">Input: {example.input}</Text>
                    <Text size="1">Output: {example.output}</Text>
                  </Card>
                ))}

                <Text size="2" weight="bold">
                  Constraints
                </Text>
                <ul>
                  {task.constraints.map((rule) => (
                    <li key={rule}>
                      <Text size="1">• {rule}</Text>
                    </li>
                  ))}
                </ul>

                <Collapsible.Root open={isHintsOpen} onOpenChange={setHintsOpen}>
                  <Collapsible.Trigger asChild>
                    <Button variant="soft" size="1">
                      Hints
                    </Button>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <Flex direction="column" gap="2" mt="2">
                      {task.hints.map((hint) => (
                        <Card key={hint} variant="surface">
                          <Text size="1">{hint}</Text>
                        </Card>
                      ))}
                    </Flex>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Flex>
            </ScrollArea>
          </Tabs.Content>

          <Tabs.Content value="results" className="tabs-content">
            <Box p="3">
              <ResultsPanel />
            </Box>
          </Tabs.Content>
        </Tabs.Root>

        <Separator size="4" />
        <Box p="3">
          <Text size="1" color="gray">
            Session: {progress.completedTaskIds.length}/{tasks.length} solved · {progress.submittedCount} submits · Target {task.solution.time}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}
