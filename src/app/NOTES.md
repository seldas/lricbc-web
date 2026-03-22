# Testimony Share Card Process

Whenever a new "见证如云" slide or document arrives, follow the same prompt-driven workflow below to keep the style consistent:

1. **Extract Key Details**
   - Identify the event (title, date, ministry context).
   - List the characters (names, relationships, roles, ages if relevant).
   - Capture the timeline (meeting, marriage, ministry milestones, trips).
   - Note key scriptures & quotes cited.
   - Collect any media/materials that should be downloadable (PPT, PDF, audio).

2. **Write the Prompt** (for yourself or an assistant):
   > "Create a bilingual testimony entry titled `[English Title] / [Chinese Title]`. Start with metadata: author, published date, summary in both languages, relevant tags, scripture references (verse + English + Chinese), and materials (label_en, label_zh, file name). Next, craft two narrative sections separated by `---zh---`: the first for the English story, the second for the Chinese translation. Highlight the spiritual themes (hope, legacy, family) and weave in the provided scriptures and quotes. Keep the tone hopeful, reverent, and specific to ABCFM / LRICBC context."

3. **Generate Markdown**
   - Use the extracted info to fill front matter fields: `title_en`, `title_zh`, `author`, `published_at`, `summary_en`, `summary_zh`, `scripture`, `tags`, and `materials` pointing to files stored under `public/cloud-storage/testimonies/`.
   - After front matter, write the English narrative, then `---zh---` followed by the Chinese narrative.

4. **Store Assets**
   - Copy any source slides, PDFs, or audio into `public/cloud-storage/testimonies/` (use descriptive file names).
   - Reference those files under the `materials` array so the special event page offers a download link.

5. **Verify Display**
   - Run `npm run dev` and visit `/special-event#testimonies` to ensure the new card renders correctly.
   - Confirm the download link opens the stored file and scripture/library text appears bilingually.

6. **Ensure Consistency**
   - Keep the storytelling format (English then Chinese) and the typesetting (highlighted scripture block, tag pills) the same as previous cards.
   - Use the same adjectives for hope/legacy (evergreen, joy, strength, attentive prayer).

If you ever automate parts of this (script, AI prompt, etc.), replicate this structure to keep the gallery coherent.
