const portfolio = document.getElementById('portfolio-grid');

if (portfolio) {
  const search = document.getElementById('project-search');
  const category = document.getElementById('project-category');
  const status = document.getElementById('project-status');
  const count = document.getElementById('project-count');
  const empty = document.getElementById('empty-state');
  const projects = Array.isArray(window.ALTAIR_PROJECTS) ? window.ALTAIR_PROJECTS : [];
  const division = document.body.dataset.projectDivision || '';
  const featuredPreview = portfolio.dataset.featuredProjects === 'true';

  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  const safeResourcePath = value => {
    const path = String(value || '').trim();
    if (path.startsWith('project-files/') && !path.split('/').includes('..')) return path;
    if (/^https:\/\//i.test(path)) return path;
    return '';
  };

  const renderResources = resources => {
    if (!Array.isArray(resources) || resources.length === 0) {
      return '<div class="resource-empty">No files published yet. Project documentation, CAD and model files will appear here as they are released.</div>';
    }

    return `<div class="resource-list">${resources.map(resource => {
      const path = safeResourcePath(resource.path);
      const title = escapeHtml(resource.title || resource.path || 'Project resource');
      const type = escapeHtml(resource.type || 'File');
      const description = escapeHtml(resource.description || '');
      if (!path) {
        return `<div class="resource-item resource-unavailable"><span class="resource-type">${type}</span><span>${title}<small>Check the resource path</small></span></div>`;
      }
      const external = /^https:\/\//i.test(path);
      return `<a class="resource-item" href="${escapeHtml(path)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ' download'}>
        <span class="resource-type">${type}</span>
        <span class="resource-title">${title}<small>${description || escapeHtml(path.split('/').pop())}</small></span>
        <span class="resource-download" aria-label="Open or download ${title}">↗</span>
      </a>`;
    }).join('')}</div>`;
  };

  const render = () => {
    const query = search ? search.value.trim().toLowerCase() : '';
    const selectedCategory = category ? category.value : 'all';
    const selectedStatus = status ? status.value : 'all';
    const divisionProjects = division ? projects.filter(project => project.division === division) : projects;
    const visible = divisionProjects.filter(project => {
      if (featuredPreview && !project.featured) return false;
      const resourcesText = (project.resources || []).map(resource => [resource.title, resource.type, resource.description].join(' ')).join(' ');
      const searchText = [project.title, project.category, project.phase, project.summary, ...(project.tags || []), resourcesText].join(' ').toLowerCase();
      const matchesQuery = !query || searchText.includes(query);
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory || (project.tags || []).includes(selectedCategory);
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      return matchesQuery && matchesCategory && matchesStatus;
    });

    if (featuredPreview) {
      portfolio.innerHTML = visible.slice(0, 3).map(project => {
        const image = (project.resources || []).find(resource => resource.type === 'Image' && safeResourcePath(resource.path));
        const artwork = image
          ? `<img src="${escapeHtml(safeResourcePath(image.path))}" alt="">`
          : `<span class="home-project-glyph" aria-hidden="true">${project.visual === 'aircraft' ? '✈' : project.visual === 'orbit' || project.visual === 'space' ? '◉' : project.visual === 'software' ? '{ }' : '⌁'}</span>`;
        return `<a class="home-project-card" href="projects.html#project-${escapeHtml(project.id)}">
          <div class="home-project-art">${artwork}<span>${escapeHtml(project.code || 'ALTAIR / PROJECT')}</span></div>
          <div class="home-project-copy">
            <div class="project-meta"><span>${escapeHtml(project.category)}</span><span class="status status-${escapeHtml(project.status).toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(project.status)}</span></div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary)}</p>
            <span class="home-project-link">VIEW PROJECT <b>↗</b></span>
          </div>
        </a>`;
      }).join('');
      count.textContent = `${Math.min(visible.length, 3)} featured ${Math.min(visible.length, 3) === 1 ? 'project' : 'projects'}`;
      empty.hidden = visible.length > 0;
      return;
    }

    portfolio.innerHTML = visible.map(project => {
      const tags = (project.tags || [project.category]).map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
      return `<article class="portfolio-card" id="project-${escapeHtml(project.id)}">
        <div class="portfolio-art art-${escapeHtml(project.visual || 'default')}">
          <span class="art-index">${escapeHtml(project.code || 'A / —')}</span>
          <div class="art-glyph" aria-hidden="true">${project.visual === 'aircraft' ? '✈' : project.visual === 'orbit' || project.visual === 'space' ? '◉' : project.visual === 'software' ? '{ }' : project.visual === 'uav' ? '⌖' : '⌁'}</div>
          <span class="art-caption">${escapeHtml(project.category)} / ${escapeHtml(project.phase || 'Exploration')}</span>
        </div>
        <div class="portfolio-card-body">
          <div class="project-meta"><span>${escapeHtml(project.category)}</span><span class="status status-${escapeHtml(project.status).toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(project.status)}</span></div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
          <div class="project-tags">${tags}</div>
          <div class="project-brief"><span>OBJECTIVE</span><p>${escapeHtml(project.objective || 'Define the project objective and measurable success criteria.')}</p></div>
          <div class="project-next"><span>NEXT STEP</span><p>${escapeHtml(project.nextStep || 'Document the next concrete milestone.')}</p></div>
          <div class="project-resources"><div class="resource-heading"><span>PROJECT FILES</span><span>${(project.resources || []).length.toString().padStart(2, '0')} FILES</span></div>${renderResources(project.resources)}</div>
        </div>
      </article>`;
    }).join('');

    count.textContent = `${visible.length} ${visible.length === 1 ? 'project' : 'projects'} in register`;
    empty.hidden = visible.length > 0;
  };

  [search, category, status].filter(Boolean).forEach(control => control.addEventListener('input', render));
  render();
}
