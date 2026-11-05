Aryan Thakur — Portfolio
A single-page personal portfolio site, built with plain HTML, CSS, and a small amount of JavaScript (no frameworks or build step required).

Sections:
Hero — name, headline, Resume / GitHub / LinkedIn buttons, and "Skip to overview" section links
About — short bio
Projects — Vigil (featured), Waive, and CourtIQ, each with a screenshot, impact line, live demo, and code link
Experience — work and volunteer history with role, dates, and bullet points
Education — degree, activities/societies, coursework, and awards
Contact — email, GitHub, LinkedIn, resume, phone, and location
/?view=classic skips the universe tour and shows every section as one scrollable page with a sticky nav.
The resume lives at /resume.pdf; project screenshots live in /assets/projects/.

Tech:
Plain HTML/CSS/JS — everything lives in index.html
Fonts: Inter and Instrument Serif, loaded from Google Fonts
No dependencies, no build tools, no npm install — just open the file or deploy it as-is

Running it locally:
Open index.html in a browser — double-click it, or run:
bash
open index.html        # macOS
start index.html        # Windows
xdg-open index.html    # Linux

Editing content:
Everything is in index.html. A few places you'll likely revisit:
Hero bio — inside <div class="hero">
Education — inside <section id="education">
Experience — inside <section id="experience">, one .experience-item block per role
Projects — inside <section id="projects">, one .project block per project. Each project has its own CSS class (e.g. .waive, .courtiq) controlling its accent color — copy an existing block and give the new one a new class name, then add matching color rules in the <style> block (search for .waive to see the pattern).
Contact info — inside <section id="contact">
