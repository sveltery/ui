import { defineParams } from '@sveltejs/kit/params';

/** Docs pages whose demo submits a remote form. A prerendered page can't answer that submission with JavaScript off, so these render on each request. */
export const remoteFormPages = ['components/input', 'components/native-checkbox', 'components/native-radio-group', 'components/native-select', 'forms/remote-forms'];

export const params = defineParams({
  remoteForm: (param) => (remoteFormPages.includes(param) ? param : undefined),
});
