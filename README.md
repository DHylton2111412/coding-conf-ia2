# Coding Conf — CIT2011 IA #2 learning project

Three-page HTML/CSS/JavaScript conference registration website.

## View this website

Once GitHub Pages is enabled, open the repository's published URL. The **root-level `index.html`** redirects to the assignment landing page in `HTML/index.html`.

## Project structure

- `index.html` — hosting-only redirect to `HTML/index.html`
- `HTML/index.html` — conference landing page
- `HTML/login.html` — registration form
- `HTML/ticket.html` — personalized ticket
- `css/style.css` — responsive stylesheet
- `js/validation.js` — form checks and session storage
- `js/ticket.js` — display stored ticket data
- `assets/images/` — supplied conference artwork

## GitHub Pages setup

1. Create a **public** repository on GitHub named `coding-conf-ia2`.
2. Upload the **contents** of this ZIP directly into the repository root (not the ZIP file or an extra enclosing folder).
3. In **Settings → Pages → Build and deployment** select **Deploy from a branch**, branch **main**, folder **/(root)**, and **Save**.
4. Open the **Visit site** link shown on that page when GitHub finishes publishing.
5. Test **Register Now → Generate My Ticket** on the published link.

## Assignment submission note

The lecturer's ZIP requirement specifies `HTML/`, `css/`, `js/`, and `assets/` as the main project structure. The top-level `index.html` in this hosting copy is an **extra file for GitHub Pages only**. Keep your existing assignment ZIP separately, and name it following the lecturer's rule (`IDNo_LastName_FirstName_IA#2.zip`). Check your module's allowed topics and disclose or adapt AI assistance according to your course rules.

Only share non-sensitive test details; the registration information is stored in your own browser via `sessionStorage`, not a server.
