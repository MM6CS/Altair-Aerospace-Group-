const projectForm = document.getElementById('project-form');

if (projectForm) {
  const fileInput = document.getElementById('resource-files');
  const selectedFiles = document.getElementById('selected-files');
  const existingResources = document.getElementById('existing-resources');
  const outputPanel = document.getElementById('builder-output');
  const output = document.getElementById('entry-output');
  const statusMessage = document.getElementById('builder-status');
  const downloadButton = document.getElementById('download-entry');
  const downloadCatalogButton = document.getElementById('download-catalog');
  const modeSelect = document.getElementById('builder-mode');
  const projectSelect = document.getElementById('existing-project');
  const projectSelectField = document.getElementById('existing-project-field');
  let projectCatalogue = Array.isArray(window.ALTAIR_PROJECTS) ? [...window.ALTAIR_PROJECTS] : [];
  let projectDraft = null;
  let editingProjectId = '';

  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  const slugify = value => value.trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'new-project';

  const typeForFile = fileName => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'docx', 'md', 'txt', 'ppt', 'pptx'].includes(extension)) return 'Document';
    if (['step', 'stp', 'iges', 'igs', '3mf', 'sldprt', 'sldasm', 'f3d'].includes(extension)) return 'CAD';
    if (['stl', 'obj', 'glb', 'gltf', 'fbx', '3ds'].includes(extension)) return '3D Model';
    if (['csv', 'xlsx', 'xls', 'mat'].includes(extension)) return 'Data';
    if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(extension)) return 'Image';
    if (['zip', '7z', 'gz'].includes(extension)) return 'Archive';
    if (['py', 'js', 'm', 'ipynb', 'c', 'cpp'].includes(extension)) return 'Source';
    return 'File';
  };

  const folderForType = type => ({
    Document: 'documents',
    CAD: 'cad',
    '3D Model': 'models',
    Data: 'results',
    Image: 'results',
    Source: 'source',
    Archive: 'documents',
    File: 'documents'
  })[type];

  const clearForm = () => {
    ['title', 'phase', 'code', 'summary', 'objective', 'nextStep'].forEach(name => {
      projectForm.elements.namedItem(name).value = '';
    });
    projectForm.elements.namedItem('division').value = 'Aeronautics';
    projectForm.elements.namedItem('category').value = 'Aeronautics';
    projectForm.elements.namedItem('status').value = 'Proposed';
    projectForm.elements.namedItem('featured').checked = false;
    fileInput.value = '';
    selectedFiles.textContent = '';
    existingResources.textContent = '';
    editingProjectId = '';
    outputPanel.hidden = true;
    projectDraft = null;
    downloadButton.disabled = true;
    downloadCatalogButton.disabled = true;
  };

  const populateForm = project => {
    clearForm();
    if (!project) return;
    editingProjectId = project.id;
    ['title', 'division', 'category', 'status', 'phase', 'code', 'summary', 'objective', 'nextStep'].forEach(name => {
      const field = projectForm.elements.namedItem(name);
      if (field) field.value = project[name] || '';
    });
    projectForm.elements.namedItem('featured').checked = Boolean(project.featured);
    existingResources.innerHTML = (project.resources || []).length
      ? `<span class="existing-resources-heading">EXISTING PROJECT LINKS — CHECK ANY LINKS TO REMOVE</span>${project.resources.map((resource, index) => `<label><input type="checkbox" name="remove-resource" value="${index}"><span>${escapeHtml(resource.title || resource.path || 'Project file')}<small>${escapeHtml(resource.type || 'File')} · ${escapeHtml(resource.path || '')}</small></span></label>`).join('')}`
      : '<p>No project files are linked yet.</p>';
    selectedFiles.textContent = `${(project.resources || []).length} existing file ${(project.resources || []).length === 1 ? 'link' : 'links'} will be kept. Select additional files above to add more.`;
  };

  projectCatalogue.forEach(project => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.title;
    projectSelect.append(option);
  });

  modeSelect.addEventListener('change', () => {
    const editing = modeSelect.value === 'edit';
    projectSelectField.hidden = !editing;
    projectSelect.required = editing;
    projectSelect.value = '';
    clearForm();
    if (editing) projectSelect.focus();
  });

  projectSelect.addEventListener('change', () => {
    const project = projectCatalogue.find(item => item.id === projectSelect.value);
    populateForm(project);
  });

  fileInput.addEventListener('change', () => {
    const files = [...fileInput.files];
    const existing = editingProjectId ? projectCatalogue.find(project => project.id === editingProjectId) : null;
    const existingCount = existing ? (existing.resources || []).length : 0;
    const fileList = files.map(file => `<div><b>${typeForFile(file.name)}</b> ${escapeHtml(file.name)} <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small></div>`).join('');
    const existingNote = existingCount ? `<span>${existingCount} existing file ${existingCount === 1 ? 'link' : 'links'} will be kept.</span>` : '';
    const selectedNote = files.length ? `<span>${files.length} new ${files.length === 1 ? 'file' : 'files'} — copy these into the project folder before publishing:</span>` : '';
    selectedFiles.innerHTML = `${existingNote}${selectedNote}${fileList}`;
  });

  projectForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!projectForm.reportValidity()) return;

    const values = new FormData(projectForm);
    const title = String(values.get('title')).trim();
    const existingProject = editingProjectId
      ? projectCatalogue.find(project => project.id === editingProjectId)
      : null;
    const id = existingProject ? existingProject.id : slugify(title);
    const duplicate = projectCatalogue.find(project => project.id === id && project.id !== editingProjectId);
    if (duplicate) {
      statusMessage.textContent = `A project already uses the ID "${id}". Choose a different title before adding it.`;
      outputPanel.hidden = false;
      return;
    }

    const division = String(values.get('division'));
    const divisionPath = division.toLowerCase();
    const category = String(values.get('category'));
    const newResources = [...fileInput.files].map(file => {
      const type = typeForFile(file.name);
      return {
        title: file.name,
        type,
        path: `project-files/${divisionPath}/${id}/${folderForType(type)}/${file.name}`,
        description: `${type} · ${(file.size / 1024 / 1024).toFixed(2)} MB`
      };
    });
    const tags = [...new Set([
      ...(existingProject?.tags || []).filter(tag => tag !== existingProject.category),
      category
    ])];
    const removedResourceIndexes = new Set(
      [...projectForm.querySelectorAll('input[name="remove-resource"]:checked')].map(input => Number(input.value))
    );
    const retainedResources = (existingProject?.resources || []).filter((resource, index) => !removedResourceIndexes.has(index));

    projectDraft = {
      ...(existingProject || {}),
      id,
      title,
      division,
      category,
      tags,
      status: String(values.get('status')),
      phase: String(values.get('phase')).trim(),
      summary: String(values.get('summary')).trim(),
      objective: String(values.get('objective')).trim(),
      nextStep: String(values.get('nextStep')).trim(),
      code: String(values.get('code')).trim() || (division === 'Aeronautics' ? 'A / NEW' : 'S / NEW'),
      visual: existingProject?.visual || (division === 'Aeronautics' ? 'aircraft' : 'orbit'),
      featured: projectForm.elements.namedItem('featured').checked,
      resources: [...retainedResources, ...newResources]
    };

    if (existingProject) {
      projectCatalogue = projectCatalogue.map(project => project.id === id ? projectDraft : project);
    } else {
      projectCatalogue.push(projectDraft);
    }

    output.textContent = JSON.stringify(projectDraft, null, 2);
    outputPanel.hidden = false;
    downloadButton.disabled = false;
    downloadCatalogButton.disabled = false;
    statusMessage.textContent = existingProject
      ? 'Updated draft ready. Download the full catalogue to publish this edit.'
      : 'New project draft ready. Download the full catalogue to publish it.';
    outputPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('copy-entry').addEventListener('click', async () => {
    if (!projectDraft) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(projectDraft, null, 2));
      statusMessage.textContent = 'Project entry copied. You can paste it into projects-data.js.';
    } catch (error) {
      statusMessage.textContent = 'Clipboard access was blocked. Select and copy the project entry from the preview above.';
    }
  });

  downloadButton.addEventListener('click', () => {
    if (!projectDraft) return;
    const file = new Blob([`${JSON.stringify(projectDraft, null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectDraft.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    statusMessage.textContent = 'JSON draft downloaded. The updated catalogue is still required to publish this project.';
  });

  downloadCatalogButton.addEventListener('click', () => {
    if (!projectDraft) return;
    const source = `window.ALTAIR_PROJECTS = ${JSON.stringify(projectCatalogue, null, 2)};\n`;
    const file = new Blob([source], { type: 'text/javascript' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'projects-data.js';
    link.click();
    URL.revokeObjectURL(url);
    statusMessage.textContent = 'Updated projects-data.js downloaded. Replace the existing file with it, then publish the catalogue and any new project files.';
  });
}
