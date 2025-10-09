# Serelix Studio - Cloudflare Worker API

這個 Worker 負責安全地處理聯絡表單並轉發到 Discord。

## 📋 部署步驟

### 1. 安裝 Wrangler CLI

```powershell
npm install -g wrangler
```

### 2. 登入 Cloudflare

```powershell
wrangler login
```

這會開啟瀏覽器讓您登入 Cloudflare 帳號。

### 3. 部署 Worker

```powershell
cd cloudflare-worker
wrangler deploy
```

### 4. 設定環境變數（重要！）

部署後，在 Cloudflare Dashboard 設定環境變數：

1. 前往 https://dash.cloudflare.com/
2. 選擇 Workers & Pages
3. 點選您的 Worker (serelix-contact-api)
4. 前往 Settings > Variables
5. 添加環境變數：
   - **變數名稱**: `DISCORD_WEBHOOK_URL`
   - **值**: 您的 Discord Webhook URL
   - **類型**: Secret (加密)

### 5. 測試 Worker

部署後您會得到一個 URL，例如：
```
https://serelix-contact-api.your-username.workers.dev
```

測試指令：
```powershell
curl -X POST https://serelix-contact-api.your-username.workers.dev `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"Test message\"}'
```

## 🔧 設定自訂網域（選擇性）

如果您想使用 `api.serelix.xyz` 而不是 `*.workers.dev`：

1. 在 Cloudflare Dashboard 中
2. Workers & Pages > 您的 Worker > Settings > Triggers
3. 添加 Custom Domain
4. 輸入 `api.serelix.xyz`
5. Cloudflare 會自動設定 DNS

## 🔐 安全性功能

- ✅ CORS 保護（只允許您的網域）
- ✅ 輸入驗證和清理
- ✅ Rate Limiting 準備
- ✅ Discord Webhook URL 加密存儲
- ✅ IP 記錄（防止濫用）

## 📊 監控

在 Cloudflare Dashboard 可以看到：
- 請求數量
- 錯誤率
- 回應時間
- 流量來源

## 💰 費用

Cloudflare Workers 免費方案：
- 每天 100,000 次請求
- 10ms CPU 時間/請求
- 完全足夠個人網站使用

## 🔄 更新 Worker

修改 `worker.js` 後，重新部署：

```powershell
wrangler deploy
```

## ⚠️ 注意事項

1. **不要**將 Discord Webhook URL 寫在程式碼中
2. **務必**在 Cloudflare Dashboard 設定為 Secret
3. 記得更新 `worker.js` 中的 CORS 網域為您的實際網域
4. 定期檢查 Worker 的日誌和使用量

## 🆘 故障排除

### Worker 部署失敗
```powershell
# 檢查登入狀態
wrangler whoami

# 重新登入
wrangler login
```

### 測試請求失敗
- 檢查 DISCORD_WEBHOOK_URL 是否正確設定
- 查看 Worker 日誌：Dashboard > Workers > 您的 Worker > Logs

### CORS 錯誤
- 確認 `worker.js` 中的 `Access-Control-Allow-Origin` 設定為您的網域
