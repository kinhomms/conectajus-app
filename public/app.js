
const $ = (s)=>document.querySelector(s);
const app = $('#app');

function token(){return localStorage.getItem('cj_token')}
function user(){try{return JSON.parse(localStorage.getItem('cj_user')||'null')}catch{return null}}
function saveAuth(d){localStorage.setItem('cj_token',d.token);localStorage.setItem('cj_user',JSON.stringify(d.user))}
function logout(){localStorage.removeItem('cj_token');localStorage.removeItem('cj_user');location.hash='#/';render()}
async function api(path,opt={}){
  const headers={'Content-Type':'application/json',...(opt.headers||{})};
  if(token()) headers.Authorization='Bearer '+token();
  const r=await fetch('/api'+path,{...opt,headers});
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error||'Erro');
  return d;
}
function nav(){
  const u=user();let h=`<a href="#/">Início</a>`;
  if(!u) h+=`<a href="#/login">Entrar</a><a href="#/cadastro">Cadastro</a>`;
  if(u) h+=`<a href="#/triagem">Triagem</a><a href="#/cliente">Cliente</a>`;
  if(u?.role==='admin') h+=`<a href="#/admin">Admin</a>`;
  if(u) h+=`<a href="javascript:logout()">Sair</a>`;
  $('#nav').innerHTML=h;
}
function needLogin(){if(!user()){location.hash='#/login';render();return false}return true}
function mat(v){const l=v<=30?'Caso incompleto':v<=60?'Parcialmente estruturado':v<=80?'Boa base de análise':'Caso bem estruturado';return `<div class="progress"><span style="width:${v||0}%"></span></div><p><strong>${v||0}%</strong> — ${l}</p>`}

function home(){
app.innerHTML=`<section class="hero">
<div class="panel">
<h1>ConectaJus 2.0</h1>
<p>Plataforma jurídica inteligente para triagem, diagnóstico preliminar, organização de documentos e gestão de atendimentos.</p>
<div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="#/triagem">Iniciar triagem</a><a class="btn light" href="#/login">Acessar painel</a></div>
</div>
<div class="card"><h2>Estrutura profissional</h2><ul><li>Área do cliente</li><li>Painel administrativo moderno</li><li>Diagnóstico por IA inicial</li><li>Preparação para banco em nuvem</li><li>Preparação para advogados parceiros</li></ul><p><strong>Admin:</strong><br>admin@conectajus.local<br>senha: 1234</p></div>
</section>`;
}
function login(){
app.innerHTML=`<section class="panel" style="max-width:520px"><h1>Entrar</h1><form class="form" id="f"><label>E-mail<input name="email" value="admin@conectajus.local"></label><label>Senha<input name="password" type="password" value="1234"></label><button class="btn">Entrar</button><p id="e" class="muted"></p></form></section>`;
$('#f').onsubmit=async ev=>{ev.preventDefault();try{const d=await api('/auth/login',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(ev.target)))});saveAuth(d);location.hash=d.user.role==='admin'?'#/admin':'#/cliente';render()}catch(err){$('#e').textContent=err.message}};
}
function cadastro(){
app.innerHTML=`<section class="panel" style="max-width:760px"><h1>Criar conta</h1><form class="form" id="f"><div class="grid2"><label>Nome<input name="name" required></label><label>WhatsApp<input name="phone"></label></div><div class="grid2"><label>E-mail<input name="email" type="email" required></label><label>Senha<input name="password" type="password" required></label></div><div class="grid2"><label>Cidade<input name="city"></label><label>Estado<input name="state"></label></div><label style="display:flex;gap:10px;align-items:center"><input type="checkbox" name="termsAccepted" style="width:auto" required>Aceito os termos de uso e privacidade.</label><button class="btn">Cadastrar</button><p id="e" class="muted"></p></form></section>`;
$('#f').onsubmit=async ev=>{ev.preventDefault();const b=Object.fromEntries(new FormData(ev.target));b.termsAccepted=b.termsAccepted==='on';try{const d=await api('/auth/register',{method:'POST',body:JSON.stringify(b)});saveAuth(d);location.hash='#/triagem';render()}catch(err){$('#e').textContent=err.message}};
}
function triagem(){
if(!needLogin())return;
app.innerHTML=`<section class="grid2"><div class="panel"><h1>Triagem Jurídica</h1><form class="form" id="caseForm"><label>Assunto<input name="subject" placeholder="Ex.: desconto indevido, concurso, pensão..."></label><label>Área aproximada<select name="legalArea"><option value="">Identificar automaticamente</option><option>Direito Bancário</option><option>Concursos Públicos</option><option>Direito Administrativo</option><option>Direito do Consumidor</option><option>Direito de Família</option><option>Direito do Trabalho</option><option>Direito à Saúde</option><option>Direito Militar</option></select></label><div class="grid2"><label>Cidade<input name="city"></label><label>Estado<input name="state"></label></div><label>Descrição<textarea name="description" rows="9" required></textarea></label><label>Documentos que possui<input name="documentsText"></label><button class="btn">Abrir caso</button><p id="e" class="muted"></p></form></div><div class="panel"><h2>Chat guiado</h2><div class="chat" id="chat"><div class="msg assistant">Conte o problema. Eu retorno área provável, urgência, perguntas e documentos.</div></div><form class="form" id="chatForm" style="margin-top:12px"><input name="message" placeholder="Digite sua dúvida..."><button class="btn light">Enviar</button></form></div></section>`;
$('#caseForm').onsubmit=async ev=>{ev.preventDefault();try{await api('/cases',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(ev.target)))});location.hash='#/cliente';render()}catch(err){$('#e').textContent=err.message}};
$('#chatForm').onsubmit=async ev=>{ev.preventDefault();const m=new FormData(ev.target).get('message');if(!m)return;$('#chat').insertAdjacentHTML('beforeend',`<div class="msg user">${m}</div>`);ev.target.reset();try{const d=(await api('/ai/diagnosis',{method:'POST',body:JSON.stringify({description:m})})).diagnosis;$('#chat').insertAdjacentHTML('beforeend',`<div class="msg assistant"><strong>Área:</strong> ${d.legalArea}<br><strong>Urgência:</strong> ${d.urgencyLevel}<br><strong>Maturidade:</strong> ${d.maturityScore}%<br><br>${d.summary}<br><br><strong>Perguntas:</strong><ul>${d.followUpQuestions.map(x=>`<li>${x}</li>`).join('')}</ul><strong>Documentos:</strong><ul>${d.suggestedDocuments.map(x=>`<li>${x}</li>`).join('')}</ul><p class="muted">${d.warning}</p></div>`);$('#chat').scrollTop=$('#chat').scrollHeight}catch(err){$('#chat').insertAdjacentHTML('beforeend',`<div class="msg assistant">${err.message}</div>`)}};
}
async function cliente(){
if(!needLogin())return;const d=await api('/cases');
app.innerHTML=`<div class="section-title"><div><h1>Área do Cliente</h1><p class="muted">Acompanhe seus casos e pendências.</p></div><a class="btn" href="#/triagem">Novo caso</a></div><section class="grid">${d.cases.map(c=>`<div class="case-card"><div class="status-row"><span class="badge">${c.status}</span><span class="badge ${['alta','crítica'].includes(c.urgencyLevel)?'red':''}">${c.urgencyLevel}</span></div><h2>${c.subject||c.legalArea}</h2><p>${c.aiSummary}</p>${mat(c.maturityScore)}<a class="btn light" href="#/caso/${c.id}">Abrir caso</a></div>`).join('')||'<p>Nenhum caso ainda.</p>'}</section>`;
}
async function caso(id){
if(!needLogin())return;const d=await api('/cases/'+id),c=d.case;
app.innerHTML=`<section class="grid2"><div class="panel"><h1>${c.internalNumber}</h1><div class="status-row"><span class="badge">${c.status}</span><span class="badge ${['alta','crítica'].includes(c.urgencyLevel)?'red':''}">${c.urgencyLevel}</span></div><h2>${c.subject||c.legalArea}</h2>${mat(c.maturityScore)}<h3>Descrição</h3><p>${c.description}</p><h3>Documentos sugeridos</h3><ul>${c.aiDiagnosis.suggestedDocuments.map(x=>`<li>${x}</li>`).join('')}</ul><p class="muted">${c.aiDiagnosis.warning}</p></div><div class="panel"><h2>Informar documento</h2><form class="form" id="docForm"><label>Nome<input name="fileName"></label><label>Categoria<input name="category"></label><label>Observação<textarea name="description" rows="4"></textarea></label><button class="btn">Salvar</button></form><h2>Documentos</h2><div class="grid">${d.documents.map(x=>`<div class="case-card"><strong>${x.fileName}</strong><span>${x.category}</span><p>${x.description||''}</p></div>`).join('')||'<p>Nenhum documento informado.</p>'}</div></div></section>`;
$('#docForm').onsubmit=async ev=>{ev.preventDefault();await api(`/cases/${id}/documents`,{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(ev.target)))});caso(id)};
}
async function admin(){
if(!needLogin())return;if(user()?.role!=='admin'){app.innerHTML='<p>Acesso restrito.</p>';return}
const dash=await api('/admin/dashboard'),data=await api('/admin/cases');
app.innerHTML=`<section class="admin-shell"><aside class="sidebar"><h2>ConectaJus Admin</h2><a href="#/admin">Dashboard</a><a href="#/triagem">Nova triagem</a><a href="#/cliente">Área cliente</a></aside><div><div class="section-title"><div><h1>Dashboard Administrativo</h1><p class="muted">Gestão de casos e atendimentos.</p></div></div><section class="grid4"><div class="card metric"><p>Total</p><strong>${dash.metrics.totalCases}</strong></div><div class="card metric"><p>Novos</p><strong>${dash.metrics.newCases}</strong></div><div class="card metric"><p>Urgentes</p><strong>${dash.metrics.urgentCases}</strong></div><div class="card metric"><p>Maturidade média</p><strong>${dash.metrics.averageMaturity}%</strong></div></section><section class="panel" style="margin:20px 0"><form class="grid4" id="filterForm"><input name="search" placeholder="Buscar cliente, área ou resumo"><select name="legalArea"><option value="">Área</option><option>Direito Bancário</option><option>Concursos Públicos</option><option>Direito Administrativo</option><option>Direito do Consumidor</option><option>Direito de Família</option><option>Direito do Trabalho</option></select><select name="status"><option value="">Status</option><option value="new">Novo</option><option value="under_review">Em análise</option><option value="waiting_documents">Aguardando documentos</option><option value="contacted">Cliente contatado</option><option value="converted">Convertido</option><option value="closed">Encerrado</option></select><button class="btn">Filtrar</button></form></section><section id="adminCases" class="grid">${renderAdminCases(data.cases)}</section></div></section>`;
$('#filterForm').onsubmit=async ev=>{ev.preventDefault();const p=new URLSearchParams(Object.fromEntries(new FormData(ev.target)));const f=await api('/admin/cases?'+p.toString());$('#adminCases').innerHTML=renderAdminCases(f.cases)};
}
function renderAdminCases(cases){return cases.map(c=>`<div class="case-card"><div class="status-row"><span class="badge">${c.status}</span><span class="badge ${['alta','crítica'].includes(c.urgencyLevel)?'red':''}">${c.urgencyLevel}</span></div><h2>${c.internalNumber} — ${c.subject||c.legalArea}</h2><p><strong>Cliente:</strong> ${c.user?.name||''} • ${c.user?.phone||''}</p><p>${c.aiSummary}</p>${mat(c.maturityScore)}<a class="btn light" href="#/admin/caso/${c.id}">Gerenciar</a></div>`).join('')||'<p>Nenhum caso encontrado.</p>'}
async function adminCaso(id){
if(!needLogin())return;if(user()?.role!=='admin'){app.innerHTML='<p>Acesso restrito.</p>';return}
const d=await api('/admin/cases/'+id),c=d.case,u=c.user||{},summary=`RESUMO CONECTAJUS\n\nNúmero: ${c.internalNumber}\nCliente: ${u.name||''}\nTelefone: ${u.phone||''}\nÁrea: ${c.legalArea}\nStatus: ${c.status}\nMaturidade: ${c.maturityScore}%\n\nDescrição:\n${c.description}\n\nResumo IA:\n${c.aiSummary}`;
app.innerHTML=`<section class="grid2"><div class="panel"><h1>${c.internalNumber}</h1><div class="status-row"><span class="badge">${c.status}</span><span class="badge ${['alta','crítica'].includes(c.urgencyLevel)?'red':''}">${c.urgencyLevel}</span></div>${mat(c.maturityScore)}<h3>Cliente</h3><p><strong>${u.name||''}</strong><br>${u.email||''}<br>${u.phone||''}</p>${u.phone?`<a class="btn gold" target="_blank" href="https://wa.me/55${String(u.phone).replace(/\D/g,'')}">Abrir WhatsApp</a>`:''}<h3>Descrição</h3><p>${c.description}</p><h3>Documentos sugeridos</h3><ul>${c.aiDiagnosis.suggestedDocuments.map(x=>`<li>${x}</li>`).join('')}</ul><h3>Status</h3><div class="grid3">${['under_review','waiting_documents','contacted','converted','closed'].map(s=>`<button class="btn light" onclick="setStatus('${c.id}','${s}')">${s}</button>`).join('')}</div></div><div class="panel"><h2>Exportar resumo</h2><textarea id="exportBox" rows="12">${summary}</textarea><button class="btn" onclick="copyExport()">Copiar resumo</button><h2>Observações internas</h2><form class="form" id="noteForm"><textarea name="note" rows="4"></textarea><button class="btn">Adicionar nota</button></form><div class="grid" style="margin-top:12px">${d.notes.map(n=>`<div class="case-card"><p>${n.note}</p><small>${new Date(n.createdAt).toLocaleString('pt-BR')}</small></div>`).join('')||'<p>Nenhuma nota.</p>'}</div></div></section>`;
$('#noteForm').onsubmit=async ev=>{ev.preventDefault();await api(`/admin/cases/${id}/notes`,{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(ev.target)))});adminCaso(id)};
}
window.setStatus=async(id,status)=>{await api(`/admin/cases/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});adminCaso(id)}
window.copyExport=async()=>{await navigator.clipboard.writeText($('#exportBox').value);alert('Resumo copiado.')}
function render(){nav();const p=(location.hash||'#/').replace('#/','').split('/');if(p[0]==='')return home();if(p[0]==='login')return login();if(p[0]==='cadastro')return cadastro();if(p[0]==='triagem')return triagem();if(p[0]==='cliente')return cliente();if(p[0]==='caso')return caso(p[1]);if(p[0]==='admin'&&!p[1])return admin();if(p[0]==='admin'&&p[1]==='caso')return adminCaso(p[2]);home()}
window.addEventListener('hashchange',render);render();
