# 前端整合指南

## 📝 需要修改的檔案

修改 `src/components/SerelixStudio.tsx` 中的 `handleSubmit` 函數。

## 🔄 修改步驟

### 原本的程式碼（第 74-118 行）

需要替換 `handleSubmit` 函數中的這段：

```typescript
const webhookUrl = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQwNjY2ODkzOTk4NzI1OTQxMy9oMXRseUlmSThveVczRlRVdzlLbGh3VHBTX2RsTTZvbWZwQzV3M3pYc0dXT3d1cTVWTXc3OGxUWXUzMXdUZlBiX0hTZQ==');

const discordMessage = {
  content: 'New Contact Form Submission:',
  embeds: [{
    title: 'New Contact Message!!!!!',
    color: 3447003,
    fields: [
      { name: 'Name', value: formData.name, inline: true },
      { name: 'Email', value: formData.email, inline: true },
      { name: 'Subject', value: formData.subject, inline: false },
      { name: 'Message', value: formData.message, inline: false }
    ],
    timestamp: new Date().toISOString()
  }]
};

const response = await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(discordMessage)
});
```

### 改成新的程式碼

```typescript
// Cloudflare Worker API endpoint
// 部署後將這個 URL 改成您的 Worker URL
const apiUrl = 'https://serelix-contact-api.YOUR-USERNAME.workers.dev';
// 或使用自訂網域: 'https://api.serelix.xyz/contact'

const response = await fetch(apiUrl, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message
  })
});

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error || 'Failed to send message');
}

const data = await response.json();
if (!data.success) {
  throw new Error('Failed to send message');
}
```

## 🎯 完整的 handleSubmit 函數

完整替換後的版本：

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Simple client-side rate limiting
    const lastSubmit = localStorage.getItem('lastFormSubmit');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit) < 60000) {
      toast({
        title: t.contact.toast.rateLimit.title,
        description: t.contact.toast.rateLimit.description,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // ⭐ 新的 API 呼叫方式
    const apiUrl = 'https://serelix-contact-api.YOUR-USERNAME.workers.dev';
    // 部署 Worker 後，將上面的 URL 改成您實際的 Worker URL
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to send message');
    }

    // 成功處理
    localStorage.setItem('lastFormSubmit', now.toString());
    toast({
      title: t.contact.toast.success.title,
      description: t.contact.toast.success.description,
    });
    setFormData({ name: '', email: '', subject: '', message: '' });

  } catch (error) {
    console.error('Form submission error:', error);
    toast({
      title: t.contact.toast.error.title,
      description: t.contact.toast.error.description,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

## ⚙️ 設定 API URL

### 選項 1: 使用 Workers.dev 子網域（預設）
```typescript
const apiUrl = 'https://serelix-contact-api.YOUR-USERNAME.workers.dev';
```
將 `YOUR-USERNAME` 替換成您的 Cloudflare 用戶名。

### 選項 2: 使用自訂網域（推薦）
```typescript
const apiUrl = 'https://api.serelix.xyz/contact';
```
需要在 Cloudflare Dashboard 設定自訂網域。

### 選項 3: 使用環境變數（最佳實踐）

1. 創建 `.env` 檔案：
```env
VITE_API_URL=https://serelix-contact-api.YOUR-USERNAME.workers.dev
```

2. 在程式碼中使用：
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

3. 記得將 `.env` 加入 `.gitignore`

## ✅ 修改檢查清單

- [ ] 部署 Cloudflare Worker
- [ ] 取得 Worker URL
- [ ] 在 Cloudflare Dashboard 設定 DISCORD_WEBHOOK_URL
- [ ] 修改 `SerelixStudio.tsx` 的 `handleSubmit` 函數
- [ ] 更新 Worker URL 為實際的 URL
- [ ] 測試表單提交
- [ ] 檢查 Discord 是否收到訊息
- [ ] 重新 build 並部署前端

## 🧪 測試

修改後，執行：
```powershell
npm run dev
```

測試表單是否正常運作。

## 🚀 部署

測試成功後：
```powershell
npm run build
git add .
git commit -m "feat: integrate Cloudflare Worker API for contact form"
git push
```
