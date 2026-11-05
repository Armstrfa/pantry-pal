# PantryPal

Turn 3–5 fridge ingredients into a practical recipe with time estimates and substitution ideas.

- Live app: https://pantry-pal-ten-lemon.vercel.app
- GitHub: https://github.com/Armstrfa/pantry-pal
- Project report: [compiled PDF](output/pdf/pantrypal-project-report.pdf) and [LaTeX source](report/pantrypal-project-report.tex)

## Run locally

This is a static frontend with a Vercel serverless function. Install the Vercel CLI, set `OPENAI_API_KEY` in your local environment, then run `vercel dev` from this folder.

Optional: set `OPENAI_MODEL` to use another model supported by the OpenAI Responses API. The default is `gpt-4.1-mini`.

## Deploy

Import this project folder into Vercel or run `vercel` from the project directory. Set `OPENAI_API_KEY` in the Vercel project’s Environment Variables for Preview and Production, then redeploy. The key is read only by `/api/recipe` on the server and is never sent to the browser.

