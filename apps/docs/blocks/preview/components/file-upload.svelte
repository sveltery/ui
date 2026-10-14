<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/ui/empty';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

<Card>
  <CardHeader>
    <CardTitle>File Upload</CardTitle>
    <CardDescription>Drag and drop or browse</CardDescription>
  </CardHeader>
  <CardContent>
    <Empty class="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconPlaceholder lucide="UploadCloudIcon" tabler="IconCloudUpload" hugeicons="CloudUploadIcon" phosphor="CloudArrowUpIcon" remixicon="RiUploadCloudLine" />
        </EmptyMedia>
        <EmptyTitle>Upload files</EmptyTitle>
        <EmptyDescription>PNG, JPG, PDF up to 10MB</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Browse Files</Button>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
