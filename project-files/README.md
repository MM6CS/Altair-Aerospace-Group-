# ALTAIR project file library

This folder is the public, version-controlled file store for project deliverables. Upload only files that are approved for public release.

## Recommended layout

```text
project-files/
  aeronautics/
    <project-id>/
      documents/
      cad/
      models/
      results/
      source/
  astronautics/
    <project-id>/
      documents/
      cad/
      models/
      results/
```

Use the project builder linked from each division's project register to draft the project entry and resource list. It reads selected file names and sizes locally to prepare links; it does not transmit or upload the selected files. Copy files into the suggested repository folder yourself, then commit both the catalogue entry and files to GitHub.

Add resource metadata to that project's `resources` array in `projects-data.js`:

```js
resources: [
  {
    title: "Initial design brief",
    type: "Document",
    path: "project-files/aeronautics/light-aircraft-design/documents/design-brief.pdf",
    description: "Mission definition and preliminary requirements · PDF"
  },
  {
    title: "Wing concept model",
    type: "CAD",
    path: "project-files/aeronautics/light-aircraft-design/cad/wing-concept.step",
    description: "Neutral exchange format · STEP"
  }
]
```

Use relative paths starting with `project-files/`. The public project register supports documents, CAD, 3D models, datasets, images, source files, archives and other downloadable resources. Only files actually present in the repository should be listed.

## Before publishing files

- Check permissions, licences, third-party terms and any institutional or competition rules.
- Do not publish personal information, credentials, private customer data or material you are not authorised to disclose.
- Review safety-sensitive, export-controlled or otherwise restricted aerospace technical content with a qualified adviser before making it public.
- Add a short description, units, version and date where relevant. For engineering outputs, document assumptions, software/tool versions and limitations.
- Large CAD packages and simulation data can make a Git repository difficult to maintain. Keep public downloads small and consider Git Large File Storage only if you understand its quota and hosting limits.
- GitHub Pages serves the files publicly; it does not provide a private document library, authenticated downloads or in-browser uploads.
