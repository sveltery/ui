<script lang="ts">
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import InfoIcon from '@lucide/svelte/icons/info';
  import { Alert, AlertDescription, AlertTitle } from '$registry/bases/base/ui/alert';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      paymentTitle: 'Payment successful',
      paymentDescription: 'Your payment of $29.99 has been processed. A receipt has been sent to your email address.',
      featureTitle: 'New feature available',
      featureDescription: "We've added dark mode support. You can enable it in your account settings."
    },
    ar: {
      dir: 'rtl',
      paymentTitle: 'تم الدفع بنجاح',
      paymentDescription: 'تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.',
      featureTitle: 'ميزة جديدة متاحة',
      featureDescription: 'لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.'
    },
    he: {
      dir: 'rtl',
      paymentTitle: 'התשלום בוצע בהצלחה',
      paymentDescription: 'התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.',
      featureTitle: 'תכונה חדשה זמינה',
      featureDescription: 'הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך.'
    }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-md flex-col gap-4">
  <div class="grid w-full max-w-md items-start gap-4" dir={t.dir}>
    <Alert>
      <CircleCheckIcon />
      <AlertTitle>{t.paymentTitle}</AlertTitle>
      <AlertDescription>{t.paymentDescription}</AlertDescription>
    </Alert>
    <Alert>
      <InfoIcon />
      <AlertTitle>{t.featureTitle}</AlertTitle>
      <AlertDescription>{t.featureDescription}</AlertDescription>
    </Alert>
  </div>
</div>
