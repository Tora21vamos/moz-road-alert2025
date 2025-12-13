import React, { useState } from "react";

export default function MozRoadAlert() {
  const [currentPage, setCurrentPage] = useState("home");
  const [viewingReporte, setViewingReporte] = useState(null);

  const [nome, setNome] = useState("");
  const [contacto, setContacto] = useState("");
  const [provincia, setProvincia] = useState("");
  const [cidade, setCidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoOcorrencia, setTipoOcorrencia] = useState("");
  const [numeroVitimas, setNumeroVitimas] = useState("");
  const [servicosNecessarios, setServicosNecessarios] = useState([]);
  const [anexos, setAnexos] = useState([]);

  const [respostaPolicia, setRespostaPolicia] = useState("");
  const [nomeOfendido, setNomeOfendido] = useState("");
  const [tipoLesao, setTipoLesao] = useState("");
  const [hospitalDestino, setHospitalDestino] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  const [reportes, setReportes] = useState([
    {
      id: 1,
      tipoOcorrencia: "acidente",
      localizacao: "EN1, Km 15, Matola",
      descricao: "Colisão entre dois veículos ligeiros. Trânsito bloqueado. Duas vítimas.",
      numeroVitimas: "2",
      contacto: "+258 84 123 4567",
      nomeCompleto: "João Silva",
      provincia: "Maputo",
      cidade: "Matola",
      dataHora: "27/11/2025 14:30",
      status: "em_atendimento",
      respostas: [],
    },
    {
      id: 2,
      tipoOcorrencia: "estrada",
      localizacao: "EN6, Km 80, Chimoio",
      descricao: "Buraco grande na via principal. Perigo para veículos.",
      numeroVitimas: "0",
      contacto: "+258 85 987 6543",
      nomeCompleto: "Maria Santos",
      provincia: "Manica",
      cidade: "Chimoio",
      dataHora: "27/11/2025 10:15",
      status: "pendente",
      respostas: [],
    },
  ]);

  const provincias = [
    "Maputo", "Gaza", "Inhambane", "Sofala", "Manica", "Tete",
    "Zambézia", "Nampula", "Cabo Delgado", "Niassa",
  ];

  const hospitais = [
    { nome: "Hospital Central de Maputo (HCM)", provincia: "Maputo" },
    { nome: "Hospital Geral de Mavalane", provincia: "Maputo" },
    { nome: "Hospital Central da Beira", provincia: "Sofala" },
    { nome: "Hospital Provincial de Chimoio", provincia: "Manica" },
    { nome: "Hospital Central de Nampula", provincia: "Nampula" },
  ];

  const tiposOcorrencia = [
    { id: "acidente", nome: "Acidente de Viação", icon: "🚗" },
    { id: "estrada", nome: "Problema na Estrada", icon: "🚧" },
    { id: "eletricidade", nome: "Problema Elétrico", icon: "⚡" },
    { id: "outro", nome: "Outro", icon: "⚠️" },
  ];

  const servicosEmergencia = [
    { id: "policia", nome: "Polícia de Trânsito", icon: "🚔", numero: "119" },
    { id: "bombeiros", nome: "Bombeiros", icon: "🚒", numero: "198" },
    { id: "ambulancia", nome: "Ambulância/INEM", icon: "🚑", numero: "117" },
    { id: "edm", nome: "EDM (Eletricidade)", icon: "⚡", numero: "1400" },
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`❌ Arquivo ${file.name} muito grande. Máximo 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAnexos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            nome: file.name,
            tipo: file.type.startsWith("image/") ? "imagem" : "documento",
            tamanho: (file.size / 1024 / 1024).toFixed(2) + " MB",
            preview: file.type.startsWith("image/") ? event.target.result : null,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!nome || !contacto || !provincia || !localizacao || !descricao) {
      alert("⚠️ Preencha todos os campos obrigatórios");
      return;
    }

    const novoReporte = {
      id: Date.now(),
      tipoOcorrencia,
      localizacao,
      descricao,
      numeroVitimas,
      contacto,
      nomeCompleto: nome,
      provincia,
      cidade,
      anexos,
      dataHora: new Date().toLocaleString("pt-PT"),
      status: "pendente",
      respostas: [],
    };

    setReportes([novoReporte, ...reportes]);
    setShowSuccess(true);

    setNome("");
    setContacto("");
    setProvincia("");
    setCidade("");
    setLocalizacao("");
    setDescricao("");
    setTipoOcorrencia("");
    setNumeroVitimas("");
    setAnexos([]);

    setTimeout(() => {
      setShowSuccess(false);
      setCurrentPage("reportes");
    }, 2000);
  };

  const enviarResposta = (reporteId) => {
    if (!respostaPolicia) return;

    const novaResposta = {
      id: Date.now(),
      autoridade: "Polícia",
      mensagem: respostaPolicia,
      dataHora: new Date().toLocaleString("pt-PT"),
    };

    const reportesAtualizados = reportes.map((rep) => {
      if (rep.id === reporteId) {
        return {
          ...rep,
          status: "em_atendimento",
          respostas: [...(rep.respostas || []), novaResposta],
        };
      }
      return rep;
    });

    setReportes(reportesAtualizados);
    
    setViewingReporte({
      ...viewingReporte,
      status: "em_atendimento",
      respostas: [...(viewingReporte.respostas || []), novaResposta],
    });

    setRespostaPolicia("");
    alert("✅ Resposta enviada!");
  };

  const emitirGuiaMedica = (reporteId) => {
    if (!nomeOfendido || !tipoLesao || !hospitalDestino) {
      alert("⚠️ Preencha todos os campos da guia médica");
      return;
    }

    const numeroGuia = `GM-${Date.now()}`;
    const guia = {
      numeroGuia,
      nomeOfendido,
      tipoLesao,
      hospital: hospitalDestino,
      observacoes,
      dataEmissao: new Date().toLocaleString("pt-PT"),
    };

    const novaResposta = {
      id: Date.now(),
      autoridade: "Polícia de Trânsito",
      mensagem: `🏥 GUIA MÉDICA EMITIDA\n\nNº: ${numeroGuia}\nPaciente: ${nomeOfendido}\nLesão: ${tipoLesao}\nHospital: ${hospitalDestino}${observacoes ? `\nObservações: ${observacoes}` : ''}`,
      dataHora: guia.dataEmissao,
      guiaMedica: guia,
    };

    const reportesAtualizados = reportes.map((rep) => {
      if (rep.id === reporteId) {
        return {
          ...rep,
          status: "em_atendimento",
          respostas: [...(rep.respostas || []), novaResposta],
        };
      }
      return rep;
    });

    setReportes(reportesAtualizados);
    
    setViewingReporte({
      ...viewingReporte,
      status: "em_atendimento",
      respostas: [...(viewingReporte.respostas || []), novaResposta],
    });

    setNomeOfendido("");
    setTipoLesao("");
    setHospitalDestino("");
    setObservacoes("");
    
    alert("✅ Guia Médica emitida com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="container mx-auto p-4 max-w-6xl">
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-4xl">⚠️</span>
                Moz Road Alert
              </h1>
              <p className="text-gray-600 mt-1">Sistema de Alertas Rodoviários de Moçambique</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage("home")}
                className={`px-4 py-2 rounded-lg ${currentPage === "home" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                Reportar
              </button>
              <button
                onClick={() => setCurrentPage("reportes")}
                className={`px-4 py-2 rounded-lg ${currentPage === "reportes" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                Ver Reportes ({reportes.length})
              </button>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="text-green-700 font-semibold">Reporte enviado com sucesso!</p>
            </div>
          </div>
        )}

        {currentPage === "home" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Reportar Ocorrência</h2>
            
            <div className="mb-6">
              <label className="block font-semibold mb-3 text-gray-700">Tipo de Ocorrência *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tiposOcorrencia.map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => setTipoOcorrencia(tipo.id)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                      tipoOcorrencia === tipo.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-4xl">{tipo.icon}</span>
                    <span className="text-sm font-medium text-center">{tipo.nome}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Nome Completo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Contacto *</label>
                <input
                  type="tel"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="+258 84 123 4567"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Província *</label>
                <select
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Selecione...</option>
                  {provincias.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Cidade/Distrito</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ex: Maputo, Matola..."
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">Localização Exata *</label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: EN1, Km 15, próximo ao posto Shell"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">Descrição da Ocorrência *</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows="4"
                className="w-full p-3 border rounded-lg"
                placeholder="Descreva o que aconteceu..."
              />
            </div>

            {tipoOcorrencia === "acidente" && (
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">Número de Vítimas</label>
                <input
                  type="number"
                  value={numeroVitimas}
                  onChange={(e) => setNumeroVitimas(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="0"
                  min="0"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block font-semibold mb-3 text-gray-700">Serviços de Emergência Necessários</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {servicosEmergencia.map((servico) => {
                  const isSelected = servicosNecessarios.includes(servico.id);
                  return (
                    <button
                      key={servico.id}
                      onClick={() => {
                        if (isSelected) {
                          setServicosNecessarios(servicosNecessarios.filter(s => s !== servico.id));
                        } else {
                          setServicosNecessarios([...servicosNecessarios, servico.id]);
                        }
                      }}
                      className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                        isSelected ? "border-red-500 bg-red-50" : "border-gray-200"
                      }`}
                    >
                      <span className="text-2xl">{servico.icon}</span>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium">{servico.nome}</div>
                        <div className="text-xs text-gray-500">{servico.numero}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-3 text-gray-700">Anexar Fotos/Vídeos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="text-6xl mb-2">📷</div>
                  <p className="text-gray-600">Clique para adicionar fotos ou vídeos</p>
                  <p className="text-sm text-gray-400">Máximo 10MB por arquivo</p>
                </label>
              </div>

              {anexos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {anexos.map((anexo) => (
                    <div key={anexo.id} className="relative border rounded-lg p-2">
                      {anexo.preview ? (
                        <img src={anexo.preview} alt={anexo.nome} className="w-full h-24 object-cover rounded" />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-4xl">📄</span>
                        </div>
                      )}
                      <button
                        onClick={() => setAnexos(anexos.filter(a => a.id !== anexo.id))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ✕
                      </button>
                      <p className="text-xs mt-1 truncate">{anexo.nome}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2"
            >
              <span className="text-xl">📤</span>
              Enviar Reporte
            </button>
          </div>
        )}

        {currentPage === "reportes" && !viewingReporte && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 Reportes Recebidos</h2>
            
            {reportes.map((reporte) => (
              <div key={reporte.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {reporte.tipoOcorrencia === "acidente" && "🚗"}
                        {reporte.tipoOcorrencia === "estrada" && "🚧"}
                        {reporte.tipoOcorrencia === "eletricidade" && "⚡"}
                      </span>
                      <h3 className="font-bold text-lg text-gray-800">{reporte.localizacao}</h3>
                    </div>
                    <p className="text-gray-600 mb-2">{reporte.descricao}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        🕐 {reporte.dataHora}
                      </span>
                      <span className="flex items-center gap-1">
                        📞 {reporte.contacto}
                      </span>
                      <span className="flex items-center gap-1">
                        📍 {reporte.provincia}
                      </span>
                      {reporte.numeroVitimas > 0 && (
                        <span className="flex items-center gap-1 text-red-600 font-semibold">
                          👥 {reporte.numeroVitimas} vítima(s)
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    reporte.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                    reporte.status === "em_atendimento" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {reporte.status === "pendente" ? "Pendente" :
                     reporte.status === "em_atendimento" ? "Em Atendimento" : "Resolvido"}
                  </span>
                </div>

                <button
                  onClick={() => setViewingReporte(reporte)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <span>👁️</span>
                  Ver Detalhes e Responder
                </button>
              </div>
            ))}
          </div>
        )}

        {viewingReporte && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={() => setViewingReporte(null)}
              className="mb-4 text-blue-500 hover:text-blue-700 flex items-center gap-2"
            >
              ← Voltar
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Detalhes do Reporte</h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg mb-3">{viewingReporte.localizacao}</h3>
              <p className="text-gray-700 mb-4">{viewingReporte.descricao}</p>
              
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div><strong>Reportante:</strong> {viewingReporte.nomeCompleto}</div>
                <div><strong>Contacto:</strong> {viewingReporte.contacto}</div>
                <div><strong>Província:</strong> {viewingReporte.provincia}</div>
                <div><strong>Data/Hora:</strong> {viewingReporte.dataHora}</div>
                {viewingReporte.numeroVitimas > 0 && (
                  <div className="text-red-600"><strong>Vítimas:</strong> {viewingReporte.numeroVitimas}</div>
                )}
              </div>

              {viewingReporte.anexos && viewingReporte.anexos.length > 0 && (
                <div className="mt-4">
                  <strong className="block mb-2">Anexos:</strong>
                  <div className="grid grid-cols-4 gap-2">
                    {viewingReporte.anexos.map((anexo) => (
                      <div key={anexo.id} className="border rounded">
                        {anexo.preview && (
                          <img src={anexo.preview} alt={anexo.nome} className="w-full h-24 object-cover rounded" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {viewingReporte.respostas && viewingReporte.respostas.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">📋 Histórico de Respostas</h3>
                {viewingReporte.respostas.map((resposta) => (
                  <div key={resposta.id} className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-3 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🚔</span>
                      <strong className="text-blue-700">{resposta.autoridade}</strong>
                      <span className="text-sm text-gray-500 ml-auto">{resposta.dataHora}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{resposta.mensagem}</p>
                    {resposta.guiaMedica && (
                      <div className="mt-3 bg-white p-3 rounded border border-blue-200">
                        <p className="text-xs text-blue-600 font-semibold mb-1">📄 GUIA MÉDICA ANEXADA</p>
                        <p className="text-xs text-gray-600">Nº: {resposta.guiaMedica.numeroGuia}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">🚔 Responder como Autoridade</h3>
              
              <textarea
                value={respostaPolicia}
                onChange={(e) => setRespostaPolicia(e.target.value)}
                rows="4"
                className="w-full p-3 border rounded-lg mb-4"
                placeholder="Digite sua resposta ou atualização sobre o caso..."
              />

              <button
                onClick={() => enviarResposta(viewingReporte.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mb-6"
              >
                <span>📤</span>
                Enviar Resposta
              </button>

              {viewingReporte.numeroVitimas > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">🏥 Emitir Guia Médica</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-semibold mb-2">Nome do Paciente *</label>
                      <input
                        type="text"
                        value={nomeOfendido}
                        onChange={(e) => setNomeOfendido(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Tipo de Lesão *</label>
                      <input
                        type="text"
                        value={tipoLesao}
                        onChange={(e) => setTipoLesao(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Ex: Fratura, Traumatismo..."
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Hospital de Destino *</label>
                    <select
                      value={hospitalDestino}
                      onChange={(e) => setHospitalDestino(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Selecione o hospital...</option>
                      {hospitais.map((h) => (
                        <option key={h.nome} value={h.nome}>{h.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Observações</label>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      rows="3"
                      className="w-full p-3 border rounded-lg"
                      placeholder="Observações adicionais..."
                    />
                  </div>

                  <button
                    onClick={() => emitirGuiaMedica(viewingReporte.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <span>🏥</span>
                    Emitir Guia Médica
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}