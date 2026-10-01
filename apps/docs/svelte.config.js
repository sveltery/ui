import adapter from '@sveltejs/adapter-auto';
export default { kit: { adapter: adapter(), alias: { cn: '../../tests/reference/cn.ts', '@/registry/bases/base/ui/button': '../../tests/reference/button.tsx', '@/app/(create)/components/icon-placeholder': '../../tests/reference/icon.tsx' } } };
