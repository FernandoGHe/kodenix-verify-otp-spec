
(function(){
  document.querySelectorAll('pre code.language-mermaid, pre code.lang-mermaid').forEach(function(code){
    var div=document.createElement('div');
    div.className='mermaid';
    div.textContent=code.textContent;
    code.parentElement.replaceWith(div);
  });
})();
