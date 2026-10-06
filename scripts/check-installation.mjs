import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const browser = process.argv.includes('--browser');
assert(process.argv.slice(2).every(arg => arg === '--browser'), 'Only --browser is supported');
const browserProject = process.env.SVELTERY_BROWSER_PROJECT;
assert(browserProject === undefined || ['chromium', 'firefox', 'webkit'].includes(browserProject), 'SVELTERY_BROWSER_PROJECT must name an actual configured engine');
const guide = readFileSync(join(repo, 'docs/installation.md'), 'utf8');
const files = [...guide.matchAll(/<!-- consumer-file: ([\w./+-]+) -->\n```[^\n]*\n([\s\S]*?)\n```/gu)];
assert.equal(files.length, 9, 'Expected the nine documented scaffold files');
const remoteFixtureFiles = ['schema.ts', 'form.remote.ts', '+page.svelte', 'type-contract.ts'];
const copyCommands = guide.match(/<!-- consumer-copy -->\n```sh\n([\s\S]*?)\n```/u)?.[1];
assert(copyCommands, 'Expected the documented source-copy commands');
const temporary = mkdtempSync(join(tmpdir(), 'sveltery-installation-'));
const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit' });
try {
  const artifacts = join(temporary, 'artifacts');
  mkdirSync(artifacts);
  run('pnpm', ['--filter', '@sveltery/ui', 'build'], repo);
  run('pnpm', ['--filter', '@sveltery/ui', 'pack', '--pack-destination', artifacts], repo);
  cpSync(join(repo, '.vendor/sveltery-base-0.0.0.tgz'), join(artifacts, 'sveltery-base-0.0.0.tgz'));
  for (const path of ['apps/docs/registry/bases/base/ui/dialog', 'apps/docs/registry/bases/base/ui/button', 'apps/docs/registry/bases/base/ui/textarea', 'apps/docs/registry/bases/base/ui/skeleton', 'apps/docs/registry/bases/base/ui/kbd', 'apps/docs/registry/bases/base/ui/table', 'apps/docs/registry/bases/base/ui/card', 'apps/docs/registry/bases/base/ui/avatar', 'apps/docs/registry/bases/base/ui/label', 'apps/docs/registry/bases/base/ui/alert', 'apps/docs/registry/bases/base/ui/aspect-ratio', 'apps/docs/registry/bases/base/ui/empty', 'apps/docs/registry/bases/base/ui/icons', 'apps/docs/registry/bases/base/ui/example', 'apps/docs/registry/bases/base/ui/separator', 'apps/docs/registry/bases/base/ui/shared', 'apps/docs/registry/styles', 'packages/ui/LICENSE', 'packages/ui/THIRD_PARTY_NOTICES.md']) {
    const destination = join(temporary, 'sveltery-ui', path);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(join(repo, path), destination, { recursive: true });
  }
  for (const mode of ['package', 'copy']) {
    const consumer = join(temporary, mode);
    mkdirSync(consumer);
    cpSync(artifacts, join(consumer, 'vendor'), { recursive: true });
    for (const [, path, content] of files) {
      const destination = join(consumer, path);
      mkdirSync(dirname(destination), { recursive: true });
      writeFileSync(destination, `${content}\n`);
    }
    const basePinRoute = join(consumer, 'src/routes/base-pin/+page.svelte');
    mkdirSync(dirname(basePinRoute), { recursive: true });
    let basePinFixture = readFileSync(join(repo, 'apps/docs/examples/base/BasePinExample.svelte'), 'utf8');
    if (mode === 'copy') {
      basePinFixture = basePinFixture.replaceAll('@sveltery/ui/button', '$lib/components/ui/button').replaceAll('@sveltery/ui/dialog', '$lib/components/ui/dialog').replaceAll('@sveltery/ui/textarea', '$lib/components/ui/textarea');
    }
    writeFileSync(basePinRoute, basePinFixture);
    const buttonRoute = join(consumer, 'src/routes/button/+page.svelte');
    mkdirSync(dirname(buttonRoute), { recursive: true });
    writeFileSync(buttonRoute, readFileSync(join(repo, 'scripts/button-consumer.svelte'), 'utf8'));
    const textareaRoute = join(consumer, 'src/routes/textarea/+page.svelte');
    mkdirSync(dirname(textareaRoute), { recursive: true });
    writeFileSync(textareaRoute, readFileSync(join(repo, 'scripts/textarea-consumer.svelte'), 'utf8'));
    const skeletonRoute = join(consumer, 'src/routes/skeleton/+page.svelte');
    mkdirSync(dirname(skeletonRoute), { recursive: true });
    writeFileSync(skeletonRoute, readFileSync(join(repo, 'scripts/skeleton-consumer.svelte'), 'utf8'));
    const kbdRoute = join(consumer, 'src/routes/kbd/+page.svelte');
    mkdirSync(dirname(kbdRoute), { recursive: true });
    let kbdFixture = readFileSync(join(repo, 'apps/docs/src/routes/kbd/+page.svelte'), 'utf8').replace('../../../examples/base/KbdExample.svelte', './KbdExample.svelte');
    let kbdExample = readFileSync(join(repo, 'apps/docs/examples/base/KbdExample.svelte'), 'utf8');
    if (mode === 'copy') {
      kbdFixture = kbdFixture.replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
      kbdExample = kbdExample.replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
      kbdFixture = kbdFixture.replaceAll('@sveltery/ui/kbd', '$lib/components/ui/kbd');
      kbdExample = kbdExample.replaceAll('@sveltery/ui/kbd', '$lib/components/ui/kbd').replaceAll('@sveltery/ui/example', '$lib/components/ui/example');
    }
    writeFileSync(kbdRoute, kbdFixture);
    writeFileSync(join(dirname(kbdRoute), 'KbdExample.svelte'), kbdExample);
    const tableRoutes = [
      ['table', 'apps/docs/examples/base/TableExample.svelte'],
      ['table-probe', 'apps/docs/examples/base/TableProbe.svelte'],
    ];
    for (const [route, source] of tableRoutes) {
      const routePath = join(consumer, `src/routes/${route}/+page.svelte`);
      mkdirSync(dirname(routePath), { recursive: true });
      let content = readFileSync(join(repo, source), 'utf8');
      if (mode === 'copy') content = content.replaceAll('@sveltery/ui/table', '$lib/components/ui/table').replaceAll('@sveltery/ui/example', '$lib/components/ui/example');
      if (route === 'table') {
        const fixture = readFileSync(join(repo, 'apps/docs/src/routes/table/+page.svelte'), 'utf8').replace('../../../examples/base/TableExample.svelte', './TableExample.svelte');
        writeFileSync(routePath, fixture);
        writeFileSync(join(dirname(routePath), 'TableExample.svelte'), content);
      } else {
        writeFileSync(routePath, content);
      }
    }
    const tableTypesPath = join(consumer, 'src/routes/table-types.ts');
    const tableTypes = readFileSync(join(repo, 'tests/types-table.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/table/index.js', mode === 'copy' ? '$lib/components/ui/table' : '@sveltery/ui/table');
    writeFileSync(tableTypesPath, tableTypes);
    for (const [route, file] of [['avatar', 'AvatarExample.svelte'], ['avatar-probe', 'AvatarProbe.svelte']]) {
      const directory = join(consumer, `src/routes/${route}`); mkdirSync(directory, { recursive: true });
      let source = readFileSync(join(repo, `apps/docs/examples/base/${file}`), 'utf8');
      if (mode === 'copy') source = source.replaceAll('@sveltery/ui/', '$lib/components/ui/');
      writeFileSync(join(directory, file), source);
      let extraImport = ''; let extraBody = '';
      if (route === 'avatar-probe') {
        let renderProbe = readFileSync(join(repo, 'apps/docs/examples/base/AvatarRenderProbe.svelte'), 'utf8');
        if (mode === 'copy') renderProbe = renderProbe.replaceAll('@sveltery/ui/avatar', '$lib/components/ui/avatar');
        writeFileSync(join(directory, 'AvatarRenderProbe.svelte'), renderProbe);
        extraImport = "import AvatarRenderProbe from './AvatarRenderProbe.svelte';"; extraBody = '<AvatarRenderProbe />';
      }
      writeFileSync(join(directory, '+page.svelte'), `<script lang="ts">import { onMount } from 'svelte'; import Example from './${file}'; ${extraImport} let hydrated = $state(false); onMount(() => { hydrated = true; });</script><main class="p-8" data-hydrated={hydrated}><Example />${extraBody}</main>\n`);
    }
    mkdirSync(join(consumer, 'static'), { recursive: true });
    for (const file of ['avatar-probe.png', 'avatar-second.png', 'avatar-error.png']) cpSync(join(repo, 'apps/docs/static', file), join(consumer, 'static', file));
    writeFileSync(join(consumer, 'src/routes/avatar-types.ts'), readFileSync(join(repo, 'tests/avatar-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/avatar/index.js', mode === 'copy' ? '$lib/components/ui/avatar' : '@sveltery/ui/avatar'));
    const cardRoute = join(consumer, 'src/routes/card/+page.svelte');
    mkdirSync(dirname(cardRoute), { recursive: true });
    writeFileSync(cardRoute, readFileSync(join(repo, 'scripts/card-consumer.svelte'), 'utf8'));
    // Actual existing gallery, kept separate from the unchanged seven-part lifecycle route.
    const cardGalleryDirectory = join(consumer, 'src/routes/card-gallery');
    mkdirSync(cardGalleryDirectory, { recursive: true });
    let cardGallery = readFileSync(join(repo, 'apps/docs/examples/base/CardExample.svelte'), 'utf8')
      .replace('../../registry/bases/base/ui/card/index.js', '@sveltery/ui/card');
    if (mode === 'copy') cardGallery = cardGallery.replaceAll('@sveltery/ui/card', '$lib/components/ui/card').replaceAll('@sveltery/ui/button', '$lib/components/ui/button').replaceAll('@sveltery/ui/example', '$lib/components/ui/example');
    writeFileSync(join(cardGalleryDirectory, 'CardExample.svelte'), cardGallery);
    writeFileSync(join(cardGalleryDirectory, '+page.svelte'), `<script lang="ts">import { onMount } from 'svelte'; import CardExample from './CardExample.svelte'; let hydrated = $state(false); onMount(() => { hydrated = true; });</script><main class="p-8" data-hydrated={hydrated}><CardExample /></main>\n`);
    // New canonical two-image gallery beside the unchanged seven-body gallery/probes.
    const cardImageDirectory = join(consumer, 'src/routes/card-images');
    mkdirSync(cardImageDirectory, { recursive: true });
    for (const file of ['CardImageExample.svelte', 'CardImageGalleryFixture.svelte']) {
      let content = readFileSync(join(repo, 'apps/docs/examples/base', file), 'utf8');
      if (mode === 'copy') for (const family of ['card', 'button', 'example', 'icons']) content = content.replaceAll('@sveltery/ui/' + family, '$lib/components/ui/' + family);
      writeFileSync(join(cardImageDirectory, file), content);
    }
    let cardImagePage = readFileSync(join(repo, 'apps/docs/src/routes/card-images/+page.svelte'), 'utf8').replace('../../../examples/base/CardImageGalleryFixture.svelte', './CardImageGalleryFixture.svelte');
    if (mode === 'copy') cardImagePage = cardImagePage.replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
    writeFileSync(join(cardImageDirectory, '+page.svelte'), cardImagePage);
    const cardTypes = readFileSync(join(repo, 'tests/card-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/card/index.js', mode === 'copy' ? '$lib/components/ui/card' : '@sveltery/ui/card');
    writeFileSync(join(consumer, 'src/routes/card-types.ts'), cardTypes);
    for (const [route, source] of [['label', 'apps/docs/examples/base/LabelExample.svelte'], ['label-probe', 'apps/docs/examples/base/LabelProbe.svelte']]) {
      const routePath = join(consumer, `src/routes/${route}/+page.svelte`);
      mkdirSync(dirname(routePath), { recursive: true });
      let content = readFileSync(join(repo, source), 'utf8');
      if (mode === 'copy') content = content.replaceAll('@sveltery/ui/label', '$lib/components/ui/label').replaceAll('@sveltery/ui/textarea', '$lib/components/ui/textarea');
      writeFileSync(routePath, content);
    }
    writeFileSync(join(consumer, 'src/routes/label-types.ts'), readFileSync(join(repo, 'tests/label-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/label/index.js', mode === 'copy' ? '$lib/components/ui/label' : '@sveltery/ui/label'));
    const aspectRatioRoute = join(consumer, 'src/routes/aspect-ratio-probe/+page.svelte');
    mkdirSync(dirname(aspectRatioRoute), { recursive: true });
    let aspectRatioFixture = readFileSync(join(repo, 'scripts/aspect-ratio-consumer.svelte'), 'utf8');
    if (mode === 'copy') aspectRatioFixture = aspectRatioFixture.replaceAll('@sveltery/ui/aspect-ratio', '$lib/components/ui/aspect-ratio');
    writeFileSync(aspectRatioRoute, aspectRatioFixture);
    // The actual four-function gallery is separate from the unchanged wrapper/lifecycle probe.
    const aspectRatioGallery = join(consumer, 'src/routes/aspect-ratio');
    mkdirSync(aspectRatioGallery, { recursive: true });
    let aspectRatioExample = readFileSync(join(repo, 'apps/docs/examples/base/AspectRatioExample.svelte'), 'utf8');
    if (mode === 'copy') aspectRatioExample = aspectRatioExample.replaceAll('@sveltery/ui/aspect-ratio', '$lib/components/ui/aspect-ratio').replaceAll('@sveltery/ui/example', '$lib/components/ui/example');
    writeFileSync(join(aspectRatioGallery, 'AspectRatioExample.svelte'), aspectRatioExample);
    writeFileSync(join(aspectRatioGallery, '+page.svelte'), readFileSync(join(repo, 'apps/docs/src/routes/aspect-ratio/+page.svelte'), 'utf8').replace('../../../examples/base/AspectRatioExample.svelte', './AspectRatioExample.svelte'));
    writeFileSync(join(consumer, 'src/routes/aspect-ratio-types.ts'), readFileSync(join(repo, 'tests/aspect-ratio-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/aspect-ratio/index.js', mode === 'copy' ? '$lib/components/ui/aspect-ratio' : '@sveltery/ui/aspect-ratio'));
    for (const [route, source] of [['alert', 'apps/docs/examples/base/AlertExample.svelte'], ['alert-probe', 'apps/docs/examples/base/AlertProbe.svelte']]) {
      const routePath = join(consumer, `src/routes/${route}/+page.svelte`);
      mkdirSync(dirname(routePath), { recursive: true });
      let content = readFileSync(join(repo, source), 'utf8');
      if (mode === 'copy') content = content.replaceAll('@sveltery/ui/alert', '$lib/components/ui/alert').replaceAll('@sveltery/ui/example', '$lib/components/ui/example').replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
      writeFileSync(routePath, content);
      if (route === 'alert') {
        writeFileSync(join(dirname(routePath), 'AlertExample.svelte'), content);
        let page = readFileSync(join(repo, 'apps/docs/src/routes/alert/+page.svelte'), 'utf8').replace('../../../examples/base/AlertExample.svelte', './AlertExample.svelte');
        if (mode === 'copy') page = page.replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
        writeFileSync(routePath, page);
      }
    }
    writeFileSync(join(consumer, 'src/routes/alert-types.ts'), readFileSync(join(repo, 'tests/alert-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/alert/index.js', mode === 'copy' ? '$lib/components/ui/alert' : '@sveltery/ui/alert'));
    const buttonGalleryDirectory = join(consumer, 'src/routes/button-gallery');
    mkdirSync(buttonGalleryDirectory, { recursive: true });
    for (const file of ['ButtonExample.svelte', 'ButtonGalleryFixture.svelte']) {
      let content = readFileSync(join(repo, 'apps/docs/examples/base', file), 'utf8');
      if (mode === 'copy') for (const family of ['button', 'example', 'icons']) content = content.replaceAll('@sveltery/ui/' + family, '$lib/components/ui/' + family);
      writeFileSync(join(buttonGalleryDirectory, file), content);
    }
    let buttonGalleryPage = readFileSync(join(repo, 'apps/docs/src/routes/button-gallery/+page.svelte'), 'utf8').replace('../../../examples/base/ButtonGalleryFixture.svelte', './ButtonGalleryFixture.svelte');
    if (mode === 'copy') buttonGalleryPage = buttonGalleryPage.replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
    writeFileSync(join(buttonGalleryDirectory, '+page.svelte'), buttonGalleryPage);
    const textareaGalleryDirectory = join(consumer, 'src/routes/textarea-gallery');
    mkdirSync(textareaGalleryDirectory, { recursive: true });
    let textareaGallery = readFileSync(join(repo, 'apps/docs/examples/base/TextareaExample.svelte'), 'utf8');
    if (mode === 'copy') textareaGallery = textareaGallery.replaceAll('@sveltery/ui/textarea', '$lib/components/ui/textarea').replaceAll('@sveltery/ui/example', '$lib/components/ui/example');
    writeFileSync(join(textareaGalleryDirectory, 'TextareaExample.svelte'), textareaGallery);
    writeFileSync(join(textareaGalleryDirectory, '+page.svelte'), readFileSync(join(repo, 'apps/docs/src/routes/textarea-gallery/+page.svelte'), 'utf8').replace('../../../examples/base/TextareaExample.svelte', './TextareaExample.svelte'));
    const emptyGalleryDirectory = join(consumer, 'src/routes/empty');
    mkdirSync(emptyGalleryDirectory, { recursive: true });
    let emptyGallery = readFileSync(join(repo, 'apps/docs/examples/base/EmptyExample.svelte'), 'utf8');
    let emptyPage = readFileSync(join(repo, 'apps/docs/src/routes/empty/+page.svelte'), 'utf8').replace('../../../examples/base/EmptyExample.svelte', './EmptyExample.svelte');
    if (mode === 'copy') {
      emptyGallery = emptyGallery.replaceAll('@sveltery/ui/empty', '$lib/components/ui/empty').replaceAll('@sveltery/ui/example', '$lib/components/ui/example').replaceAll('@sveltery/ui/button', '$lib/components/ui/button').replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
      emptyPage = emptyPage.replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
    }
    writeFileSync(join(emptyGalleryDirectory, 'EmptyExample.svelte'), emptyGallery);
    writeFileSync(join(emptyGalleryDirectory, '+page.svelte'), emptyPage);
    const emptyRoute = join(consumer, 'src/routes/empty-probe/+page.svelte');
    mkdirSync(dirname(emptyRoute), { recursive: true });
    let emptyFixture = readFileSync(join(repo, 'apps/docs/examples/base/EmptyProbe.svelte'), 'utf8');
    if (mode === 'copy') emptyFixture = emptyFixture.replaceAll('@sveltery/ui/empty', '$lib/components/ui/empty');
    writeFileSync(emptyRoute, emptyFixture);
    writeFileSync(join(consumer, 'src/routes/empty-types.ts'), readFileSync(join(repo, 'tests/empty-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/empty/index.js', mode === 'copy' ? '$lib/components/ui/empty' : '@sveltery/ui/empty'));
    const iconsRoute = join(consumer, 'src/routes/icons-consumer/+page.svelte');
    mkdirSync(dirname(iconsRoute), { recursive: true });
    let iconsFixture = readFileSync(join(repo, 'scripts/icons-consumer.svelte'), 'utf8');
    if (mode === 'copy') iconsFixture = iconsFixture.replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons');
    writeFileSync(iconsRoute, iconsFixture);
    writeFileSync(join(consumer, 'src/routes/icons-types.ts'), readFileSync(join(repo, 'tests/icons-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/icons/index.js', mode === 'copy' ? '$lib/components/ui/icons' : '@sveltery/ui/icons').replace('../apps/docs/registry/bases/base/ui/index.js', mode === 'copy' ? '$lib/components/ui/icons' : '@sveltery/ui'));
    const classMergeRoute = join(consumer, 'src/routes/class-merge/+page.svelte');
    mkdirSync(dirname(classMergeRoute), { recursive: true });
    let classMergeFixture = readFileSync(join(repo, 'apps/docs/examples/base/ClassMergeProbe.svelte'), 'utf8');
    if (mode === 'copy') classMergeFixture = classMergeFixture.replaceAll('@sveltery/ui/skeleton', '$lib/components/ui/skeleton');
    writeFileSync(classMergeRoute, classMergeFixture);
    const cssEnvironmentRoute = join(consumer, 'src/routes/css-environment/+page.svelte');
    mkdirSync(dirname(cssEnvironmentRoute), { recursive: true });
    writeFileSync(cssEnvironmentRoute, readFileSync(join(repo, 'apps/docs/examples/base/CssEnvironmentProbe.svelte'), 'utf8').replace('../../../../tests/reference/css-state-witnesses', './css-state-witnesses'));
    cpSync(join(repo, 'tests/reference/css-state-witnesses.ts'), join(dirname(cssEnvironmentRoute), 'css-state-witnesses.ts'));
    const themeRoute = join(consumer, 'src/routes/themes/+page.svelte');
    mkdirSync(dirname(themeRoute), { recursive: true });
    let themeFixture = readFileSync(join(repo, 'apps/docs/examples/base/ThemeExample.svelte'), 'utf8');
    if (mode === 'copy') themeFixture = themeFixture.replaceAll('@sveltery/ui/', '$lib/components/ui/');
    writeFileSync(themeRoute, themeFixture);

    const exampleRoute = join(consumer, 'src/routes/example/+page.svelte');
    mkdirSync(dirname(exampleRoute), { recursive: true });
    let exampleFixture = readFileSync(join(repo, 'apps/docs/examples/base/ExampleProbe.svelte'), 'utf8');
    if (mode === 'copy') exampleFixture = exampleFixture.replaceAll('@sveltery/ui/example', '$lib/components/ui/example');
    writeFileSync(exampleRoute, exampleFixture);
    writeFileSync(join(consumer, 'src/routes/example-types.ts'), readFileSync(join(repo, 'tests/example-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/example/index.js', mode === 'copy' ? '$lib/components/ui/example' : '@sveltery/ui/example'));
    for (const [route, source] of [['separator', 'apps/docs/examples/base/SeparatorExample.svelte'], ['separator-probe', 'apps/docs/examples/base/SeparatorProbe.svelte']]) {
      const routePath = join(consumer, `src/routes/${route}/+page.svelte`);
      mkdirSync(dirname(routePath), { recursive: true });
      let content = readFileSync(join(repo, source), 'utf8');
      if (mode === 'copy') content = content.replaceAll('@sveltery/ui/separator', '$lib/components/ui/separator').replaceAll('@sveltery/ui/example', '$lib/components/ui/example');
      writeFileSync(routePath, content);
    }
    writeFileSync(join(consumer, 'src/routes/separator-types.ts'), readFileSync(join(repo, 'tests/separator-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/separator/index.js', mode === 'copy' ? '$lib/components/ui/separator' : '@sveltery/ui/separator'));
    const consumerManifestPath = join(consumer, 'package.json');
    const consumerManifest = JSON.parse(readFileSync(consumerManifestPath, 'utf8'));
    consumerManifest.dependencies['class-variance-authority'] = '0.7.1';
    writeFileSync(consumerManifestPath, `${JSON.stringify(consumerManifest, null, 2)}\n`);
    if (mode === 'copy') {
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/button'), join(consumer, 'src/lib/components/ui/button'), { recursive: true });
      writeFileSync(buttonRoute, readFileSync(buttonRoute, 'utf8').replace('@sveltery/ui/button', '$lib/components/ui/button'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/textarea'), join(consumer, 'src/lib/components/ui/textarea'), { recursive: true });
      writeFileSync(textareaRoute, readFileSync(textareaRoute, 'utf8').replace('@sveltery/ui/textarea', '$lib/components/ui/textarea'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/skeleton'), join(consumer, 'src/lib/components/ui/skeleton'), { recursive: true });
      writeFileSync(skeletonRoute, readFileSync(skeletonRoute, 'utf8').replaceAll('@sveltery/ui/skeleton', '$lib/components/ui/skeleton').replaceAll('@sveltery/ui/card', '$lib/components/ui/card'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/kbd'), join(consumer, 'src/lib/components/ui/kbd'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/table'), join(consumer, 'src/lib/components/ui/table'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/avatar'), join(consumer, 'src/lib/components/ui/avatar'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/card'), join(consumer, 'src/lib/components/ui/card'), { recursive: true });
      writeFileSync(cardRoute, readFileSync(cardRoute, 'utf8').replaceAll('@sveltery/ui/card', '$lib/components/ui/card'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/label'), join(consumer, 'src/lib/components/ui/label'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/aspect-ratio'), join(consumer, 'src/lib/components/ui/aspect-ratio'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/alert'), join(consumer, 'src/lib/components/ui/alert'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/empty'), join(consumer, 'src/lib/components/ui/empty'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/separator'), join(consumer, 'src/lib/components/ui/separator'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/icons'), join(consumer, 'src/lib/components/ui/icons'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/example'), join(consumer, 'src/lib/components/ui/example'), { recursive: true });
      run('bash', ['-euo', 'pipefail', '-c', copyCommands], consumer);
      const manifestPath = join(consumer, 'package.json');
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      delete manifest.dependencies['@sveltery/ui'];
      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      const cssPath = join(consumer, 'src/app.css');
      writeFileSync(cssPath, readFileSync(cssPath, 'utf8').replace('@sveltery/ui/nova.css', './lib/styles/nova.css').replace('@sveltery/ui/themes.css', './lib/styles/themes.css').replace('@sveltery/ui/styles.css', './lib/styles/styles.css').replace('../node_modules/@sveltery/ui/dist', './lib/components/ui'));
      const pagePath = join(consumer, 'src/routes/+page.svelte');
      writeFileSync(pagePath, readFileSync(pagePath, 'utf8').replace('@sveltery/ui/dialog', '$lib/components/ui/dialog'));
    }
    run('pnpm', ['install'], consumer);
    run('pnpm', ['install', '--frozen-lockfile'], consumer);
    const check = (remote) => {
      run('pnpm', ['check'], consumer);
      run('pnpm', ['build'], consumer);
      if (browser) {
        const args = ['exec', 'playwright', 'test', '--config', 'scripts/installation-playwright.config.ts'];
        if (browserProject) args.push('--project', browserProject);
        execFileSync('pnpm', args, {
          cwd: repo, stdio: 'inherit', env: { ...process.env, SVELTERY_INSTALLATION_CONSUMER: consumer, SVELTERY_INSTALLATION_REMOTE: remote ? '1' : '0' },
        });
      }
      console.log(`Fresh ${mode} ${remote ? 'experimental remote-field fixture' : 'documented consumer'}: types, SSR/client build${browser ? ` and ${browserProject ?? 'all configured engines'} browser` : ''} PASS`);
    };
    check(false);
    // Remote fields are a separate experimental test fixture, not part of the
    // documented consumer scaffold or the production docs application.
    const svelteConfig = join(consumer, 'svelte.config.js');
    const documentedConfig = readFileSync(svelteConfig, 'utf8').replace('export default', "/** @type {import('@sveltejs/kit').Config} */\nconst documentedConfig =");
    writeFileSync(svelteConfig, `${documentedConfig}
export default { ...documentedConfig, compilerOptions: { ...documentedConfig.compilerOptions, experimental: { ...documentedConfig.compilerOptions?.experimental, async: true } }, kit: { ...documentedConfig.kit, experimental: { ...documentedConfig.kit?.experimental, remoteFunctions: true } } };
`);
    const remoteRoute = join(consumer, 'src/routes/remote-fields');
    mkdirSync(remoteRoute, { recursive: true });
    for (const file of remoteFixtureFiles) {
      let content = readFileSync(join(repo, 'apps/docs/remote-fields-fixture/src/routes', file), 'utf8');
      if (mode === 'copy') {
        content = content.replaceAll('@sveltery/ui/textarea', '$lib/components/ui/textarea').replaceAll('@sveltery/ui/button', '$lib/components/ui/button');
      }
      writeFileSync(join(remoteRoute, file), content);
    }
    check(true);
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
