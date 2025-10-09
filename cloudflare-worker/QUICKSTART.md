# 🚀 快速開始指南

## 總共 5 個步驟，約 15 分鐘完成

---

## ✅ 步驟 1: 安裝 Wrangler CLI（2 分鐘）

打開 PowerShell，執行：

```powershell
npm install -g wrangler
```

等待安裝完成。

---

## ✅ 步驟 2: 登入 Cloudflare（2 分鐘）

```powershell
wrangler login
```

會開啟瀏覽器，使用 Google 或 Email 登入/註冊 Cloudflare（完全免費）。

---

## ✅ 步驟 3: 部署 Worker（3 分鐘）

```powershell
cd cloudflare-worker
wrangler deploy
```

部署成功後，你會看到：
```
Published serelix-contact-api
  https://serelix-contact-api.你的用戶名.workers.dev
```

**📝 記下這個 URL！**

---

## ✅ 步驟 4: 設定 Discord Webhook（3 分鐘）

1. 打開瀏覽器，前往：https://dash.cloudflare.com
2. 點選左側 **Workers & Pages**
3. 點選 **serelix-contact-api**
4. 點選 **Settings** 頁籤
5. 點選 **Variables**
6. 點選 **Add variable**
7. 填寫：
   - **Variable name**: `DISCORD_WEBHOOK_URL`
   - **Value**: 你的 Discord Webhook URL（原本在程式碼中的那個）
   - 勾選 **Encrypt** （重要！）
8. 點選 **Save**

---

## ✅ 步驟 5: 更新前端程式碼（5 分鐘）

回到專案根目錄，找到這個檔案：
`src/components/SerelixStudio.tsx`

找到 `handleSubmit` 函數（大約第 74 行），找到這段：

```typescript
const webhookUrl = atob('aHR0cH...');
```

**整段刪除**，改成：

```typescript
// 將下面的 URL 改成步驟 3 得到的 Worker URL
const apiUrl = 'https://serelix-contact-api.你的用戶名.workers.dev';

const response = await fetch(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message
  })
});

if (!response.ok) {
  throw new Error('Failed to send message');
}

const data = await response.json();
if (!data.success) {
  throw new Error('Failed to send message');
}
```

**記得**：將 `你的用戶名` 改成實際的！

---

## 🧪 測試（2 分鐘）

```powershell
npm run dev
```

打開 http://localhost:8080，測試聯絡表單。

如果成功，Discord 應該會收到訊息！

---

## 🚀 部署

測試成功後：

```powershell
npm run build
git add .
git commit -m "feat: use Cloudflare Worker API for contact form"
git push
```

---

## ❓ 遇到問題？

### Worker 部署失敗
```powershell
wrangler whoami  # 檢查登入狀態
wrangler login   # 重新登入
```

### 表單送出失敗
1. 檢查瀏覽器 Console 有無錯誤
2. 確認 Worker URL 正確
3. 檢查 Cloudflare Dashboard > Workers > Logs

### Discord 沒收到訊息
1. 確認步驟 4 的 DISCORD_WEBHOOK_URL 設定正確
2. 測試 Discord Webhook 是否有效：
```powershell
curl -X POST "你的Webhook URL" `
  -H "Content-Type: application/json" `
  -d '{"content":"Test message"}'
```

---

## 🎉 完成！

現在你的聯絡表單：
- ✅ Discord Webhook 安全地存在 Cloudflare
- ✅ 有基本的輸入驗證
- ✅ 有 CORS 保護
- ✅ 完全免費
- ✅ 全球加速

---

## 📚 進階功能

完成基本設定後，可以參考：
- `README.md` - 完整文件
- `FRONTEND_INTEGRATION.md` - 詳細的前端整合說明
- `worker.js` - Worker 程式碼（可自訂）
