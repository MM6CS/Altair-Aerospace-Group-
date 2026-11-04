# ALTAIR Aerospace Group

A multi-page, responsive static website for an early-stage, faith-informed aerospace venture. Built with HTML, CSS and vanilla JavaScript; deployable on GitHub Pages with no server, build step or paid service.

The visual direction uses a dark graphite-and-navy aerospace palette, bright blue instrument accents, image-led mission storytelling and a public, searchable project portfolio. It takes broad inspiration from [Day Aerospace](https://dayaerospace.com/) and the project-focused structure of the [In-Space Recycling project workspace](https://andreaspoimen.github.io/3rd-Year-Project/) without copying either site's identity. NASA images are factual reference imagery and are credited; NASA is not affiliated with or endorsing ALTAIR.

## Pages and files

- `index.html` — venture overview and two division entry points
- `aeronautics.html`, `astronautics.html` — dedicated division pages
- `aeronautics-projects.html`, `astronautics-projects.html` — division-specific project and downloadable-file registers
- `projects.html` — searchable portfolio across both divisions
- `project-builder.html` — local form to draft project metadata and file references
- `about.html` — venture mission, founder profile placeholder and Islamic principles
- `research.html` — project lifecycle, status definitions and areas of interest
- `contact.html` — collaboration, mentorship, project and general enquiry links
- `styles.css` — shared visual system, responsive layout and reduced-motion support
- `script.js` — shared navigation, current year and portfolio deep-link filters
- `projects-data.js` — the editable source of portfolio entries
- `projects.js` — portfolio rendering, resource links, search and division/status filters
- `project-builder.js` — metadata and file-manifest draft generator
- `project-files/README.md` — public project archive layout and resource format
- `project-files/templates/project-brief-template.md` — reusable engineering brief
- `assets/altair-emblem.png`, `assets/altair-wordmark.png`, `assets/aerospace-group-wordmark.png`, `assets/altair-logo.png`, `assets/favicon.png` — supplied brand artwork
- `assets/*-transparent.png` and `assets/geometric-arabic-kufic-transparent.png` — transparent, dark-theme logo and founder-art variants; the theme button switches back to the original artwork in light mode
- `assets/nasa-x59-research.jpg`, `assets/nasa-earth-limb.jpg` — NASA reference imagery with credits on the website

## Preview locally

Open `index.html` in a browser, or start a local server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Colour theme

Use the theme button in the header to switch between the default dark aerospace palette and a crisp light palette. Your choice is saved in this browser and carries across the site's pages.

## Publish on GitHub Pages

1. Create a GitHub repository for the website.
2. Upload the contents of this folder to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. Wait for the Pages deployment. GitHub displays the published URL in Pages settings.

The site uses relative asset and page links, so it works as either a user site or a repository/project site. Custom domains can be configured later in GitHub Pages.

## Adding projects and project files

Open `project-builder.html` and choose **Add a project** or **Edit an existing project**. Fill in the project details, choose whether to feature it on the homepage, and select any new reports, CAD files, 3D models, datasets or other deliverables. When editing, existing file links are kept unless you check them for removal. The browser reads selected file names and sizes locally; it does **not** upload or retain the files.

Generate the draft, download the updated `projects-data.js`, and replace the old catalogue file with it. Copy any selected files into the suggested project folder, then publish the catalogue and files through your GitHub repository. Each division's project page reads the same catalogue but lists only its own projects. A newly added project must set `division` to `Aeronautics` or `Astronautics`.

Recommended file locations:

```text
project-files/
  aeronautics/<project-id>/{documents,cad,models,results,source}/
  astronautics/<project-id>/{documents,cad,models,results,source}/
```

In the catalogue object, link each released file in `resources`:

Example:

```js
{
  id: "light-aircraft-design",
  title: "Light Aircraft Design Study",
  division: "Aeronautics",
  category: "Aeronautics",
  tags: ["Aeronautics"],
  status: "Proposed",
  phase: "Concept design",
  summary: "A clear, accurate description of the project.",
  objective: "The specific question or outcome being addressed.",
  nextStep: "The next concrete milestone.",
  code: "A / 03",
  visual: "aircraft",
  featured: false,
  resources: [
    {
      title: "Project brief",
      type: "Document",
      path: "project-files/aeronautics/light-aircraft-design/documents/project-brief.pdf",
      description: "Mission definition and requirements · PDF"
    },
    {
      title: "Wing concept",
      type: "CAD",
      path: "project-files/aeronautics/light-aircraft-design/cad/wing.step",
      description: "Neutral exchange format · STEP"
    }
  ]
}
```

Use a unique, URL-friendly `id`. Supported resource types include Document, CAD, 3D Model, Data, Image, Archive, Source and File. Resource paths should start with `project-files/`. Only link files that exist in the repository and have been cleared for public release.

Suggested status language:

- `Proposed` — a direction under consideration
- `Concept` — initial scope or requirements are being explored
- `In progress` — active work has started
- `Testing` — analysis, a model or a prototype is being checked
- `Complete` — the stated deliverable is done; this does not imply certification or operational readiness

Keep the summary, objective and next step evidence-based. If you add a category or status, update the relevant filters in `projects.html` and the division registers.

## Before launch

1. Replace every `hello@altairaerospace.com` mail link with an inbox you control.
2. Personalise the founder profile, biography and any public professional links.
3. Review all project stages, descriptions and competition references for accuracy.
4. Check every page and email link on the deployed GitHub Pages URL.
5. Publish only material you are authorised to share; avoid private, safety-sensitive or controlled technical details.
6. If the venture begins trading or collecting personal information, investigate the relevant company, privacy, tax, insurance, intellectual-property, safety and aerospace regulatory requirements with qualified advisers.

## Static-site limitations

- GitHub Pages serves static files. Editing `projects-data.js` in your repository and publishing the change is how you add projects to the public site; there is no server-side editor, database, newsletter subscription or form submission.
- The project builder only prepares local catalogue metadata. GitHub authentication and file uploads are deliberately not built into this public static site; publish changes through your own repository.
- Contact links open the visitor's email application. They do not transmit data to this website.
- The Google Fonts stylesheet is optional; local sans-serif fallbacks are provided.
- Project descriptions are initial directions, not claims of completed work, certification, commercial availability or operational capability.
- NASA imagery is credited to NASA/Jim Ross and NASA. Per [NASA's media guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/), NASA does not endorse ALTAIR or its products. Source records: [X-59 in flight](https://images.nasa.gov/details/AFRC2025-0168-028) and [Gemini 7 Earth limb](https://images.nasa.gov/details/s65-65257).
- Visual reference examples reviewed: [SpaceX](https://www.spacex.com/) and [Airbus Space](https://www.airbus.com/en/products-services/space). Their content, logos and identity are not used in this website.
