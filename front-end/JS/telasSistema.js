(() => {
  const enrollmentForm = document.querySelector("#enrollment-form");

  if (enrollmentForm) {
    const athleteSelect = document.querySelector("#enrollment-athlete");
    const competitionSelect = document.querySelector("#enrollment-competition");
    const notice = document.querySelector("#enrollment-notice");
    const action = document.querySelector("#enrollment-action");
    const athletes = {
      mariana: { name: "Mariana Costa", id: "1042", modality: "Maratona Urbana" },
      ana: { name: "Ana Ribeiro", id: "1041", modality: "Maratona Urbana" },
      pedro: { name: "Pedro Santos", id: "1040", modality: "Corrida de Montanha" },
      unknown: null,
    };
    const competitions = {
      cidade: { name: "Corrida da Cidade 2027", modality: "Maratona Urbana", participants: 299, limit: 300 },
      primavera: { name: "Maratona da Primavera 2027", modality: "Maratona Urbana", participants: 180, limit: 250 },
      circuito: { name: "Circuito Urbano 2027", modality: "Maratona Urbana", participants: 300, limit: 300 },
    };
    const existing = { mariana: ["cidade"] };
    let confirmed = false;
    let currentState = "duplicate";

    const setCheck = (id, result, detail, blocked) => {
      const resultElement = document.querySelector(`#check-${id}`);
      resultElement.textContent = result;
      resultElement.classList.toggle("is-blocked", blocked);
      document.querySelector(`#check-${id}-detail`).textContent = detail;
    };

    const render = () => {
      const athlete = athletes[athleteSelect.value];
      const competition = competitions[competitionSelect.value];
      const isMissing = !athlete;
      const isMismatch = Boolean(athlete && athlete.modality !== competition.modality);
      const isFull = competition.participants >= competition.limit;
      const isDuplicate = Boolean(athlete && (existing[athleteSelect.value] || []).includes(competitionSelect.value));

      document.querySelector("#athlete-summary").textContent = athlete
        ? `Modalidade do atleta: ${athlete.modality}`
        : "Modalidade do atleta: não identificada";
      document.querySelector("#competition-summary").textContent = `Modalidade da competição: ${competition.modality}`;
      const available = competition.limit - competition.participants;
      document.querySelector("#capacity-summary").textContent =
        `Participantes: ${competition.participants} / ${competition.limit} • ${available} ${available === 1 ? "vaga disponível" : "vagas disponíveis"}`;

      setCheck("athlete", isMissing ? "Bloqueado" : "Validado", isMissing ? "Atleta não encontrado." : "Atleta encontrado no sistema.", isMissing);
      setCheck("modality", isMissing ? "Não verificado" : isMismatch ? "Bloqueado" : "Validado",
        isMissing ? "É necessário localizar um atleta cadastrado." : isMismatch ? "Modalidades não correspondem." : `${athlete.modality} em ambos os cadastros.`,
        isMismatch);
      setCheck("capacity", isMissing ? "Não verificado" : isFull ? "Bloqueado" : "Validado",
        isMissing ? "É necessário localizar um atleta cadastrado." : isFull ? "Limite máximo de participantes atingido." : `${available} ${available === 1 ? "vaga disponível" : "vagas disponíveis"} na competição.`,
        isFull);
      setCheck("duplicate", isMissing ? "Não verificado" : isDuplicate ? "Bloqueado" : "Validado",
        isMissing ? "É necessário localizar um atleta cadastrado." : isDuplicate ? "Já existe inscrição nesta competição." : "Nenhuma inscrição anterior encontrada.",
        isDuplicate);

      if (confirmed) {
        currentState = "confirmed";
      } else if (isMissing) {
        currentState = "missing";
      } else if (isMismatch) {
        currentState = "mismatch";
      } else if (isFull) {
        currentState = "full";
      } else if (isDuplicate) {
        currentState = "duplicate";
      } else {
        currentState = "ready";
      }

      const noticeTitle = document.querySelector("#notice-title");
      const noticeDescription = document.querySelector("#notice-description");
      const noticeDetail = document.querySelector("#notice-detail");
      const validationMessage = document.querySelector("#validation-message");
      const athleteName = athlete ? athlete.name : "o atleta";
      const athleteId = athlete ? athlete.id : "";
      notice.className = "notice";

      const states = {
        missing: {
          className: "notice--error",
          title: "Atleta não cadastrado",
          description: "Não foi possível inscrever: o atleta informado não possui cadastro prévio no sistema.",
          detail: "Cadastre o atleta antes de realizar uma nova tentativa.",
          message: "A inscrição não foi concluída.",
          action: "Cadastrar atleta",
          href: "consultarAtletas.html",
        },
        mismatch: {
          className: "notice--error",
          title: "Modalidade incompatível",
          description: "Não foi possível inscrever: a modalidade do atleta é diferente da modalidade da competição.",
          detail: "A correspondência deve ser exata. Escolha uma competição compatível.",
          message: "A inscrição não foi concluída.",
          action: "Escolher competição",
          href: "consultarCompeticoes.html",
        },
        full: {
          className: "notice--error",
          title: "Vagas esgotadas",
          description: `Não foi possível inscrever: a competição atingiu o limite de ${competition.limit} participantes.`,
          detail: "Nenhuma nova inscrição foi criada. Escolha outra competição com vagas disponíveis.",
          message: "A inscrição não foi concluída.",
          action: "Escolher competição",
          href: "consultarCompeticoes.html",
        },
        duplicate: {
          className: "notice--error",
          title: "Atleta já inscrito",
          description: `Não foi possível criar outra inscrição: ${athleteName} já possui inscrição nesta competição.`,
          detail: `Inscrição existente: INS-2027-${athleteId}. Nenhuma inscrição duplicada foi criada.`,
          message: "A inscrição não foi concluída.",
          action: "Ver inscrição existente",
          href: "inscricoesAtivas.html",
        },
        ready: {
          className: "notice--neutral",
          title: "Tudo certo para inscrever",
          description: "As quatro regras foram validadas. Confirme para concluir a inscrição.",
          detail: "A inscrição será confirmada imediatamente, sem etapa de pagamento.",
          message: "Todas as regras foram atendidas.",
          action: "Confirmar inscrição",
          href: "#",
        },
        confirmed: {
          className: "notice--success",
          title: "Inscrição confirmada",
          description: `Todas as regras foram atendidas. A inscrição de ${athleteName} está confirmada.`,
          detail: `Inscrição INS-2027-${athleteId} • Confirmação imediata`,
          message: "Todas as regras foram atendidas.",
          action: "Ver inscritos",
          href: "inscritosCompeticao.html",
        },
      };
      const state = states[currentState];
      notice.classList.add(state.className);
      noticeTitle.textContent = state.title;
      noticeDescription.textContent = state.description;
      noticeDetail.textContent = state.detail;
      validationMessage.textContent = state.message;
      action.textContent = state.action;
      action.href = state.href;
    };

    athleteSelect.addEventListener("change", () => {
      confirmed = false;
      render();
    });
    competitionSelect.addEventListener("change", () => {
      confirmed = false;
      render();
    });
    document.querySelector("#change-selection").addEventListener("click", () => {
      confirmed = false;
      athleteSelect.focus();
    });
    action.addEventListener("click", (event) => {
      if (currentState === "ready") {
        event.preventDefault();
        confirmed = true;
        render();
      }
    });
    enrollmentForm.addEventListener("submit", (event) => event.preventDefault());
    render();
  }

  const capacitySelect = document.querySelector("#capacity-competition");
  if (capacitySelect) {
    const updateCapacity = () => {
      const option = capacitySelect.selectedOptions[0];
      const participants = Number(option.dataset.participants);
      const limit = Number(option.dataset.limit);
      const available = limit - participants;
      const occupancy = (participants / limit) * 100;
      const isFull = available === 0;
      const rounded = occupancy.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
      const percent = Math.min(100, occupancy);

      document.querySelector("#metric-participants").textContent = `${participants} / ${limit}`;
      document.querySelector("#metric-available").textContent = String(available);
      document.querySelector("#metric-occupancy").textContent = `${rounded}%`;
      document.querySelector("#available-caption").textContent = available === 1 ? "Última vaga disponível" : isFull ? "Capacidade máxima atingida" : `${available} vagas disponíveis`;
      document.querySelector("#capacity-name").textContent = option.dataset.name;
      document.querySelector("#capacity-modality").textContent = option.dataset.modality;
      document.querySelector("#capacity-count").textContent = `${participants} / ${limit} inscritos`;
      document.querySelector("#capacity-summary").textContent = `${rounded}% da capacidade • ${available} ${available === 1 ? "vaga disponível" : "vagas disponíveis"}`;
      document.querySelector("#capacity-progress").style.width = `${percent}%`;
      document.querySelector("#capacity-progress").style.backgroundColor = isFull ? "#b94a3f" : "#18aea2";
      document.querySelector(".progress-track").setAttribute("aria-valuenow", String(percent));
      document.querySelector("#capacity-status-card").className = `status-card status-card--${isFull ? "danger" : "ok"}`;
      document.querySelector("#capacity-status").textContent = isFull ? "Vagas esgotadas" : "Vagas disponíveis";
      document.querySelector("#capacity-status-description").textContent = isFull
        ? `O status mudou automaticamente ao atingir ${limit} de ${limit} inscritos.`
        : `A prova aceita novas inscrições. Restam ${available} ${available === 1 ? "vaga" : "vagas"} para atingir o limite.`;
      document.querySelector("#capacity-message").textContent = isFull
        ? "O limite de participantes foi atingido. Novas inscrições estão bloqueadas."
        : "As inscrições permanecem abertas enquanto houver capacidade disponível.";
    };
    capacitySelect.addEventListener("change", updateCapacity);
    updateCapacity();
  }

  const reportScreen = document.querySelector("#report-screen");
  if (reportScreen) {
    const tabs = [...reportScreen.querySelectorAll("[data-report-tab]")];
    const individual = document.querySelector("#individual-report");
    const consolidated = document.querySelector("#consolidated-report");
    const reportSelect = document.querySelector("#report-competition");
    const reportNames = {
      "Corrida da Cidade 2027": {
        date: "12/09/2027 às 06:00",
        location: "Av. Paulista, 1578 • São Paulo — SP",
        distance: "42,195 km",
        participants: "300 inscritos",
        limit: "300 vagas",
        status: "Vagas Esgotadas",
        summary: "300 / 300 inscritos • 100% de ocupação • 0 vagas disponíveis",
        message: "A prova atingiu o limite máximo de participantes.",
        full: true,
      },
      "Maratona da Primavera 2027": {
        date: "18/10/2027 às 07:00",
        location: "Orla de Camburi • Vitória — ES",
        distance: "21,097 km",
        participants: "180 inscritos",
        limit: "250 vagas",
        status: "Vagas disponíveis",
        summary: "180 / 250 inscritos • 72% de ocupação • 70 vagas disponíveis",
        message: "A prova continua aceitando inscrições.",
        full: false,
      },
      "Circuito Urbano 2027": {
        date: "22/11/2027 às 06:30",
        location: "Centro • Serra — ES",
        distance: "10 km",
        participants: "96 inscritos",
        limit: "200 vagas",
        status: "Vagas disponíveis",
        summary: "96 / 200 inscritos • 48% de ocupação • 104 vagas disponíveis",
        message: "A prova continua aceitando inscrições.",
        full: false,
      },
    };
    const setMode = (mode) => {
      const isIndividual = mode === "individual";
      individual.hidden = !isIndividual;
      consolidated.hidden = isIndividual;
      document.querySelector("#individual-filter").hidden = !isIndividual;
      tabs.forEach((tab) => {
        const selected = tab.dataset.reportTab === mode;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      document.querySelector("#report-feedback").textContent = isIndividual
        ? "Este relatório apresenta os dados da competição selecionada no momento da geração."
        : "Este relatório reúne os dados de todas as competições cadastradas.";
    };
    const updateReport = () => {
      const data = reportNames[reportSelect.value];
      document.querySelector("#individual-name").textContent = reportSelect.value;
      const details = document.querySelectorAll(".detail-grid div strong");
      details[0].textContent = "Maratona Urbana";
      details[1].textContent = data.date;
      details[2].textContent = data.location;
      details[3].textContent = data.distance;
      details[4].textContent = data.participants;
      details[5].textContent = data.limit;
      const status = document.querySelector(".report-status");
      status.className = `notice report-status notice--${data.full ? "error" : "success"}`;
      status.querySelector("h3").textContent = data.status;
      status.querySelector("strong").textContent = data.summary;
      status.querySelector("p").textContent = data.message;
    };

    tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.reportTab)));
    reportSelect.addEventListener("change", updateReport);
    document.querySelector("#generate-report").addEventListener("click", () => {
      updateReport();
      document.querySelector("#report-feedback").textContent = `Relatório de ${reportSelect.value} atualizado.`;
    });
    document.querySelector("#generate-consolidated").addEventListener("click", () => {
      document.querySelector("#report-feedback").textContent = "Relatório geral consolidado atualizado.";
    });
    updateReport();
  }
})();
