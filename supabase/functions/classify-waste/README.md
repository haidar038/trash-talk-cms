# Classify Waste Edge Function

Supabase Edge Function untuk klasifikasi sampah menggunakan AI Vision API dengan automatic fallback dari OpenAI ke Gemini.

## Fitur

- ✅ **Automatic Fallback**: Jika OpenAI gagal, otomatis menggunakan Gemini
- ✅ **Rate Limiting**: Maksimal 10 request per menit per user
- ✅ **Authentication**: Hanya user yang login yang bisa menggunakan
- ✅ **Secure**: API keys disimpan di environment variables, tidak exposed ke frontend
- ✅ **Cost Effective**: Menggunakan model yang efisien (GPT-4o-mini / Gemini 1.5 Flash)

## Setup & Deployment

### 1. Install Supabase CLI (jika belum)

```bash
# Windows (PowerShell)
scoop install supabase

# Mac/Linux
brew install supabase/tap/supabase

# Atau menggunakan npm
npm install -g supabase
```

### 2. Login ke Supabase

```bash
supabase login
```

### 3. Link Project

```bash
supabase link --project-ref bgejqyeqrxwtpofnjfce
```

### 4. Set Environment Variables di Supabase Dashboard

Buka: https://supabase.com/dashboard/project/bgejqyeqrxwtpofnjfce/settings/functions

Tambahkan secrets berikut:

```
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIzaSy...
```

### 5. Deploy Edge Function

```bash
supabase functions deploy classify-waste
```

### 6. Test Edge Function

```bash
# Test dari command line
curl -i --location --request POST 'https://bgejqyeqrxwtpofnjfce.supabase.co/functions/v1/classify-waste' \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"imageDataUrl":"data:image/png;base64,..."}'
```

## Cara Kerja

1. Frontend mengirim base64 image ke Edge Function
2. Edge Function memverifikasi user authentication
3. Edge Function melakukan rate limiting check
4. Edge Function mencoba memanggil OpenAI GPT-4o-mini
5. Jika OpenAI gagal (quota limit / error), otomatis fallback ke Gemini 1.5 Flash
6. Hasil analisis dikembalikan ke frontend dalam format JSON

## Rate Limiting

- **Limit**: 10 requests per minute per user
- **Implementation**: Query `classification_history` table untuk check jumlah request dalam 1 menit terakhir
- **Error Message**: "Rate limit exceeded. Please wait a minute before trying again."

## Cost Estimation

### OpenAI GPT-4o-mini
- **Input**: $0.15 per 1M tokens (~1000 tokens per image)
- **Output**: $0.60 per 1M tokens (~500 tokens per response)
- **Estimasi per request**: $0.0005 - $0.001

### Gemini 1.5 Flash (Fallback)
- **Free tier**: 15 requests per minute
- **Paid**: Sangat murah, sekitar $0.0001 per request

## Troubleshooting

### Error: "function not found"
```bash
# Re-deploy function
supabase functions deploy classify-waste
```

### Error: "Missing authorization header"
Pastikan frontend mengirim Authorization header dengan bearer token

### Error: "Both AI services failed"
Check environment variables di Supabase dashboard, pastikan API keys valid

### Rate limit masih terjadi
Tingkatkan limit di code (line 67 di index.ts):
```typescript
if (recentRequests && recentRequests.length >= 20) { // ubah dari 10 ke 20
```

## Development

### Run locally
```bash
supabase start
supabase functions serve classify-waste
```

### Test locally
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/classify-waste' \
  --header 'Authorization: Bearer YOUR_LOCAL_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"imageDataUrl":"data:image/png;base64,..."}'
```

## Security Notes

⚠️ **PENTING**: API keys harus disimpan sebagai Supabase secrets, JANGAN commit ke git!

✅ Edge Function sudah implement:
- Authentication check
- Rate limiting
- Error handling
- CORS headers

## Support

Untuk masalah atau pertanyaan, buka issue di repository atau contact maintainer.
