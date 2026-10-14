<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@sveltery/ui/alert-dialog';
  import { Badge } from '@sveltery/ui/badge';
  import { buttonVariants } from '@sveltery/ui/button';
  import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

<ExampleWrapper>
  <Example title="Card" class="items-center justify-center" containerClass="md:col-span-2">
    <Card class="relative w-full max-w-sm overflow-hidden pt-0">
      <div class="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color"></div>
      <img
        src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Photo by mymind on Unsplash"
        title="Photo by mymind on Unsplash"
        class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
      />
      <CardHeader>
        <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
        <CardDescription>
          Switch to the improved way to explore your data, with natural language. Monitoring will no longer be available
          on the Pro plan in November, 2025
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger class={buttonVariants()}>
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-start"
            />
            Show Dialog
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <IconPlaceholder
                  lucide="BluetoothIcon"
                  tabler="IconBluetooth"
                  hugeicons="BluetoothIcon"
                  phosphor="BluetoothIcon"
                  remixicon="RiBluetoothLine"
                />
              </AlertDialogMedia>
              <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to allow the USB accessory to connect to this device?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
              <AlertDialogAction>Allow</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Badge variant="secondary" class="ml-auto">Warning</Badge>
      </CardFooter>
    </Card>
  </Example>
</ExampleWrapper>
