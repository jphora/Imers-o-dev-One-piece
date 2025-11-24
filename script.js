// Seleciona os elementos do HTML com os quais vamos interagir e os armazena em variáveis.
let cardContainer = document.querySelector(".card-container"); // Onde os cards dos personagens serão inseridos.
let buscaInput = document.querySelector("#busca-input"); // O campo de texto para a busca.
let buscaBotao = document.querySelector("#botao-busca"); // O botão de busca.
let dados = []; // Um array vazio que irá armazenar todos os dados dos personagens carregados do JSON.
let semFrutaBotao = document.querySelector("#botao-sem-fruta"); // O botão para filtrar personagens sem Akuma no Mi.
let filtroTripulacaoSelect = document.querySelector("#filtro-tripulacao"); // O menu suspenso para filtrar por tripulação.
let mostrarTodosBotao = document.querySelector("#botao-mostrar-todos"); // O botão para limpar os filtros.
let ordenarRecompensaBotao = document.querySelector("#botao-ordenar-recompensa"); // O novo botão para ordenar.
let contadorPersonagens = document.querySelector("#contador-personagens"); // O elemento <p> que mostra a contagem de personagens.

let filtroSemFrutaAtivo = false; // Uma variável "flag" para saber se o filtro "Sem Akuma no Mi" está ativado ou não.
let dadosAtuais = []; // Um array para guardar os dados que estão sendo exibidos na tela.

// Função assíncrona para carregar os dados dos personagens do arquivo JSON.
async function carregarDados() {
    let resposta = await fetch("data.json"); // Faz uma requisição para buscar o arquivo 'data.json'. 'await' pausa a função até a requisição ser completada.
    dados = await resposta.json(); // Converte a resposta em um objeto JavaScript (um array de personagens) e armazena na variável 'dados'.
    popularFiltroTripulacao(); // Chama a função para preencher o menu de filtro de tripulações.
    renderizarCards(dados); // Chama a função para exibir todos os personagens na tela pela primeira vez.
}

// Função para preencher o menu suspenso (<select>) com as tripulações existentes.
function popularFiltroTripulacao() {
    // Cria um array com todas as afiliações, remove as duplicadas e as ordena.
    const tripulacoes = [...new Set(dados.map(dado => dado.tripulacao).filter(t => t))]; // 1. 'map' cria um array só com as tripulações. 2. 'filter' remove valores vazios. 3. 'new Set' remove duplicatas. 4. '...' (spread) converte o Set de volta para um array.
    tripulacoes.sort(); // Ordena as tripulações em ordem alfabética.

    // Adiciona a opção padrão "Todas as Tripulações" no início do menu.
    filtroTripulacaoSelect.innerHTML = `<option value="">Todas as Tripulações</option>`;

    // Itera sobre cada tripulação única e cria uma opção (<option>) para ela no menu.
    for (const tripulacao of tripulacoes) {
        const option = document.createElement('option'); // Cria um elemento <option>.
        option.value = tripulacao; // Define o valor da opção (o que será usado no filtro).
        option.textContent = tripulacao; // Define o texto visível da opção.
        filtroTripulacaoSelect.appendChild(option); // Adiciona a opção ao menu <select>.
    }
}

// Função central que aplica todos os filtros ativos aos dados dos personagens.
function aplicarFiltros() {
    let dadosFiltrados = [...dados]; // Cria uma cópia do array original de dados para não modificar a lista principal.

    const termoBusca = buscaInput.value.toLowerCase().trim(); // Pega o texto da busca, converte para minúsculas e remove espaços em branco do início e fim.
    if (termoBusca) { // Se houver um termo de busca, ele tem prioridade sobre os outros filtros.
        // Verifica se o termo de busca é primariamente numérico para tratar como busca por recompensa.
        const isNumericSearch = /[\d.,]/.test(termoBusca);

        if (isNumericSearch) {
            // Se for uma busca numérica, compara o valor exato da recompensa.
            const valorBusca = parseRecompensa(termoBusca);
            dadosFiltrados = dadosFiltrados.filter(dado => parseRecompensa(dado.recompensa) === valorBusca);
        } else {
            // Se for uma busca por texto, procura no nome, fruta ou tripulação.
            dadosFiltrados = dadosFiltrados.filter(dado => {
                const nomeMatch = dado.nome && dado.nome.toLowerCase().includes(termoBusca);
                const frutaMatch = dado.fruta && dado.fruta.toLowerCase().includes(termoBusca);
                const tripulacaoMatch = dado.tripulacao && dado.tripulacao.toLowerCase().includes(termoBusca);

                return nomeMatch || frutaMatch || tripulacaoMatch; // Retorna verdadeiro se encontrar em qualquer um dos campos de texto.
            });
        }
    } else if (filtroSemFrutaAtivo) { // Se não houver busca, aplica o filtro "Sem Akuma no Mi" se ele estiver ativo.
        dadosFiltrados = dadosFiltrados.filter(dado => !dado.fruta || dado.fruta === "Nenhuma"); // Filtra mantendo personagens que não têm a propriedade 'fruta' ou cujo valor é "Nenhuma".
    }

    // Aplica o filtro de tripulação sobre o resultado dos filtros anteriores.
    const tripulacaoSelecionada = filtroTripulacaoSelect.value; // Pega o valor da tripulação selecionada no menu.
    if (tripulacaoSelecionada) { // Se uma tripulação foi selecionada (e não é a opção padrão "Todas").
        dadosFiltrados = dadosFiltrados.filter(dado => dado.tripulacao === tripulacaoSelecionada); // Filtra mantendo apenas os personagens daquela tripulação.
    }

    renderizarCards(dadosFiltrados); // Exibe na tela os personagens que passaram por todos os filtros.
}


// Função para criar e exibir os cards dos personagens na tela.
function renderizarCards(dadosParaRenderizar) {
    cardContainer.innerHTML = ""; // Limpa todos os cards que estavam na tela para exibir os novos resultados.

    dadosAtuais = dadosParaRenderizar; // Atualiza a lista de dados atuais sempre que a tela é renderizada.
    // Atualiza o texto do contador com o número de personagens que serão exibidos.
    contadorPersonagens.textContent = `${dadosParaRenderizar.length} personagens encontrados`;

    // Itera sobre cada personagem nos dados filtrados.
    for (let dado of dadosParaRenderizar) {
        let article = document.createElement("article"); // Cria um elemento <article> para ser o card.
        article.classList.add("card"); // Adiciona a classe 'card' para aplicar os estilos do CSS.

        // Cria o HTML para a Akuma no Mi, mas só se o personagem tiver uma.
        let frutaHtml = (dado.fruta && dado.fruta !== "Nenhuma") 
            ? `<p><strong>Fruta:</strong> ${dado.fruta}</p>` 
            : ''; // Se não tiver, a string fica vazia.
        // Cria o HTML para a afiliação, se existir.
        let tripulacaoHtml = dado.tripulacao
            ? `<p><strong>Afiliação:</strong> ${dado.tripulacao}</p>`
            : '';
        // Cria o HTML para a recompensa, tratando os casos de "Nenhuma" ou "Desconhecida".
        let recompensaHtml = (dado.recompensa && dado.recompensa !== "Nenhuma" && dado.recompensa !== "Desconhecida")
            ? `<p class="recompensa-p"><strong>Recompensa:</strong> ${dado.recompensa}</p>`
            : (dado.recompensa === "Desconhecida" ? `<p class="recompensa-p"><strong>Recompensa:</strong> ${dado.recompensa}</p>` : '');
        
        // Monta todo o conteúdo HTML do card usando template literals (crases).
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.descricao}</p>
        <p>${dado.idade}</p>
        ${recompensaHtml}
        ${frutaHtml}
        ${tripulacaoHtml}
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `
        cardContainer.appendChild(article); // Adiciona o card recém-criado ao contêiner na página.
    }
}

// Adiciona um "ouvinte de evento" para o clique no botão de busca.
buscaBotao.addEventListener('click', aplicarFiltros);

// Adiciona um "ouvinte" para a tecla "Enter" no campo de busca.
buscaInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') { // Se a tecla pressionada for "Enter"...
        aplicarFiltros(); // ...chama a função de aplicar filtros.
    }
});

// Adiciona um "ouvinte" para o clique no botão "Sem Akuma no Mi".
semFrutaBotao.addEventListener('click', function() {
    filtroSemFrutaAtivo = true; // Ativa a flag do filtro.
    aplicarFiltros(); // Re-aplica todos os filtros.
});

// Adiciona um "ouvinte" para a mudança de valor no menu de tripulações.
filtroTripulacaoSelect.addEventListener('change', function() {
    aplicarFiltros(); // Re-aplica todos os filtros sempre que uma nova tripulação é selecionada.
});

// Adiciona um "ouvinte" para o clique no botão "Mostrar Todos".
mostrarTodosBotao.addEventListener('click', function() {
    // Limpa todos os campos de filtro e flags.
    buscaInput.value = "";
    filtroTripulacaoSelect.value = "";
    filtroSemFrutaAtivo = false; // Desativa a flag do filtro "Sem Akuma no Mi".

    // Renderiza a lista completa de personagens novamente.
    renderizarCards(dados);
});

// Função auxiliar para converter a string de recompensa em um número.
function parseRecompensa(recompensaStr) {
    if (!recompensaStr || recompensaStr === "Nenhuma" || recompensaStr === "Desconhecida") {
        return 0; // Personagens sem recompensa ou com recompensa desconhecida são tratados como 0.
    }
    // Remove "Beli ", pontos, e qualquer outra coisa que não seja um dígito.
    const numeroLimpo = recompensaStr.replace(/\D/g, '');
    return parseInt(numeroLimpo, 10); // Converte a string limpa para um número inteiro.
}

// Adiciona um "ouvinte" para o clique no botão de ordenar por recompensa.
ordenarRecompensaBotao.addEventListener('click', function() {
    // Cria uma cópia do array de dados atuais para não modificar o original.
    const dadosOrdenados = [...dadosAtuais];

    // Ordena o array. A função de comparação (a, b) ordena do maior para o menor.
    dadosOrdenados.sort((a, b) => parseRecompensa(b.recompensa) - parseRecompensa(a.recompensa));

    renderizarCards(dadosOrdenados); // Renderiza os cards com a nova ordem.
});

carregarDados(); // Chama a função inicial para carregar os dados assim que o script é executado.