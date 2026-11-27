export async function carregarDadosMockados() {
    if (!localStorage.getItem("atletas")) {
        const respostaAtletas = await fetch(
            new URL("../front-end/data/atletasMockados.json", import.meta.url),
        );
        if (!respostaAtletas.ok) {
            throw new Error(`Falha ao carregar atletas: HTTP ${respostaAtletas.status}.`);
        }
        localStorage.setItem("atletas", JSON.stringify(await respostaAtletas.json()));
    }

    if (!localStorage.getItem("competicoes")) {
        const respostaCompeticoes = await fetch(
            new URL("../front-end/data/competicoesMockadas.json", import.meta.url),
        );
        if (!respostaCompeticoes.ok) {
            throw new Error(
                `Falha ao carregar competições: HTTP ${respostaCompeticoes.status}.`,
            );
        }
        localStorage.setItem(
            "competicoes",
            JSON.stringify(await respostaCompeticoes.json()),
        );
    }
}
