<script lang="ts">
  import { CodeBlock, CodeBlockContent, CodeBlockLine } from '$registry/bases/base/ui/code-block';
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '$registry/bases/base/ui/sheet';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    Trace,
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceDescription,
    TraceIcon,
    TraceLine,
    TraceTitle,
  } from '$registry/bases/base/ui/trace';

  const files = [
    {
      path: 'app/login/page.tsx',
      added: false,
      additions: 2,
      deletions: 2,
      diff: `@@ -14,7 +14,7 @@ export default async function LoginPage({
   searchParams,
 }) {
   const { next } = await searchParams
-  const redirectTo =
-    next && next.startsWith("/") ? next : "/"
+  const redirectTo = safeRedirect(next)
+
   return <LoginForm redirectTo={redirectTo} />
 }`,
    },
    {
      path: 'lib/auth/redirect.ts',
      added: true,
      additions: 7,
      deletions: 0,
      diff: `@@ -0,0 +1,7 @@
+export function safeRedirect(next: string | undefined) {
+  if (!next || !next.startsWith("/") || next.startsWith("//")) {
+    return "/"
+  }
+
+  return next
+}`,
    },
  ];

  function getVariant(line: string) {
    if (line.startsWith('+')) {
      return 'added';
    }

    if (line.startsWith('-')) {
      return 'removed';
    }

    return 'default';
  }
</script>

<Trace class="max-w-sm">
  <TraceCollapsible open>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <IconPlaceholder lucide="GitCommitHorizontalIcon" tabler="IconGitCommit" hugeicons="GitCommitIcon" phosphor="GitCommitIcon" remixicon="RiGitCommitLine" />
        </TraceIcon>
        <TraceTitle>Committed a1b2c3: Fix the login redirect</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        {#each files as file (file.path)}
          <Sheet>
            <SheetTrigger>
              <TraceLine>
                <TraceIcon>
                  {#if file.added}
                    <IconPlaceholder lucide="FilePlusIcon" tabler="IconFilePlus" hugeicons="FileAddIcon" phosphor="FilePlusIcon" remixicon="RiFileAddLine" />
                  {:else}
                    <IconPlaceholder lucide="FilePenIcon" tabler="IconFilePencil" hugeicons="FileEditIcon" phosphor="NotePencilIcon" remixicon="RiFileEditLine" />
                  {/if}
                </TraceIcon>
                <TraceTitle>
                  {file.added ? 'Added' : 'Edited'} {file.path}
                </TraceTitle>
                <TraceDescription class="font-mono">+{file.additions} −{file.deletions}</TraceDescription>
                <TraceIcon>
                  <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
                </TraceIcon>
              </TraceLine>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle class="font-mono">{file.path}</SheetTitle>
                <SheetDescription>{file.additions} additions, {file.deletions} deletions</SheetDescription>
              </SheetHeader>
              <CodeBlock class="mx-6 mb-6 w-auto">
                <CodeBlockContent>
                  {#each file.diff.split('\n') as line, index (index)}
                    {#if line.startsWith('@@')}
                      <CodeBlockLine class="text-muted-foreground">{line}</CodeBlockLine>
                    {:else}
                      <CodeBlockLine variant={getVariant(line)}>{line.slice(1)}</CodeBlockLine>
                    {/if}
                  {/each}
                </CodeBlockContent>
              </CodeBlock>
            </SheetContent>
          </Sheet>
        {/each}
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
