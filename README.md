Este projeto é uma aplicação web interativa e imersiva, criada para fãs do universo de One Piece. A página funciona como uma enciclopédia digital, apresentando informações detalhadas sobre mais de 100 personagens da série no estilo dos icônicos cartazes de "Procurado" (WANTED).

O design foi cuidadosamente elaborado para simular a estética do mundo de One Piece, utilizando texturas de papel antigo, madeira e fontes temáticas que remetem a mapas de tesouro e cartazes de piratas, proporcionando uma experiência visual única e envolvente.

✨ Funcionalidades Principais

Visualização de Personagens: Exibe os personagens em "cards" estilizados, cada um com uma marca d'água "WANTED", contendo informações como descrição, recompensa, afiliação e Akuma no Mi.

Busca Dinâmica: Permite pesquisar personagens específicos pelo nome, tripulação ou nome da Akuma no Mi em tempo real.

Filtros Avançados:
Filtra personagens por tripulação ou afiliação através de um menu populado dinamicamente.

Exibe apenas personagens que não possuem Akuma no Mi com um único clique.

Ordenação Inteligente: Classifica os personagens atualmente exibidos pela recompensa, do maior para o menor.
Contador de Personagens: Mostra dinamicamente quantos personagens correspondem aos filtros aplicados.

Design Responsivo: A interface se adapta a diferentes tamanhos de tela, garantindo uma boa experiência em desktops, tablets e celulares.

Links Externos: Cada card contém um link que direciona para a página do personagem na One Piece Wiki para informações ainda mais detalhadas.

🛠️ Tecnologias Utilizadas
Este projeto foi construído utilizando tecnologias web fundamentais, com foco em boas práticas e uma experiência de usuário fluida.

HTML5:

Estrutura semântica para organizar o conteúdo de forma clara e acessível.

CSS3:

Design Temático: Uso de fontes customizadas (via Google Fonts), texturas e um esquema de cores baseado em variáveis CSS (:root) para criar uma identidade visual coesa.
Layout Moderno: Flexbox é utilizado para organizar o layout do cabeçalho, dos cards e do rodapé.

Responsividade: Media Queries (@media) garantem que a aplicação seja funcional e esteticamente agradável em qualquer dispositivo.

Detalhes Visuais: Pseudo-elementos (::after) são usados para adicionar a marca d'água "WANTED" em cada card, e transições (transition) proporcionam micro-interações suaves.

JavaScript (Vanilla JS):

Assincronismo: Utilização de async/await com a Fetch API para carregar os dados dos personagens de forma assíncrona a partir de um arquivo JSON local.

Manipulação do DOM: Criação e renderização dinâmica dos cards de personagens, atualizando a interface sem a necessidade de recarregar a página.

Lógica de Interação: Implementação de toda a lógica para a busca por texto, aplicação de múltiplos filtros, e ordenação dos dados. Inclui uma função auxiliar para converter os valores de recompensa (ex: "Beli 3.000.000.000") em números para permitir a ordenação correta.

JSON (JavaScript Object Notation):

Os dados de todos os personagens são armazenados de forma estruturada em um arquivo data.json, separando o conteúdo da lógica da aplicação e facilitando a manutenção e a adição de novos personagens.
