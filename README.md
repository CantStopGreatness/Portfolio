Aryan Thakur — Portfolio
A single-page personal portfolio site, built with plain HTML, CSS, and a small amount of JavaScript (no frameworks or build step required).

Sections
Hero — name, role, short bio, and quick links (GitHub, Email, LinkedIn)
Education — degree, activities/societies, coursework, and awards
Experience — work and volunteer history with role, dates, and bullet points
Projects — Waive and CourtIQ, each with a description, tech stack tags, and a live link
Contact — email, GitHub, phone, and location
The top nav lets you jump straight to Education, Experience, Projects, or Contact.
Tech
Plain HTML/CSS/JS — everything lives in index.html
Fonts: Inter and Instrument Serif, loaded from Google Fonts
No dependencies, no build tools, no npm install — just open the file or deploy it as-is
Running it locally
Just open index.html in a browser — double-click it, or run:
bash
open index.html        # macOS
start index.html        # Windows
xdg-open index.html    # Linux

Editing content
Everything is in index.html. A few places you'll likely revisit:
Hero bio — inside <div class="hero">
Education — inside <section id="education">
Experience — inside <section id="experience">, one .experience-item block per role
Projects — inside <section id="projects">, one .project block per project. Each project has its own CSS class (e.g. .waive, .courtiq) controlling its accent color — copy an existing block and give the new one a new class name, then add matching color rules in the <style> block (search for .waive to see the pattern).
Contact info — inside <section id="contact">
