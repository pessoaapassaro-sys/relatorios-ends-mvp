'use client';

import { useState } from 'react';
import { NewReport } from './new-report';
import {
  LayoutDashboard, Files, FilePlus2, ClipboardList, Settings2, ShieldCheck, Search,
  Bell, ChevronRight, ArrowUpRight, Database, FileSpreadsheet, ScanLine, Plus,
  Trash2, Info, CircleCheck, Clock3, Layers3, Ruler, Activity, ArrowRight,
  Menu, X, Download, CheckCheck
} from 'lucide-react';

type Screen = 'dashboard' | 'new' | 'reports' | 'templates' | 'settings';
const menu: Array<{key: Screen; label: string; icon: typeof LayoutDashboard}> = [
  {key:'dashboard',label:'Visão geral',icon: LayoutDashboard},
  {key:'new',label:'Novo relatório',icon: FilePlus2},
  {key:'reports',label:'Relatórios',icon: ClipboardList},
  {key:'templates',label:'Biblioteca de modelos',icon: Files},
  {key:'settings',label:'Configurações',icon: Settings2}
];
function Eyebrow({children}:{children:React.ReactNode}) {return <p className="eyebrow">{children}</p>}
function EmptyState({icon:Icon,title,description,cta}:{icon:typeof Files;title:string;description:string;cta?:React.ReactNode}) {
  return <div className="empty"><div className="empty-icon"><Icon size={26}/></div><h3>{title}</h3><p>{description}</p>{cta}</div>;
}

export function EndsApp() {
  const [screen,setScreen] = useState<Screen>('dashboard');
  const [mobileMenu,setMobileMenu] = useState(false);
  const changeScreen = (value:Screen)=>{setScreen(value);setMobileMenu(false)};
  const sidebar=<>
    <div className="brand"><div className="brand-mark"><ScanLine size={24} strokeWidth={2.3}/></div><div><strong>Relatórios ENDs</strong><small>Workspace de inspeções</small></div></div>
    <div className="workspace"><div className="workspace-icon">R</div><div><strong>Ambiente de testes</strong><span>Protótipo · v0.2</span></div><ChevronRight size={16}/></div>
    <div className="nav-section">MENU PRINCIPAL</div>
    <nav>{menu.map(item=>{const Icon=item.icon;return <button key={item.key} className={'nav-item '+(item.key===screen?'active':'')} onClick={()=>changeScreen(item.key)}><Icon size={18}/><span>{item.label}</span>{item.key===screen&&<span className="nav-current"/>}</button>})}</nav>
    <div className="sidebar-foot"><div className="sidebar-help"><div className="mini-glyph"><ShieldCheck size={18}/></div><strong>Processo seguro</strong><p>Os dados técnicos dependem de revisão do inspetor responsável.</p></div><div className="sidebar-user"><span className="avatar">PT</span><div><strong>Protótipo visual</strong><small>Sem conta conectada</small></div><span className="user-dots">•••</span></div></div>
  </>;
  return <div className="shell">
    <aside className={'sidebar '+(mobileMenu?'mobile-open':'')}>{sidebar}</aside>
    {mobileMenu&&<button className="scrim" aria-label="Fechar menu" onClick={()=>setMobileMenu(false)}/>}
    <main className="main">
      <header className="topbar"><div className="crumb"><button className="mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Abrir menu">{mobileMenu?<X size={20}/>:<Menu size={20}/>}</button><span>Plataforma</span><ChevronRight size={15}/><strong>{menu.find(p=>p.key===screen)?.label}</strong></div><div className="top-actions"><div className="top-status"><span/> Ambiente demonstrativo</div><button className="icon-button" aria-label="Notificações desativadas" title="Notificações disponíveis após integração"><Bell size={19}/></button><div className="avatar small">PT</div></div></header>
      <div className="container"><div className="demo-banner"><Info size={17}/><span><b>Protótipo de interface:</b> anexos e leituras ficam nesta sessão. Leitura automática e geração do Excel/PDF ainda não estão conectadas.</span></div>
      {screen==='dashboard'&&<>
        <div className="page-header split"><div><Eyebrow>PAINEL OPERACIONAL</Eyebrow><h1>Visão geral</h1><p>Centralize inspeções, medições e relatórios em um só lugar.</p></div><button className="primary-btn" onClick={()=>changeScreen('new')}><Plus size={17}/> Novo relatório</button></div>
        <div className="metrics"><div className="metric"><span>Relatórios cadastrados</span><div><strong>0</strong><FileSpreadsheet size={22}/></div><small>Aguardando primeira inspeção</small></div><div className="metric"><span>Em revisão</span><div><strong>0</strong><Clock3 size={22}/></div><small>Nenhuma revisão pendente</small></div><div className="metric"><span>Modelos ativos</span><div><strong>0</strong><Layers3 size={22}/></div><small>Cadastre seu primeiro modelo</small></div><div className="metric"><span>Medições registradas</span><div><strong>0</strong><Activity size={22}/></div><small>Sem dados de campo</small></div></div>
        <div className="dashboard-grid"><section className="panel large"><div className="panel-heading"><div><h2>Relatórios recentes</h2><p>Acompanhe os documentos produzidos pela equipe.</p></div><button className="text-btn" onClick={()=>changeScreen('reports')}>Ver todos <ArrowUpRight size={15}/></button></div><EmptyState icon={ClipboardList} title="Nenhum relatório por enquanto" description="Os relatórios das inspeções aparecerão aqui assim que forem cadastrados." cta={<button className="outline-btn" onClick={()=>changeScreen('new')}>Preparar primeiro relatório <ArrowRight size={16}/></button>}/></section><section className="panel"><div className="panel-heading"><div><h2>Etapas do sistema</h2><p>Status de implantação do MVP.</p></div></div><div className="timeline"><div className="timeline-item complete"><span className="timeline-dot"><CheckCheck size={14}/></span><div><b>Base Supabase</b><p>Tabelas e segurança inicial configuradas</p></div></div><div className="timeline-item current"><span className="timeline-dot"><Clock3 size={14}/></span><div><b>Interface web</b><p>Seleção de ensaio, anexos e conferência manual</p></div></div><div className="timeline-item"><span className="timeline-dot"><Database size={14}/></span><div><b>Login e persistência</b><p>Integração com contas e registros</p></div></div><div className="timeline-item"><span className="timeline-dot"><FileSpreadsheet size={14}/></span><div><b>Gerador Excel / PDF</b><p>Mapeamento e processamento de modelos</p></div></div></div></section></div>
      </>}
      {screen==='reports'&&<><div className="page-header split"><div><Eyebrow>DOCUMENTOS TÉCNICOS</Eyebrow><h1>Relatórios</h1><p>Gerencie documentos, estados de revisão e histórico de inspeções.</p></div><button className="primary-btn" onClick={()=>changeScreen('new')}><Plus size={17}/> Novo relatório</button></div><section className="panel"><div className="toolbar"><div className="fake-search"><Search size={17}/> Pesquisar relatório ou TAG...</div><div className="toolbar-chip">Todos os status</div></div><EmptyState icon={Files} title="A biblioteca de relatórios está vazia" description="Os relatórios aparecerão aqui quando a aplicação estiver conectada ao banco de dados." cta={<button className="outline-btn" onClick={()=>changeScreen('new')}>Abrir formulário de inspeção <ArrowRight size={16}/></button>}/></section></>}
      {screen==='templates'&&<><div className="page-header split"><div><Eyebrow>BIBLIOTECA TÉCNICA</Eyebrow><h1>Modelos de relatório</h1><p>Modelos oficiais Excel serão cadastrados e mapeados por ensaio e cliente.</p></div><button className="disabled-btn" disabled title="Cadastro de modelos será conectado ao Supabase"><Plus size={17}/> Cadastrar modelo</button></div><div className="template-grid"><div className="template-card"><div className="template-icon"><Ruler size={25}/></div><span className="tag">Técnica planejada</span><h2>Ultrassom B-scan</h2><p>Estrutura de medições de espessura, pontos, tabela e croquis.</p><div className="template-bottom"><span>Modelo Excel pendente de cadastro</span><Clock3 size={16}/></div></div><div className="template-card"><div className="template-icon purple"><ScanLine size={25}/></div><span className="tag">Referências analisadas</span><h2>Phased Linha</h2><p>Metal de base / corrosão. Capa, resultados e croquis por indicação. Padrão de referência Braskem.</p><div className="template-bottom"><span>Modelo Excel pendente de cadastro</span><Clock3 size={16}/></div></div></div><div className="informational"><Info size={17}/> O sistema manterá o layout original de cada contratante; não será criado um relatório genérico único.</div></>}
      {screen==='settings'&&<><div className="page-header"><Eyebrow>AMBIENTE DE DESENVOLVIMENTO</Eyebrow><h1>Configurações</h1><p>Preferências e conexões necessárias para o MVP.</p></div><section className="panel settings"><h2>Conexões previstas</h2><div className="setting-row"><Database size={20}/><div><b>Supabase</b><p>Base de dados provisionada; autenticação da interface pendente.</p></div><span className="tag">A integrar</span></div><div className="setting-row"><FileSpreadsheet size={20}/><div><b>Motor de relatórios</b><p>Serviço responsável por preservar planilhas e gráficos.</p></div><span className="tag">A integrar</span></div><div className="setting-row"><ShieldCheck size={20}/><div><b>Validação técnica</b><p>Emissão oficial dependerá de aprovação do profissional responsável.</p></div><span className="tag">Planejado</span></div></section></>}
      {screen==='new'&&<NewReport/>}
      <footer className="footer"><span>Relatórios ENDs · Interface de avaliação</span><span>Versão 0.2 — sem emissão oficial</span></footer>
      </div>
    </main>
  </div>;
}
