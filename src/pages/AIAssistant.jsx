import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Send, Paperclip, Sparkles,
  FileText, CheckCircle, XCircle, AlertTriangle,
  RotateCcw, TrendingUp
} from 'lucide-react';
import api from '../services/api';
import './styles/ai-assistant.css';

const now = () =>
  new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

const uid = () => Math.random().toString(36).slice(2);

const fmtSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const SUGGESTIONS = [
  '¿Qué documentos necesito para licitaciones de obra pública?',
  '¿Cómo calcular mi capacidad de contratación?',
  '¿Cuáles son los errores más comunes al presentar propuestas?',
  'Explícame el proceso SECOP II paso a paso',
];

const AnalysisCard = ({ data }) => {
  const icons = {
    viable:     <CheckCircle size={20} />,
    'no-viable': <XCircle size={20} />,
    parcial:    <AlertTriangle size={20} />,
  };
  const labels = {
    viable:     '✅ Licitación VIABLE',
    'no-viable': '❌ Licitación NO VIABLE',
    parcial:    '⚠️ Viabilidad PARCIAL',
  };

  return (
    <div className={`analysis-card ${data.verdict}`}>
      <div className={`analysis-header ${data.verdict}`}>
        <div className="analysis-verdict-icon">{icons[data.verdict]}</div>
        <div className="analysis-verdict-text">
          <h4>{labels[data.verdict]}</h4>
          <p>{data.title}</p>
        </div>
        <div className="analysis-score">
          <div className="score-circle">{data.score}</div>
        </div>
      </div>
      <div className="analysis-body">
        <div className="analysis-meta">
          <div className="analysis-meta-item">
            <span className="meta-label">Entidad</span>
            <span className="meta-value">{data.entity}</span>
          </div>
          <div className="analysis-meta-item">
            <span className="meta-label">Valor estimado</span>
            <span className="meta-value">{data.value}</span>
          </div>
          <div className="analysis-meta-item">
            <span className="meta-label">Cierre</span>
            <span className="meta-value">{data.deadline}</span>
          </div>
        </div>
        <div className="analysis-divider" />
        <div className="analysis-section">
          <h5>Factores positivos</h5>
          <div className="analysis-items">
            {data.pros.map((p, i) => (
              <div className="analysis-item positive" key={i}>
                <div className="analysis-item-dot" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="analysis-section">
          <h5>Factores de riesgo</h5>
          <div className="analysis-items">
            {data.cons.map((c, i) => (
              <div className="analysis-item negative" key={i}>
                <div className="analysis-item-dot" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="analysis-divider" />
        <div className="analysis-section">
          <h5>Recomendación</h5>
          <div className="analysis-item neutral">
            <div className="analysis-item-dot" />
            <span>{data.recommendation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [historial, setHistorial] = useState([]);
  const [pendingPdf, setPendingPdf] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTextareaInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, { ...msg, id: uid(), time: now() }]);
  }, []);

  // Chat via backend /api/asistente/chat
  const callAsistente = useCallback(async (texto) => {
    const response = await api.post('/asistente/chat', {
      mensaje: texto,
      historial,
    });
    const respuesta = response.data.respuesta;
    setHistorial(prev => [
      ...prev,
      { role: 'user', content: texto },
      { role: 'assistant', content: respuesta },
    ]);
    return respuesta;
  }, [historial]);

  // Analyze PDF via backend /api/asistente/analizar
  const analyzePdf = useCallback(async (file) => {
    const text = await file.text().catch(() => '');
    const response = await api.post('/asistente/analizar', {
      pliego: text || file.name,
    });
    const resultado = response.data.resultado || '';

    // Parse verdict from markdown response
    const lower = resultado.toLowerCase();
    const verdict = lower.includes('no viable') || lower.includes('no cumple')
      ? 'no-viable'
      : lower.includes('parcial') || lower.includes('riesgo')
      ? 'parcial'
      : 'viable';

    return {
      verdict,
      score: verdict === 'viable' ? 78 : verdict === 'parcial' ? 52 : 30,
      title: file.name.replace('.pdf', ''),
      entity: 'Ver análisis completo',
      value: '',
      deadline: '',
      pros: ['Análisis completado por LicitIA'],
      cons: [],
      recommendation: resultado,
    };
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !pendingPdf) return;

    if (pendingPdf) {
      addMessage({
        role: 'user',
        pdf: { name: pendingPdf.name, size: fmtSize(pendingPdf.size) },
        text: text || undefined,
      });
      setPendingPdf(null);
      setInput('');
      return;
    }

    addMessage({ role: 'user', text });
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setIsTyping(true);
    try {
      const reply = await callAsistente(text);
      addMessage({ role: 'ai', text: reply });
    } catch {
      addMessage({ role: 'ai', text: 'Error al conectar con el asistente. Verifica que el servidor esté activo.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleAnalyze = async () => {
    if (!pendingPdf) return;
    const file = pendingPdf;
    setPendingPdf(null);

    addMessage({
      role: 'user',
      pdf: { name: file.name, size: fmtSize(file.size) },
      text: 'Por favor analiza esta licitación y dime si es viable.',
    });

    setIsTyping(true);
    try {
      const result = await analyzePdf(file);
      addMessage({ role: 'ai', analysis: result });
    } catch {
      addMessage({ role: 'ai', text: 'Error al analizar el PDF. Verifica que el servidor esté activo.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPendingPdf(file);
    }
    e.target.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setHistorial([]);
    setPendingPdf(null);
    setInput('');
  };

  const handleSuggestion = (text) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  return (
    <div className="ai-assistant-page">
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-avatar"><Bot size={20} /></div>
          <div className="ai-header-info">
            <h2>Asistente LicitIA</h2>
            <div className="ai-status">
              <div className="ai-status-dot" />
              <span>En línea · Especialista en licitaciones</span>
            </div>
          </div>
        </div>
        <div className="ai-header-actions">
          {messages.length > 0 && (
            <button className="ai-header-btn" onClick={clearConversation}>
              <RotateCcw size={14} /> Nueva conversación
            </button>
          )}
        </div>
      </div>

      <div className="ai-messages">
        {messages.length === 0 ? (
          <div className="ai-welcome">
            <div className="ai-welcome-icon"><Sparkles size={32} /></div>
            <h3>¿En qué te puedo ayudar?</h3>
            <p>
              Soy tu asistente experto en licitaciones públicas colombianas.
              Puedo responder tus preguntas o analizar documentos de licitación.
            </p>
            <div className="ai-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="ai-suggestion-chip" onClick={() => handleSuggestion(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              <div className={`message-avatar ${msg.role === 'ai' ? 'ai-msg' : 'user-msg'}`}>
                {msg.role === 'ai' ? <Bot size={16} /> : 'Tú'}
              </div>
              <div className="message-bubble">
                {msg.pdf && (
                  <div className="bubble-pdf">
                    <div className="bubble-pdf-icon"><FileText size={18} /></div>
                    <div className="bubble-pdf-info">
                      <div className="bubble-pdf-name">{msg.pdf.name}</div>
                      <div className="bubble-pdf-size">{msg.pdf.size}</div>
                    </div>
                  </div>
                )}
                {msg.text && (
                  <div className="bubble-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                )}
                {msg.analysis && <AnalysisCard data={msg.analysis} />}
                <span className="bubble-time">{msg.time}</span>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="message-row ai">
            <div className="message-avatar ai-msg"><Bot size={16} /></div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input-area">
        {pendingPdf && (
          <div className="pdf-pending-bar">
            <FileText size={16} color="#d97706" />
            <span className="pdf-pending-name">{pendingPdf.name}</span>
            <button className="pdf-pending-remove" onClick={() => setPendingPdf(null)}>
              <XCircle size={16} />
            </button>
          </div>
        )}
        <div className="ai-input-box">
          <textarea
            ref={textareaRef}
            placeholder="Escribe tu pregunta sobre licitaciones..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onInput={handleTextareaInput}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <div className="ai-input-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="ai-upload-btn" title="Subir PDF" onClick={() => fileInputRef.current?.click()} disabled={isTyping}>
              <Paperclip size={18} />
            </button>
            <button className="ai-analyze-btn" title="Analizar PDF" onClick={handleAnalyze} disabled={!pendingPdf || isTyping}>
              <TrendingUp size={15} />
              <span>Analizar</span>
            </button>
            <button className="ai-send-btn" title="Enviar" onClick={handleSend} disabled={(!input.trim() && !pendingPdf) || isTyping}>
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="ai-input-hint">
          Sube un PDF con 📎 y presiona <strong>Analizar</strong> · Enter para enviar
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
