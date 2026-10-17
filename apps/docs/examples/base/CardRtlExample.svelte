<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Input } from '$registry/bases/base/ui/input';
  import { Label } from '$registry/bases/base/ui/label';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      title: 'Login to your account',
      description: 'Enter your email below to login to your account',
      signUp: 'Sign Up',
      email: 'Email',
      emailPlaceholder: 'm@example.com',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      login: 'Login',
      loginWithGoogle: 'Login with Google'
    },
    ar: {
      dir: 'rtl',
      title: 'تسجيل الدخول إلى حسابك',
      description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
      signUp: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'm@example.com',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      login: 'تسجيل الدخول',
      loginWithGoogle: 'تسجيل الدخول باستخدام Google'
    },
    he: {
      dir: 'rtl',
      title: 'התחבר לחשבון שלך',
      description: 'הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך',
      signUp: 'הירשם',
      email: 'אימייל',
      emailPlaceholder: 'm@example.com',
      password: 'סיסמה',
      forgotPassword: 'שכחת את הסיסמה?',
      login: 'התחבר',
      loginWithGoogle: 'התחבר עם Google'
    }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <Card class="w-full max-w-sm" dir={t.dir}>
    <CardHeader>
      <CardTitle>{t.title}</CardTitle>
      <CardDescription>{t.description}</CardDescription>
      <CardAction>
        <Button variant="link">{t.signUp}</Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form>
        <div class="flex flex-col gap-6">
          <div class="grid gap-2">
            <Label for="email-rtl">{t.email}</Label>
            <Input id="email-rtl" type="email" placeholder={t.emailPlaceholder} required />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password-rtl">{t.password}</Label>
              <!-- svelte-ignore a11y_invalid_attribute -->
              <a href="#" class="ms-auto inline-block text-sm underline-offset-4 hover:underline">{t.forgotPassword}</a>
            </div>
            <Input id="password-rtl" type="password" required />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex-col gap-2">
      <Button type="submit" class="w-full">{t.login}</Button>
      <Button variant="outline" class="w-full">{t.loginWithGoogle}</Button>
    </CardFooter>
  </Card>
</div>
