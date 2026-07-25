
(function(){
  var storageKey='kodenix-docs-theme';
  var savedTheme=null;
  try{savedTheme=localStorage.getItem(storageKey);}catch(e){}
  var theme=savedTheme||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
  document.documentElement.setAttribute('data-theme',theme);

  var toggle=document.createElement('button');
  toggle.type='button';
  toggle.className='theme-toggle';
  toggle.setAttribute('aria-live','polite');

  function updateToggle(){
    var current=document.documentElement.getAttribute('data-theme');
    toggle.textContent=current==='dark'?'Modo claro':'Modo noche';
    toggle.setAttribute('aria-label',current==='dark'?'Activar modo claro':'Activar modo noche');
  }

  toggle.addEventListener('click',function(){
    var next=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);
    try{localStorage.setItem(storageKey,next);}catch(e){}
    updateToggle();
  });

  updateToggle();
  document.body.appendChild(toggle);

  document.querySelectorAll('pre code.language-mermaid, pre code.lang-mermaid').forEach(function(code){
    var div=document.createElement('div');
    div.className='mermaid';
    div.textContent=code.textContent;
    code.parentElement.replaceWith(div);
  });
})();
