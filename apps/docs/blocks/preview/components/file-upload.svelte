<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/components/card';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/components/empty';
  import { IconPlaceholder } from '@sveltery/components/icons';
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
