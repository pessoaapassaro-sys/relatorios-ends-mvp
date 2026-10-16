'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, FileSpreadsheet, Plus, Trash2, Upload, Info } from 'lucide-react';

const inspections = ['IRIS', 'Phased Array', 'B-scan', 'Líquido Penetrante'] as const;
type Inspection = typeof inspections[number];
// Opções de catálogo para avaliação; somente Phased Linha tem referências analisadas.
const equipmentOptions: Record<Inspection, readonly string[]> = {
  IRIS: ['Trocador de calor'], 'Phased Array': ['Linha'], 'B-scan': ['Linha'],
  'Líquido Penetrante': ['Linha', 'Vaso de pressão', 'Solda'],
};
type Attachment = { id: string; file: File; purpose: string; url?: string };
type Point = { id: number; label: string; readings: string };
const purposes = ['Croqui com anotações', 'Isométrico / desenho da linha', 'Foto da região inspecionada'];
const steps = ['Ensaio', 'Equipamento', 'Arquivos', 'Conferência'];
const format = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export function readMeasurements(raw: string): number[] | null {
  const tokens = raw.split(/[;\n]+/).map(value => value.trim()).filter(Boolean);
  if (!tokens.length) return null;
  if (tokens.some(value => !/^\d+(?:[.,]\d+)?$/.test(value))) return null;
  const values = tokens.map(value => Number(value.replace(',', '.')));
  return values.every(Number.isFinite) ? values : null;
}

export function NewReport() {
  const [step, setStep] = useState(0);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [equipment, setEquipment] = useState('');
  const [tag, setTag] = useState('');
  const [client, setClient] = useState('');
  const [reportNo, setReportNo] = useState('');
  const [nominal, setNominal] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [fileError, setFileError] = useState('');
  const [points, setPoints] = useState<Point[]>([{ id: 1, label: 'P1', readings: '' }]);
  const [reviewed, setReviewed] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const urls = useRef(new Set<string>());
  useEffect(() => () => { urls.current.forEach(url => URL.revokeObjectURL(url)); }, []);
  const phasedLine = inspection === 'Phased Array' && equipment === 'Linha';
  const thickness = inspection !== 'Líquido Penetrante';
  const nominalValue = Number(nominal.replace(',', '.'));
  const results = points.map(point => {
    const values = readMeasurements(point.readings);
    const minimum = values ? Math.min(...values) : null;
    return { ...point, minimum, loss: minimum !== null && nominalValue > 0 ? (nominalValue - minimum) / nominalValue * 100 : null };
  });
  const labels = points.map(point => point.label.trim().toUpperCase());
  const duplicates = new Set(labels).size !== labels.length;
  const readingsValid = thickness && Number.isFinite(nominalValue) && nominalValue > 0 && results.every(point => point.label.trim() && point.minimum !== null && point.minimum <= nominalValue) && !duplicates;
  const hasSketch = attachments.some(file => file.purpose === purposes[0]);
  const hasDrawing = attachments.some(file => file.purpose === purposes[1]);
  const canContinue = step === 0 ? Boolean(inspection) : step === 1 ? Boolean(equipment && tag.trim()) : hasSketch;
  const model = phasedLine ? 'Phased Linha — Metal de base / Corrosão' : inspection && equipment ? `${inspection} — ${equipment}` : 'Selecione o ensaio e o equipamento';

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next: Attachment[] = [];
    const errors: string[] = [];
    for (const file of Array.from(files)) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) { errors.push(`${file.name}: use JPG, PNG, WebP ou PDF.`); continue; }
      if (file.size > 15 * 1024 * 1024) { errors.push(`${file.name}: o limite é 15 MB por arquivo.`); continue; }
      if (attachments.length + next.length >= 12) { errors.push('O limite é 12 arquivos por relatório.'); break; }
      const url = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      if (url) urls.current.add(url);
      next.push({ id: crypto.randomUUID(), file, purpose: purposes[0], url });
    }
    setAttachments(current => [...current, ...next]);
    setFileError(errors.join(' ')); setReviewed(false); setDownloaded(false);
  }
  function removeFile(id: string) {
    const file = attachments.find(item => item.id === id);
    if (file?.url) { URL.revokeObjectURL(file.url); urls.current.delete(file.url); }
    setAttachments(current => current.filter(item => item.id !== id)); setReviewed(false);
  }
  function updatePoint(id: number, field: 'label' | 'readings', value: string) {
    setPoints(current => current.map(point => point.id === id ? { ...point, [field]: value } : point));
    setReviewed(false); setDownloaded(false);
  }
  function downloadDraft() {
    const payload = {
      tipo: 'Rascunho de teste — não é o relatório Excel preenchido', ensaio: inspection, equipamento: equipment,
      tag, cliente: client, numero: reportNo, modelo: model, origemLeituras: 'Digitação e conferência manual',
      espessuraNominal: nominalValue, pontos: results.map(point => ({ ponto: point.label, leituras: readMeasurements(point.readings), remanescente: point.minimum, perdaMm: nominalValue - point.minimum!, perdaPercentual: point.loss, observacao: point.minimum === 0 && phasedLine ? 'Linha furada' : '' })),
      anexos: attachments.map(item => ({ nome: item.file.name, finalidade: item.purpose })),
      pendencias: [...(!hasDrawing && equipment === 'Linha' ? ['Isométrico pendente'] : []), 'Leitura automática das imagens', 'Preenchimento do modelo Excel'],
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'rascunho-inspecao.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setDownloaded(true);
  }

  return <>
    <div className="page-header"><p className="eyebrow">CRIAR DOCUMENTO</p><h1>Novo relatório</h1><p>Escolha o ensaio, identifique o equipamento e envie o croqui da inspeção.</p></div>
    <ol className="report-steps" aria-label="Etapas do relatório">{steps.map((name, index) => <li key={name} aria-current={step === index ? 'step' : undefined} className={step === index ? 'current' : index < step ? 'done' : ''}><span>{index + 1}</span>{name}</li>)}</ol>
    <div className="form-layout"><section className="panel form-panel">
      <h2 tabIndex={-1}> {step + 1}. {steps[step]}</h2>
      {step === 0 && <><p className="wizard-intro">Qual foi o tipo de inspeção realizada?</p><div className="inspection-options">{inspections.map(name => <button key={name} type="button" aria-pressed={inspection === name} className={'inspection-option ' + (inspection === name ? 'selected' : '')} onClick={() => { if (inspection !== name) { setInspection(name); setEquipment(''); setReviewed(false); } }}><b>{name}</b><span>{name === 'Phased Array' ? 'Indicações e espessura remanescente' : name === 'B-scan' ? 'Perfil e medições de espessura' : name === 'IRIS' ? 'Inspeção de tubos' : 'Indicações superficiais'}</span></button>)}</div></>}
      {step === 1 && <><p className="wizard-intro">Em qual tipo de equipamento o ensaio foi realizado?</p><div className="field"><label htmlFor="equipment-type">Tipo de equipamento</label><select id="equipment-type" value={equipment} onChange={event => { setEquipment(event.target.value); setReviewed(false); }}><option value="">Selecione o equipamento</option>{inspection && equipmentOptions[inspection].map(name => <option key={name}>{name}</option>)}</select></div><div className="fields-two"><div className="field"><label htmlFor="equipment-tag">Identificação / TAG *</label><input id="equipment-tag" value={tag} placeholder="Ex.: NG-90205-H2A" onChange={event => { setTag(event.target.value); setReviewed(false); }}/></div><div className="field"><label htmlFor="report-client">Cliente</label><input id="report-client" value={client} placeholder="Ex.: Braskem" onChange={event => setClient(event.target.value)}/></div></div><div className="field wizard-intro"><label htmlFor="report-number">Número do relatório</label><input id="report-number" value={reportNo} onChange={event => setReportNo(event.target.value)} placeholder="A informar"/></div><div className="wizard-note"><FileSpreadsheet size={18}/><span><b>{model}</b><br/>{phasedLine ? 'Estrutura analisada: capa, resultados e croquis por indicação. Mapeamento do Excel pendente.' : 'Opção de catálogo para avaliação. Modelo Excel pendente de cadastro.'}</span></div></>}
      {step === 2 && <><p className="wizard-intro">Anexe as anotações do inspetor. Classifique separadamente o desenho da linha e as fotos que devem compor o relatório.</p><label className="upload-zone" htmlFor="report-files"><Upload size={26}/><b>Selecionar croqui e imagens</b><span>JPG, PNG, WebP ou PDF · até 15 MB por arquivo · máximo 12</span><input id="report-files" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={event => { addFiles(event.target.files); event.target.value = ''; }}/></label>{fileError && <p role="alert" className="field-error">{fileError}</p>}<div className="attachment-grid">{attachments.map(item => <article className="attachment" key={item.id}>{item.url ? <img src={item.url} alt={`Prévia de ${item.file.name}`}/> : <div className="pdf-placeholder"><FileSpreadsheet/>PDF — sem prévia</div>}<b className="attachment-name">{item.file.name}</b><small>{format(item.file.size / 1024 / 1024)} MB</small><label htmlFor={`purpose-${item.id}`}>Finalidade do arquivo</label><select id={`purpose-${item.id}`} value={item.purpose} onChange={event => { setAttachments(current => current.map(file => file.id === item.id ? { ...file, purpose: event.target.value } : file)); setReviewed(false); }}>{purposes.map(purpose => <option key={purpose}>{purpose}</option>)}</select><button className="text-btn" onClick={() => removeFile(item.id)}><Trash2 size={15}/> Remover arquivo</button></article>)}</div>{equipment === 'Linha' && !hasDrawing && <p className="wizard-note">Isométrico pendente. Você pode continuar a preparação e anexar o desenho depois.</p>}<p className="wizard-note">Os anexos ficam somente nesta sessão do navegador. Ao recarregar ou sair do formulário, será necessário selecioná-los novamente.</p></>}
      {step === 3 && <><p className="wizard-intro"><b>{inspection} · {equipment} · {tag}</b><br/>{attachments.length} arquivo(s) selecionado(s). Volte à etapa Arquivos para consultar as imagens.</p><div className="wizard-note"><Info size={18}/><span>A leitura automática e o preenchimento do Excel ainda não estão conectados. Neste teste, digite as medidas do croqui para conferir os cálculos.</span></div>{thickness ? <><div className="field wizard-intro"><label htmlFor="nominal-thickness">Espessura nominal (mm)</label><input id="nominal-thickness" inputMode="decimal" placeholder="Ex.: 5,1" value={nominal} onChange={event => { setNominal(event.target.value); setReviewed(false); }}/></div><div className="point-list">{points.map(point => <div className="point-row" key={point.id}><div className="point-head"><b>{point.label || 'Ponto sem identificação'}</b>{points.length > 1 && <button className="point-remove" aria-label={`Remover ${point.label}`} onClick={() => { setPoints(current => current.filter(item => item.id !== point.id)); setReviewed(false); }}><Trash2 size={16}/></button>}</div><div className="fields-point"><div className="field"><label htmlFor={`point-${point.id}`}>Ponto</label><input id={`point-${point.id}`} value={point.label} onChange={event => updatePoint(point.id, 'label', event.target.value)}/></div><div className="field"><label htmlFor={`readings-${point.id}`}>Leituras (mm)</label><textarea id={`readings-${point.id}`} placeholder="Ex.: 3,5; 3,2 ou 0,0" value={point.readings} onChange={event => updatePoint(point.id, 'readings', event.target.value)}/></div></div></div>)}</div><button className="add-point" onClick={() => { setPoints(current => { const id = Math.max(...current.map(point => point.id)) + 1; return [...current, { id, label: `P${id}`, readings: '' }]; }); setReviewed(false); }}><Plus size={16}/> Adicionar ponto</button><p className="wizard-intro">Separe as leituras com ponto e vírgula ou quebra de linha. Campo vazio significa sem leitura; 0,0 é uma leitura válida.</p>{duplicates && <p role="alert" className="field-error">Use uma identificação diferente para cada ponto.</p>}{results.some(point => point.minimum !== null && nominalValue > 0 && point.minimum > nominalValue) && <p role="alert" className="field-error">Há uma leitura superior à nominal. Confira os valores antes de baixar o rascunho.</p>}<div className="table-wrap"><table><caption>Conferência das leituras digitadas</caption><thead><tr><th>Ponto</th><th>Remanescente</th><th>Perda (mm)</th><th>Perda (%)</th><th>Observação</th></tr></thead><tbody>{results.map(point => <tr key={point.id}><td>{point.label}</td><td>{point.minimum === null ? 'Conferir leitura' : `${format(point.minimum)} mm`}</td><td>{point.loss === null ? '—' : format(nominalValue - point.minimum!)}</td><td>{point.loss === null ? '—' : `${format(point.loss)}%`}</td><td>{point.minimum === 0 && phasedLine ? 'Linha furada' : '—'}</td></tr>)}</tbody></table></div><label className="review-checkbox"><input type="checkbox" checked={reviewed} disabled={!readingsValid} onChange={event => { setReviewed(event.target.checked); setDownloaded(false); }}/> Conferi os pontos e as leituras digitadas com o croqui.</label><button className="outline-btn" disabled={!readingsValid || !reviewed} onClick={downloadDraft}>Baixar rascunho de teste</button>{downloaded && <p role="status" className="wizard-intro">Rascunho baixado. Ele contém os dados digitados e a lista de anexos; não contém as imagens nem o Excel preenchido.</p>}</> : <p className="wizard-note">A conferência das indicações de Líquido Penetrante depende do cadastro do seu modelo. Este ensaio não usa o cálculo de perda de espessura.</p>}<div className="wizard-note">Relatório Excel / PDF: geração pendente de integração.</div></>}
      <div className="form-footer"><button className="outline-btn" disabled={step === 0} onClick={() => setStep(current => current - 1)}><ArrowLeft size={16}/> Voltar</button>{step < 3 && <button className="primary-btn" disabled={!canContinue} onClick={() => setStep(current => current + 1)}>Continuar <ArrowRight size={16}/></button>}</div>
    </section><aside className="form-aside"><div className="aside-card"><FileSpreadsheet size={24}/><h3>Preparação do relatório</h3><dl className="report-summary"><dt>Ensaio</dt><dd>{inspection || 'A selecionar'}</dd><dt>Equipamento</dt><dd>{equipment || 'A selecionar'}</dd><dt>Modelo</dt><dd>{model}</dd><dt>Arquivos</dt><dd>{attachments.length} selecionado(s)</dd></dl></div><div className="aside-card muted"><h3>O que você pode testar hoje</h3><p>Seleção do ensaio e equipamento, anexos com prévia e cálculo com medidas digitadas.</p><p>Leitura por IA, associação automática aos pontos e emissão Excel/PDF ainda precisam ser integradas.</p></div></aside></div>
  </>;
}
