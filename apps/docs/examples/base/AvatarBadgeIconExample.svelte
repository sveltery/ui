<script lang="ts">
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '$registry/bases/base/ui/avatar';
</script>

<Avatar class="grayscale">
  <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
  <AvatarFallback>PP</AvatarFallback>
  <AvatarBadge>
    <PlusIcon />
  </AvatarBadge>
</Avatar>
