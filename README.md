# 像素風闖關問答遊戲 (Pixel Quest)

一個使用 React + Vite 開發的像素風格問答遊戲，後端整合 Google Sheets。

## 功能特點
- **像素藝術風格**: 2000 年代街機視覺效果。
- **動態頭像**: 使用 DiceBear API 生成隨機關主。
- **Google Sheets 整合**: 自動讀取題目並紀錄玩家成績。

## 環境變數設定

請在專案根目錄建立 `.env` 檔案，或在 GitHub Repository Secrets 中設定以下變數：

- `VITE_GOOGLE_APP_SCRIPT_URL`: Google Apps Script 的 Web App 網址。
- `VITE_PASS_THRESHOLD`: 通關門檻（答對幾題算通過）。
- `VITE_QUESTION_COUNT`: 每次遊戲的題目數量。

## 本地開發

1. 安裝套件：
   ```bash
   npm install
   ```
2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

## 自動化部署 (GitHub Pages)

本專案已設定 GitHub Actions 自動部署。

1. **設定 Secrets**:
   在 GitHub Repo 的 `Settings > Secrets and variables > Actions` 中新增上述環境變數。
2. **啟動部署**:
   每次 Push 到 `main` 分支都會觸發自動部署。
3. **GitHub Pages 設定**:
   前往 `Settings > Pages`，將 `Build and deployment > Source` 設定為 `GitHub Actions`。

## Google Apps Script 部署

請參考 [gas_code.gs.md](https://github.com/heifetzwu/pixel-game/blob/main/gas_code.gs.md) 中的說明進行部署。
