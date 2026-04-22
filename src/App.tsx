import { Container, Theme } from '@radix-ui/themes';
import { ChallengeWorkspace } from './components/challenge/challenge-workspace';

export default function App() {
  return (
    <Theme appearance="dark" accentColor="indigo" grayColor="slate" radius="medium" scaling="100%">
      <Container size="4" p="3">
        <ChallengeWorkspace />
      </Container>
    </Theme>
  );
}
