<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button } from '$registry/bases/base/ui/button';
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from '$registry/bases/base/ui/drawer';

  const PARAGRAPHS = [
    "Your changes are saved automatically as you type.",
    "Delivery usually takes three to five business days, depending on your location and the shipping method you selected at checkout.",
    "We use your email address for account notifications and order updates. You can change this anytime from your profile settings.",
    "Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to enter a code from your authenticator app in addition to your password. We recommend enabling it if you store payment methods or sensitive information.",
    "By continuing, you agree to our Terms of Service and Privacy Policy. We collect usage data to improve the product, personalize your experience, and troubleshoot issues. You can export or delete your data at any time from the account settings page. Third-party integrations may have their own policies, and you should review them before connecting external services.",
    "Refunds are processed within five to ten business days after we receive your return. Items must be unused and in their original packaging to qualify. Shipping costs are non-refundable unless the return is due to our error or a defective product. Once approved, the refund is issued to your original payment method; credit card refunds may take an additional billing cycle to appear on your statement. If you paid with store credit, the balance is restored to your account immediately. Contact support if you haven't received your refund after two weeks.",
    "Last updated March 12, 2026.",
    "Upgrade to Pro for unlimited projects, priority support, and advanced analytics. Cancel anytime from billing settings.",
    "You haven't verified your email yet. Check your inbox for a confirmation link—we sent it when you signed up. The link expires after 24 hours, but you can request a new one below.",
    "API requests are rate-limited to 1,000 calls per hour on the free plan. Exceeding the limit returns a 429 response with a Retry-After header. Upgrade to a paid plan for higher limits and dedicated support. Webhook deliveries are retried up to three times with exponential backoff if your endpoint returns a non-2xx status.",
    "No payment method on file.",
    "Our design team rebuilt the checkout flow last quarter after interviews with forty-two customers. The biggest friction point was surprise fees at the final step, so we moved shipping and tax estimates earlier in the process. Early tests show a twelve percent drop in cart abandonment. We're still rolling out the update region by region, and you may see the old flow until your account is migrated.",
  ];

  const DRAWER_SIDES = ['up', 'right', 'down', 'left'] as const;
  const SNAP_POINTS = ['31rem', 1];
  const panel = 'bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full';
</script>

{#snippet paragraphs(length: number)}
  {#each { length } as _, index (index)}
    <p class="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">{PARAGRAPHS[index % PARAGRAPHS.length]}</p>
  {/each}
{/snippet}

{#snippet DrawerDemo()}
  <Example title="Demo">
    <div class="flex flex-wrap gap-2">
      <Drawer>
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Open Drawer
        </DrawerTrigger>
        <DrawerContent>
          <div class="p-4">
            <div class="h-80 w-full bg-muted"></div>
          </div>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Header
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Make changes to your profile here. Click save when you&apos;re done.</DrawerDescription>
          </DrawerHeader>
          <div class="p-4">
            <div class="h-80 w-full bg-muted"></div>
          </div>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Footer
        </DrawerTrigger>
        <DrawerContent>
          <div class="p-4">
            <div class="h-80 w-full bg-muted"></div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Header and Footer
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Make changes to your profile here. Click save when you&apos;re done.</DrawerDescription>
          </DrawerHeader>
          <div class="p-4">
            <div class="h-80 w-full bg-muted"></div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Edge to Edge
        </DrawerTrigger>
        <DrawerContent>
          <div class="h-80 w-full bg-blue-200"></div>
        </DrawerContent>
      </Drawer>
    </div>
  </Example>
{/snippet}

{#snippet DrawerSwipeHandleExample()}
  <Example title="Swipe Handle">
    <div class="flex flex-wrap gap-2">
      {#each DRAWER_SIDES as side (side)}
        <Drawer swipeDirection={side} showSwipeHandle>
          <DrawerTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" class="capitalize" {...props}>{@render content?.()}</Button>{/snippet}
            {side}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle class="capitalize">Drawer</DrawerTitle>
              <DrawerDescription>Drawer with a swipe handle.</DrawerDescription>
            </DrawerHeader>
            <div class="flex-1 p-4">
              <div class={panel}></div>
            </div>
          </DrawerContent>
        </Drawer>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet DrawerPosition()}
  <Example title="Position">
    <div class="flex flex-wrap gap-2">
      {#each DRAWER_SIDES as side (side)}
        <Drawer swipeDirection={side}>
          <DrawerTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" class="capitalize" {...props}>{@render content?.()}</Button>{/snippet}
            {side}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            </DrawerHeader>
            <div class="flex-1 p-4">
              <div class={panel}></div>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet DrawerCustomWidthAndHeight()}
  <Example title="Custom Width and Height">
    <div class="flex flex-wrap gap-2">
      <Drawer swipeDirection="down">
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Down
        </DrawerTrigger>
        <DrawerContent class="data-[swipe-direction=down]:h-64">
          <DrawerHeader>
            <DrawerTitle>Down drawer</DrawerTitle>
            <DrawerDescription>Drawer with a custom height.</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 scroll-fade scrollbar-thin overflow-y-auto p-4">
            {@render paragraphs(10)}
          </div>
          <DrawerFooter>
            <DrawerClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer swipeDirection="up">
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Up
        </DrawerTrigger>
        <DrawerContent class="data-[swipe-direction=up]:h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>Up drawer</DrawerTitle>
            <DrawerDescription>Drawer with a custom height.</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 scroll-fade overflow-y-auto p-4">
            {@render paragraphs(10)}
          </div>
          <DrawerFooter>
            <DrawerClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer swipeDirection="left">
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Left
        </DrawerTrigger>
        <DrawerContent class="data-[swipe-direction=left]:w-xl">
          <DrawerHeader>
            <DrawerTitle>Left drawer</DrawerTitle>
            <DrawerDescription>Drawer with a custom width.</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 scroll-fade overflow-y-auto p-4">
            {@render paragraphs(10)}
          </div>
          <DrawerFooter>
            <DrawerClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer swipeDirection="right">
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Right
        </DrawerTrigger>
        <DrawerContent class="data-[swipe-direction=right]:w-xs">
          <DrawerHeader>
            <DrawerTitle>Right drawer</DrawerTitle>
            <DrawerDescription>Drawer with a custom width.</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 scroll-fade overflow-y-auto p-4">
            {@render paragraphs(10)}
          </div>
          <DrawerFooter>
            <DrawerClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  </Example>
{/snippet}

{#snippet DrawerScrollable()}
  <Example title="Scrollable Content">
    <div class="flex flex-wrap gap-2">
      {#each DRAWER_SIDES as side (side)}
        <Drawer swipeDirection={side}>
          <DrawerTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" class="capitalize" {...props}>{@render content?.()}</Button>{/snippet}
            {side}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            </DrawerHeader>
            <div class="flex-1 scroll-fade overflow-y-auto p-4">
              {@render paragraphs(20)}
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet DrawerSnapPoints()}
  <Example title="Snap Points">
    <Drawer snapPoints={SNAP_POINTS} showSwipeHandle>
      <DrawerTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Open Snap Drawer
      </DrawerTrigger>
      <DrawerContent class="max-h-[calc(100dvh-1rem)]">
        <DrawerHeader>
          <DrawerTitle>Snap points</DrawerTitle>
          <DrawerDescription>Drag the drawer to snap between a compact peek and a near full-height view.</DrawerDescription>
        </DrawerHeader>
        <div class="grid flex-1 scroll-fade gap-3 overflow-y-auto p-4">
          {#each { length: 16 } as _, index (index)}
            <div class="h-12 bg-muted"></div>
          {/each}
        </div>
      </DrawerContent>
    </Drawer>
  </Example>
{/snippet}

{#snippet DrawerNested()}
  <Example title="Nested">
    <div class="flex flex-wrap gap-2">
      {#each DRAWER_SIDES as side (side)}
        <Drawer swipeDirection={side} showSwipeHandle>
          <DrawerTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" class="capitalize" {...props}>{@render content?.()}</Button>{/snippet}
            {side}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle class="capitalize">{side} drawer</DrawerTitle>
              <DrawerDescription>Open another drawer from the same direction.</DrawerDescription>
            </DrawerHeader>
            <div class="flex-1 p-4">
              <div class={panel}></div>
            </div>
            <DrawerFooter>
              <Drawer swipeDirection={side}>
                <DrawerTrigger>
                  {#snippet render(props, _state, content)}<Button {...props}>{@render content?.()}</Button>{/snippet}
                  Open nested drawer
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Nested drawer</DrawerTitle>
                    <DrawerDescription>The parent drawer stays mounted behind this one.</DrawerDescription>
                  </DrawerHeader>
                  <div class="flex-1 p-4">
                    <div class={panel}></div>
                  </div>
                  <DrawerFooter>
                    <Drawer swipeDirection={side}>
                      <DrawerTrigger>
                        {#snippet render(props, _state, content)}<Button {...props}>{@render content?.()}</Button>{/snippet}
                        Open third drawer
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Third drawer</DrawerTitle>
                          <DrawerDescription>This is the frontmost drawer in the stack.</DrawerDescription>
                        </DrawerHeader>
                        <div class="flex-1 p-4">
                          <div class={panel}></div>
                        </div>
                        <DrawerFooter>
                          <DrawerClose>
                            {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                            Close
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                    <DrawerClose>
                      {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                      Close
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <DrawerClose>
                {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                Close
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet DrawerNonModal()}
  <Example title="Non Modal">
    <Drawer modal={false} disablePointerDismissal swipeDirection="right">
      <DrawerTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Non Modal
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Non Modal Drawer</DrawerTitle>
        </DrawerHeader>
        <div class="flex-1 p-4">
          <div class={panel}></div>
        </div>
        <DrawerFooter>
          <DrawerClose>
            {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render DrawerDemo()}
  {@render DrawerSwipeHandleExample()}
  {@render DrawerPosition()}
  {@render DrawerCustomWidthAndHeight()}
  {@render DrawerScrollable()}
  {@render DrawerSnapPoints()}
  {@render DrawerNested()}
  {@render DrawerNonModal()}
</ExampleWrapper>
