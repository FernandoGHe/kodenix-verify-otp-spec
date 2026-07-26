
(function(){
  var versionMeta=document.querySelector('meta[name="docs-version"]');
  var currentVersion=versionMeta&&versionMeta.getAttribute('content');
  var scriptUrl=document.currentScript&&document.currentScript.src;
  if(currentVersion&&scriptUrl&&window.fetch){
    var versionUrl=new URL('../../version.json',scriptUrl);
    versionUrl.searchParams.set('_',Date.now().toString());
    fetch(versionUrl.toString(),{cache:'no-store'}).then(function(response){
      return response.ok?response.json():null;
    }).then(function(latest){
      if(!latest||!latest.version)return;
      var pageUrl=new URL(window.location.href);
      if(latest.version!==currentVersion){
        if(pageUrl.searchParams.get('__docs')!==latest.version){
          pageUrl.searchParams.set('__docs',latest.version);
          window.location.replace(pageUrl.toString());
        }
      }else if(pageUrl.searchParams.has('__docs')){
        pageUrl.searchParams.delete('__docs');
        window.history.replaceState(null,'',pageUrl.toString());
      }
    }).catch(function(){ /* La documentación sigue disponible sin el chequeo. */ });
  }

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
