'use client';

import { useMemo, useState } from 'react';
import {
  LayoutDashboard, Files, FilePlus2, ClipboardList, Settings2, ShieldCheck, Search,
  Bell, ChevronRight, ArrowUpRight, Database, FileSpreadsheet, ScanLine, Plus,
  Trash2, Info, CircleCheck, Clock3, Layers3, Ruler, Activity, ArrowRight,
  Menu, X, Download, CheckCheck
} from 'lucide-react';

type Screen = 'dashboard' | 'new' | 'reports' | 'templates' | 'settings';
type InspectionPoint = {id: number; label: string; readings: string};
type PreviewPoint = {label: string; count: number; minimum: number; loss: number | null};
const menu: Array<{key: Screen; label: string; icon: typeof LayoutDashboard}> = [
  {key:'dashboard',label:'Visão geral',icon: LayoutDashboard},
  {key:'new',label:'Novo relatório',icon: FilePlus2},
  {key:'reports',label:'Relatórios',icon: ClipboardList},
  {key:'templates',label:'Biblioteca de modelos',icon: Files},
  {key:'settings',label:'Configurações',icon: Settings2}
];
const fmt = (n:number) => n.toLocaleString('pt-BR',{minimumFractionDigits:2, maximumFractionDigits:2});
function parseReadings(raw:string): number[] {
  // Leituras separadas por ponto e vírgula ou nova linha: vírgula é separador decimal PT-BR.
  return raw.split(/[;\n]+/).map(v => Number(v.trim().replace(',','.')))
    .filter(v => Number.isFinite(v) && v > 0);
}
function Eyebrow({children}:{children:React.ReactNode}) {return <p className="eyebrow">{children}</p>}
function EmptyState({icon:Icon,title,description,cta}:{icon:typeof Files;title:string;description:string;cta?:React.ReactNode}) {
  return <div className="empty"><div className="empty-icon"><Icon size={26}/></div><h3>{title}</h3><p>{description}</p>{cta}</div>;
}

export function EndsApp() {
  const [screen,setScreen] = useState<Screen>('dashboard');
  const [mobileMenu,setMobileMenu] = useState(false);
  const [technique,setTechnique] = useState<'B-Scan'|'Phased Array'>('B-Scan');
  const [client,setClient] = useState('');
  const [tag,setTag] = useState('');
  const [reportNo,setReportNo] = useState('');
  const [nominal,setNominal] = useState('');
  const [points,setPoints] = useState<InspectionPoint[]>([{id:1,label:'P1',readings:''}]);
  const [showPreview,setShowPreview] = useState(false);
  const nominalValue = Number(nominal.replace(',','.'));
  const preview = useMemo<PreviewPoint[]>(()=>points.map(p=>{
    const values = parseReadings(p.readings);
    const minimum = values.length ? Math.min(...values) : NaN;
    return {label:p.label||'Sem identificação',count:values.length,minimum,
      loss: values.length && Number.isFinite(nominalValue) && nominalValue>0
        ? ((nominalValue-minimum)/nominalValue)*100 : null};
  }).filter(p=>p.count>0),[points,nominalValue]);
  const validPreview = Boolean(tag.trim() && nominalValue>0 && preview.length);
  const changeScreen = (value:Screen)=>{setScreen(value);setMobileMenu(false)};
  const sidebar=<>
    <div className="brand"><div className="brand-mark"><ScanLine size={24} strokeWidth={2.3}/></div><div><strong>Relatórios ENDs</strong><small>Workspace de inspeções</small></div></div>
    <div className="workspace"><div className="workspace-icon">R</div><div><strong>Ambiente de testes</strong><span>Protótipo · v0.1</span></div><ChevronRight size={16}/></div>
    <div className="nav-section">MENU PRINCIPAL</div>
    <nav>{menu.map(item=>{const Icon=item.icon;return <button key={item.key} className={'nav-item '+(item.key===screen?'active':'')} onClick={()=>changeScreen(item.key)}><Icon size={18}/><span>{item.label}</span>{item.key===screen&&<span className="nav-current"/>}</button>})}</nav>
    <div className="sidebar-foot"><div className="sidebar-help"><div className="mini-glyph"><ShieldCheck size={18}/></div><strong>Processo seguro</strong><p>Os dados técnicos dependem de revisão do inspetor responsável.</p></div><div className="sidebar-user"><span className="avatar">PT</span><div><strong>Protótipo visual</strong><small>Sem conta conectada</small></div><span className="user-dots">•••</span></div></div>
  </>;
  return <div className="shell">
    <aside className={'sidebar '+(mobileMenu?'mobile-open':'')}>{sidebar}</aside>
    {mobileMenu&&<button className="scrim" aria-label="Fechar menu" onClick={()=>setMobileMenu(false)}/>}
    <main className="main">
      <header className="topbar"><div className="crumb"><button className="mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Abrir menu">{mobileMenu?<X size={20}/>:<Menu size={20}/>}</button><span>Plataforma</span><ChevronRight size={15}/><strong>{menu.find(p=>p.key===screen)?.label}</strong></div><div className="top-actions"><div className="top-status"><span/> Ambiente demonstrativo</div><button className="icon-button" aria-label="Notificações desativadas" title="Notificações disponíveis após integração"><Bell size={19}/></button><div className="avatar small">PT</div></div></header>
      <div className="container"><div className="demo-banner"><Info size={17}/><span><b>Protótipo de interface:</b> os dados preenchidos aqui não são enviados ao Supabase nem geram relatórios oficiais.</span></div>
      {screen==='dashboard'&&<>
        <div className="page-header split"><div><Eyebrow>PAINEL OPERACIONAL</Eyebrow><h1>Visão geral</h1><p>Centralize inspeções, medições e relatórios em um só lugar.</p></div><button className="primary-btn" onClick={()=>changeScreen('new')}><Plus size={17}/> Novo relatório</button></div>
        <div className="metrics"><div className="metric"><span>Relatórios cadastrados</span><div><strong>0</strong><FileSpreadsheet size={22}/></div><small>Aguardando primeira inspeção</small></div><div className="metric"><span>Em revisão</span><div><strong>0</strong><Clock3 size={22}/></div><small>Nenhuma revisão pendente</small></div><div className="metric"><span>Modelos ativos</span><div><strong>0</strong><Layers3 size={22}/></div><small>Cadastre seu primeiro modelo</small></div><div className="metric"><span>Medições registradas</span><div><strong>0</strong><Activity size={22}/></div><small>Sem dados de campo</small></div></div>
        <div className="dashboard-grid"><section className="panel large"><div className="panel-heading"><div><h2>Relatórios recentes</h2><p>Acompanhe os documentos produzidos pela equipe.</p></div><button className="text-btn" onClick={()=>changeScreen('reports')}>Ver todos <ArrowUpRight size={15}/></button></div><EmptyState icon={ClipboardList} title="Nenhum relatório por enquanto" description="Os relatórios das inspeções aparecerão aqui assim que forem cadastrados." cta={<button className="outline-btn" onClick={()=>changeScreen('new')}>Preparar primeiro relatório <ArrowRight size={16}/></button>}/></section><section className="panel"><div className="panel-heading"><div><h2>Etapas do sistema</h2><p>Status de implantação do MVP.</p></div></div><div className="timeline"><div className="timeline-item complete"><span className="timeline-dot"><CheckCheck size={14}/></span><div><b>Base Supabase</b><p>Tabelas e segurança inicial configuradas</p></div></div><div className="timeline-item current"><span className="timeline-dot"><Clock3 size={14}/></span><div><b>Interface web</b><p>Protótipo para avaliação visual</p></div></div><div className="timeline-item"><span className="timeline-dot"><Database size={14}/></span><div><b>Login e persistência</b><p>Integração com contas e registros</p></div></div><div className="timeline-item"><span className="timeline-dot"><FileSpreadsheet size={14}/></span><div><b>Gerador Excel / PDF</b><p>Mapeamento e processamento de modelos</p></div></div></div></section></div>
      </>}
      {screen==='reports'&&<><div className="page-header split"><div><Eyebrow>DOCUMENTOS TÉCNICOS</Eyebrow><h1>Relatórios</h1><p>Gerencie documentos, estados de revisão e histórico de inspeções.</p></div><button className="primary-btn" onClick={()=>changeScreen('new')}><Plus size={17}/> Novo relatório</button></div><section className="panel"><div className="toolbar"><div className="fake-search"><Search size={17}/> Pesquisar relatório ou TAG...</div><div className="toolbar-chip">Todos os status</div></div><EmptyState icon={Files} title="A biblioteca de relatórios está vazia" description="Os relatórios aparecerão aqui quando a aplicação estiver conectada ao banco de dados." cta={<button className="outline-btn" onClick={()=>changeScreen('new')}>Abrir formulário de inspeção <ArrowRight size={16}/></button>}/></section></>}
      {screen==='templates'&&<><div className="page-header split"><div><Eyebrow>BIBLIOTECA TÉCNICA</Eyebrow><h1>Modelos de relatório</h1><p>Modelos oficiais Excel serão cadastrados e mapeados por ensaio e cliente.</p></div><button className="disabled-btn" disabled title="Cadastro de modelos será conectado ao Supabase"><Plus size={17}/> Cadastrar modelo</button></div><div className="template-grid"><div className="template-card"><div className="template-icon"><Ruler size={25}/></div><span className="tag">Técnica planejada</span><h2>Ultrassom B-Scan</h2><p>Estrutura de medições de espessura, pontos, tabela e croquis.</p><div className="template-bottom"><span>Modelo Excel pendente de cadastro</span><Clock3 size={16}/></div></div><div className="template-card"><div className="template-icon purple"><ScanLine size={25}/></div><span className="tag">Técnica planejada</span><h2>Phased Array (PAUT)</h2><p>Resultados de inspeção, indicações e evidências do ensaio.</p><div className="template-bottom"><span>Modelo Excel pendente de cadastro</span><Clock3 size={16}/></div></div></div><div className="informational"><Info size={17}/> O sistema manterá o layout original de cada contratante; não será criado um relatório genérico único.</div></>}
      {screen==='settings'&&<><div className="page-header"><Eyebrow>AMBIENTE DE DESENVOLVIMENTO</Eyebrow><h1>Configurações</h1><p>Preferências e conexões necessárias para o MVP.</p></div><section className="panel settings"><h2>Conexões previstas</h2><div className="setting-row"><Database size={20}/><div><b>Supabase</b><p>Base de dados provisionada; autenticação da interface pendente.</p></div><span className="tag">A integrar</span></div><div className="setting-row"><FileSpreadsheet size={20}/><div><b>Motor de relatórios</b><p>Serviço responsável por preservar planilhas e gráficos.</p></div><span className="tag">A integrar</span></div><div className="setting-row"><ShieldCheck size={20}/><div><b>Validação técnica</b><p>Emissão oficial dependerá de aprovação do profissional responsável.</p></div><span className="tag">Planejado</span></div></section></>}
      {screen==='new'&&<><div className="page-header"><Eyebrow>CRIAR DOCUMENTO</Eyebrow><h1>Novo relatório</h1><p>Preencha os dados técnicos para simular a preparação de um relatório END.</p></div><div className="step-indicator"><span className="step-active">01 <strong>Informações</strong></span><span className="step-separator"/><span>02 <strong>Medições</strong></span><span className="step-separator"/><span>03 <strong>Revisão</strong></span></div><div className="form-layout"><section className="panel form-panel"><div className="section-heading"><span className="number-dot">1</span><div><h2>Identificação da inspeção</h2><p>Esses campos serão vinculados ao relatório escolhido.</p></div></div><div className="field"><label>Tipo de ensaio</label><div className="segment"><button className={technique==='B-Scan'?'selected':''} onClick={()=>setTechnique('B-Scan')}><Ruler size={17}/> B-Scan</button><button className={technique==='Phased Array'?'selected':''} onClick={()=>setTechnique('Phased Array')}><ScanLine size={17}/> Phased Array</button></div></div><div className="fields-two"><div className="field"><label>Contratante</label><input placeholder="Ex.: nome do cliente" value={client} onChange={e=>setClient(e.target.value)}/></div><div className="field"><label>Número do relatório</label><input placeholder="Ex.: REL-000/2026" value={reportNo} onChange={e=>setReportNo(e.target.value)}/></div></div><div className="fields-two"><div className="field"><label>TAG do equipamento <i>*</i></label><input placeholder="Ex.: V-1202" value={tag} onChange={e=>setTag(e.target.value)}/></div><div className="field"><label>Espessura nominal (mm) <i>*</i></label><input inputMode="decimal" placeholder="Ex.: 7,9" value={nominal} onChange={e=>setNominal(e.target.value)}/></div></div><div className="section-heading spaced"><span className="number-dot">2</span><div><h2>Leituras da inspeção</h2><p>Separe cada leitura com ponto e vírgula ou quebra de linha.</p></div></div><div className="point-list">{points.map((point,index)=><div className="point-row" key={point.id}><div className="point-head"><b>Ponto {index+1}</b>{points.length>1&&<button aria-label="Remover ponto" className="point-remove" onClick={()=>{setPoints(s=>s.filter(p=>p.id!==point.id));setShowPreview(false)}}><Trash2 size={16}/></button>}</div><div className="fields-point"><div className="field"><label>Identificação</label><input value={point.label} onChange={e=>{setPoints(s=>s.map(p=>p.id===point.id?{...p,label:e.target.value}:p));setShowPreview(false)}}/></div><div className="field"><label>Espessuras (mm)</label><textarea rows={2} placeholder="Ex.: 4,2; 3,9; 4,1" value={point.readings} onChange={e=>{setPoints(s=>s.map(p=>p.id===point.id?{...p,readings:e.target.value}:p));setShowPreview(false)}}/></div></div></div>)}</div><button className="add-point" onClick={()=>{setPoints(s=>[...s,{id:Math.max(...s.map(p=>p.id))+1,label:`P${s.length+1}`,readings:''}]);setShowPreview(false)}}><Plus size={17}/> Adicionar ponto</button><div className="form-footer"><small>Prévia matemática apenas. A interpretação técnica depende do procedimento aplicável.</small><button className="primary-btn" disabled={!validPreview} onClick={()=>setShowPreview(true)}>Calcular prévia <ArrowRight size={16}/></button></div></section><aside className="form-aside"><div className="aside-card"><div className="aside-icon"><FileSpreadsheet size={20}/></div><h3>Modelo Excel</h3><p>Para gerar um documento oficial, primeiro cadastraremos e validaremos o modelo original do cliente.</p><div className="aside-divider"/><div className="aside-status"><span>Status</span><b>Aguardando mapeamento</b></div></div><div className="aside-card muted"><ShieldCheck size={21}/><h3>Segurança técnica</h3><p>O percentual de perda é calculado apenas para conferência. O sistema não emite laudo de aprovação automaticamente.</p></div></aside></div>
      {showPreview&&<section className="panel preview-panel"><div className="panel-heading"><div><h2>Prévia dos cálculos</h2><p>{technique} · {tag} · {client||'Contratante não informado'}</p></div><span className="tag green"><CircleCheck size={14}/> Cálculo preliminar</span></div><div className="table-wrap"><table><thead><tr><th>Ponto</th><th>Leituras</th><th>Esp. nominal</th><th>Menor esp.</th><th>Perda calculada</th></tr></thead><tbody>{preview.map((p,i)=><tr key={`${p.label}-${i}`}><td>{p.label}</td><td>{p.count}</td><td>{fmt(nominalValue)} mm</td><td><b>{fmt(p.minimum)} mm</b></td><td>{p.loss===null?'—':fmt(p.loss)+'%'}</td></tr>)}</tbody></table></div><div className="preview-note"><Info size={16}/> Os valores ainda não foram salvos, associados ao Excel ou validados por um inspetor.</div></section>}
      </>}
      <footer className="footer"><span>Relatórios ENDs · Interface de avaliação</span><span>Versão 0.1 — sem emissão oficial</span></footer>
      </div>
    </main>
  </div>;
}
