import { ChallengeWorkspace } from '@/components/challenge/challenge-workspace';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1600px] flex-col p-4 md:p-6">
      <ChallengeWorkspace />
    </main>
  );
}
