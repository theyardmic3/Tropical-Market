You're encountering this error because **Supabase has disabled legacy API keys**, and you're trying to use one (`service_role` or `anon`) that’s no longer supported ([github.com][1]).

---

## ✅ How to Fix the Error

### 1. Generate the new **secret key**

* Go to your Supabase project dashboard → **Settings → API Keys**
* Under the **Early access/new API keys** section, generate a **new secret key** (`sb_secret_…`) and a **new publishable key** (`sb_publishable_…`) ([reddit.com][2], [github.com][1]).

---

### 2. Update your environment variables:

Replace your `SUPABASE_SERVICE_ROLE_KEY` (which uses the old key) with the new secret key:

```env
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
# Optional frontend key
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

---

### 3. Restart your development server

After updating `.env` file, run:

```bash
npm run dev
# or yarn dev, pnpm dev
```

This ensures the new keys are loaded correctly.

---

### 🔍 Why this matters:

| Key Type         | Old Format       | New Format         | Use Case                           |
| ---------------- | ---------------- | ------------------ | ---------------------------------- |
| Service Role     | JWT (long lived) | `sb_secret_…`      | Privileged, server-side operations |
| Publishable/Anon | JWT (long lived) | `sb_publishable_…` | Browser/client-side usage          |

Legacy keys are **disabled by default** in new projects—only these new `sb_…` keys will work going forward ([stackoverflow.com][3], [github.com][1], [drdroid.io][4]).

---

Once you’ve installed the new keys and restarted your server, the "Legacy API keys are disabled" error should be resolved.

Would you like a snippet to automatically reload your Next.js dev server or help updating your Supabase initialization?

[1]: https://github.com/orgs/supabase/discussions/29260?utm_source=chatgpt.com "Upcoming changes to Supabase API Keys #29260 - GitHub"
[2]: https://www.reddit.com/r/Supabase/comments/1jrnwa3/project_api_key_not_generating/?utm_source=chatgpt.com "Project API key not generating : r/Supabase - Reddit"
[3]: https://stackoverflow.com/questions/78366938/supabase-no-api-key-found-in-request?utm_source=chatgpt.com "Supabase \"No API key found in request.\" - Stack Overflow"
[4]: https://drdroid.io/stack-diagnosis/supabase-realtime-invalid-api-key-error-when-attempting-to-connect-to-supabase-realtime?utm_source=chatgpt.com "Supabase Realtime Invalid API Key error when attempting to ..."
