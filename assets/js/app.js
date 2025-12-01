// Simple publications renderer and filters
(async function(){
  const pubListEl = document.getElementById('pub-list');
  const searchEl = document.getElementById('pub-search');
  const typeEl = document.getElementById('pub-type');
  const yearEl = document.getElementById('pub-year');

  let pubs = [];

  async function loadPubs(){
    try{
      const res = await fetch('publications/publications.json');
      pubs = await res.json();
      populateYearFilter();
      render();
    } catch(e){
      pubListEl.innerHTML = '<li class="pub-item">Could not load publications. Make sure publications/publications.json exists.</li>';
      console.error(e);
    }
  }

  function populateYearFilter(){
    const years = Array.from(new Set(pubs.map(p=>p.year))).sort((a,b)=>b-a);
    yearEl.innerHTML = '<option value="">All years</option>' + years.map(y=>`<option value="${y}">${y}</option>`).join('');
  }

  function formatAuthors(authors){
    return (authors || []).join(', ');
  }

  function render(){
    const q = (searchEl.value || '').toLowerCase().trim();
    const t = typeEl.value;
    const y = yearEl.value;

    const filtered = pubs.filter(p=>{
      if(t && p.type !== t) return false;
      if(y && String(p.year) !== String(y)) return false;
      if(!q) return true;
      const hay = [p.title, formatAuthors(p.authors), p.venue, p.abstract].join(' ').toLowerCase();
      return hay.includes(q);
    });

    if(filtered.length === 0){
      pubListEl.innerHTML = '<li class="pub-item">No publications match your search / filters.</li>';
      return;
    }

    pubListEl.innerHTML = filtered.map(p=>{
      const doiLink = p.doi ? `<a href="${p.url || ('https://doi.org/' + p.doi)}" target="_blank" rel="noopener">View</a>` : (p.url ? `<a href="${p.url}" target="_blank" rel="noopener">View</a>` : '');
      const citation = `${formatAuthors(p.authors)} (${p.year}). ${p.title}. ${p.venue}${p.pages ? ', ' + p.pages : ''}.`;
      return `
        <li class="pub-item">
          <div class="pub-meta"><strong>${p.title}</strong></div>
          <div>${formatAuthors(p.authors)} — <span class="pub-meta">${p.venue} • ${p.year}</span></div>
          ${p.abstract ? `<p class="pub-abstract" style="margin-top:8px;color:var(--muted)">${p.abstract}</p>` : ''}
          <div class="pub-actions">
            ${doiLink}
            <button data-citation="${escapeHtml(citation)}" class="copy-citation">Copy citation</button>
            ${p.pdf ? `<a href="${p.pdf}" target="_blank" rel="noopener">PDF</a>` : ''}
          </div>
        </li>`;
    }).join('');
    attachCopyHandlers();
  }

  function attachCopyHandlers(){
    document.querySelectorAll('.copy-citation').forEach(btn=>{
      btn.addEventListener('click', async e=>{
        const cit = unescapeHtml(btn.getAttribute('data-citation'));
        try{
          await navigator.clipboard.writeText(cit);
          btn.textContent = 'Copied!';
          setTimeout(()=> btn.textContent = 'Copy citation', 1400);
        } catch(err){
          alert('Could not copy. Here is the citation:\n\n' + cit);
        }
      });
    });
  }

  function escapeHtml(s = '') {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function unescapeHtml(s = '') {
    return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
  }

  // event listeners
  [searchEl, typeEl, yearEl].forEach(el=>{
    el.addEventListener('input', () => render());
    el.addEventListener('change', () => render());
  });

  await loadPubs();
})();
