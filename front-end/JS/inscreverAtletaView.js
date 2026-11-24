const STORAGE_KEY = "atletasCadastrados";

const athleteSelect = document.querySelector("#enrollment-athlete");
const competitionSelect = document.querySelector("#enrollment-competition");
const athleteSummary = document.querySelector("#athlete-summary");
const competitionSummary = document.querySelector("#competition-summary");
const changeSelection = document.querySelector("#change-selection");

const athletes = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");

athletes.forEach((athlete) => {
    const option = document.createElement("option");
    option.value = athlete.cpf;
    option.textContent =
        `${athlete.nome} • Atleta #${athlete.id} • ${athlete.modalidade}`;
    option.dataset.modalidade = athlete.modalidade;
    option.dataset.nome = athlete.nome;
    athleteSelect.appendChild(option);
});

if (athletes.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Nenhum atleta cadastrado";
    athleteSelect.appendChild(option);
}

const updateAthleteSummary = () => {
    const selectedOption = athleteSelect.selectedOptions[0];

    if (!selectedOption || !selectedOption.value) {
        athleteSummary.textContent = "Modalidade do atleta: não selecionada";
        document.querySelector("#check-athlete").textContent = "Não verificado";
        document.querySelector("#check-athlete-detail").textContent =
            "Selecione um atleta cadastrado.";
        return;
    }

    const modalidade = selectedOption.dataset.modalidade;
    athleteSummary.textContent = `Modalidade do atleta: ${modalidade}`;
    document.querySelector("#check-athlete").textContent = "Validado";
    document.querySelector("#check-athlete-detail").textContent =
        `${selectedOption.dataset.nome} encontrado no sistema.`;
};

const updateCompetitionSummary = () => {
    const selectedOption = competitionSelect.selectedOptions[0];
    if (!selectedOption || !selectedOption.value) {
        competitionSummary.textContent =
            "Modalidade da competição: não selecionada";
        return;
    }

    competitionSummary.textContent =
        `Modalidade da competição: ${selectedOption.textContent.includes("Maratona Urbana")
            ? "Maratona Urbana"
            : "Não identificada"}`;
};

athleteSelect.addEventListener("change", updateAthleteSummary);
competitionSelect.addEventListener("change", updateCompetitionSummary);

changeSelection.addEventListener("click", () => {
    athleteSelect.focus();
});

updateAthleteSummary();
updateCompetitionSummary();
