import * as React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './dialog';
const buttonClass = 'cn-button cn-button-variant-outline cn-button-size-default inline-flex items-center justify-center';
export function Example() {
  return <main className="mx-auto max-w-2xl p-8" data-hydrated="true">
    <h1 className="mb-4 text-2xl font-medium">Dialog</h1>
    <p className="mb-6 text-muted-foreground">Update your profile, then return to the page.</p>
    <button type="button" className={buttonClass} data-testid="before">Before</button>
    <Dialog><DialogTrigger className={buttonClass} data-testid="trigger">Edit profile</DialogTrigger>
      <DialogContent data-testid="content">
        <DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Make changes to your profile here. Choose Save when you’re done.</DialogDescription></DialogHeader>
        <div className="grid gap-2"><label htmlFor="profile-name">Name</label><input id="profile-name" name="name" defaultValue="Ada Lovelace" className="h-8 rounded-lg border border-border px-2" /></div>
        <DialogFooter><DialogClose className={buttonClass} data-testid="save">Save</DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
    <button type="button" className={buttonClass} data-testid="after">After</button>
    <div aria-live="polite" data-testid="announcement">Profile editor ready</div>
  </main>;
}
