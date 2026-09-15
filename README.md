# GuroFilipino v4 AI-ready

## Frontend
Upload these root files to the existing GitHub Pages repository:
- index.html
- manifest.json
- sw.js
- DLP-Sample-Format.docx

The frontend now has:
- Generate with Online AI
- Offline Guided Draft fallback
- Four-session DLP editor
- Quiz, rubric, local DLP library, Word/PDF output

## Secure backend
The `backend/` folder contains a small serverless endpoint example.
It reads `OPENAI_API_KEY` from the backend environment. NEVER put the API key in index.html, GitHub Pages, or any public repository.

After deploying the backend:
1. Copy its public `/api/generate-dlp` endpoint (or the worker endpoint itself).
2. Open GuroFilipino > DLP Generator.
3. Paste that backend URL into `AI Backend URL`.
4. Enter the exact competency and teacher-verified source notes.
5. Open `4 Sesyon` and click `Generate with Online AI`.
6. Review/edit every generated field.

## Important
The AI-generated lesson is a draft. The teacher remains responsible for verifying curriculum wording, factual content, references, assessment, learner appropriateness, and the AI-use declaration.
