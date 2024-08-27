// Função para adicionar ou editar uma linha na tabela
function adicionarOuEditarLinha() {
    const tabela = document.querySelector('table tbody');
    const editingRowIndex = document.getElementById('pop-up').dataset.editingRow;

    const categoria = document.querySelector('input[name="categoria"]').value;
    const perfilTr = document.querySelector('input[name="perfil-tr"]').value;
    const senioridade = document.querySelector('input[name="senioridade"]').value;
    const formacao = document.querySelector('input[name="formacao"]').value;
    const experiencia = document.querySelector('input[name="tempo-experiencia"]').value;
    const certificacoes = document.querySelector('input[name="certificacoes"]').value;
    const responsabilidades = document.querySelector('input[name="responsabilidades"]').value;

    if (categoria === '' || perfilTr === '' || senioridade === '' || formacao === '' || experiencia === '' || certificacoes === '' || responsabilidades === '') {
        alert("Por favor, preencha todos os campos.");
        return; // Evita a criação de linha vazia ou incompleta
    }

    if (editingRowIndex !== undefined && editingRowIndex !== null && editingRowIndex !== '') {
        // Editando uma linha existente
        const row = tabela.rows[editingRowIndex];
        row.cells[0].textContent = categoria;
        row.cells[1].textContent = perfilTr;
        row.cells[2].textContent = senioridade;
        row.cells[3].textContent = formacao;
        row.cells[4].textContent = experiencia;
        row.cells[5].textContent = certificacoes;
        row.cells[6].textContent = responsabilidades;
    } else {
        // Adicionando uma nova linha
        const novaLinha = document.createElement('tr');

        novaLinha.innerHTML = `
            <td>${categoria}</td>
            <td>${perfilTr}</td>
            <td>${senioridade}</td>
            <td>${formacao}</td>
            <td>${experiencia}</td>
            <td>${certificacoes}</td>
            <td>${responsabilidades}</td>
            <td><button class="delete-btn">X</button></td>
            <td><img class="editar" src="http://localhost:5500/templates/img/Editar.png" alt="Editar"></td>
        `;

        tabela.appendChild(novaLinha);

        // Adicionar funcionalidade de exclusão à nova linha
        novaLinha.querySelector('.delete-btn').addEventListener('click', function() {
            novaLinha.remove();
            salvarDados(); // Salvar os dados após a exclusão
        });

        // Adicionar funcionalidade de edição à nova linha
        novaLinha.querySelector('.editar').addEventListener('click', function() {
            openEditPopup(novaLinha);
        });
    }

    // Limpar a referência à linha sendo editada
    delete document.getElementById('pop-up').dataset.editingRow;

    // Fechar o pop-up
    document.getElementById('pop-up').style.display = 'none';

    // Salvar os dados no localStorage
    salvarDados();
}

// Função para salvar os dados da tabela no localStorage
function salvarDados() {
    const tabela = document.querySelector('table tbody');
    const dados = [];

    for (let i = 0; i < tabela.rows.length; i++) {
        const cells = tabela.rows[i].cells;
        const linha = {
            categoria: cells[0].textContent,
            perfilTr: cells[1].textContent,
            senioridade: cells[2].textContent,
            formacao: cells[3].textContent,
            experiencia: cells[4].textContent,
            certificacoes: cells[5].textContent,
            responsabilidades: cells[6].textContent
        };
        dados.push(linha);
    }

    localStorage.setItem('tabelaDados', JSON.stringify(dados));
}

// Função para carregar os dados do localStorage e preencher a tabela
function carregarDados() {
    const tabela = document.querySelector('table tbody');
    const dados = JSON.parse(localStorage.getItem('tabelaDados'));

    if (dados) {
        dados.forEach(linha => {
            const novaLinha = document.createElement('tr');

            novaLinha.innerHTML = `
                <td>${linha.categoria}</td>
                <td>${linha.perfilTr}</td>
                <td>${linha.senioridade}</td>
                <td>${linha.formacao}</td>
                <td>${linha.experiencia}</td>
                <td>${linha.certificacoes}</td>
                <td>${linha.responsabilidades}</td>
                <td><button class="delete-btn">X</button></td>
                <td><img class="editar" src="http://localhost:5500/templates/img/Editar.png" alt="Editar"></td>
            `;

            tabela.appendChild(novaLinha);

            // Adicionar funcionalidade de exclusão à linha carregada
            novaLinha.querySelector('.delete-btn').addEventListener('click', function() {
                novaLinha.remove();
                salvarDados(); // Salvar os dados após a exclusão
            });

            // Adicionar funcionalidade de edição à linha carregada
            novaLinha.querySelector('.editar').addEventListener('click', function() {
                openEditPopup(novaLinha);
            });
        });
    }
}

// Função para abrir o pop-up com os dados para edição
function openEditPopup(row) {
    const cells = row.querySelectorAll('td');
    document.querySelector('input[name="categoria"]').value = cells[0].textContent;
    document.querySelector('input[name="perfil-tr"]').value = cells[1].textContent;
    document.querySelector('input[name="senioridade"]').value = cells[2].textContent;
    document.querySelector('input[name="formacao"]').value = cells[3].textContent;
    document.querySelector('input[name="tempo-experiencia"]').value = cells[4].textContent;
    document.querySelector('input[name="certificacoes"]').value = cells[5].textContent;
    document.querySelector('input[name="responsabilidades"]').value = cells[6].textContent;

    document.getElementById('pop-up').dataset.editingRow = row.rowIndex - 1; // Subtrai 1 porque rowIndex começa em 1

    document.getElementById('pop-up').style.display = 'flex';
}

// Evento para abrir o pop-up para criar um novo perfil
document.getElementById('open-pop-up').addEventListener('click', function() {
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    delete document.getElementById('pop-up').dataset.editingRow;
    document.getElementById('pop-up').style.display = 'flex';
});

// Certifique-se de que o evento para salvar seja adicionado apenas uma vez
document.querySelector('.filtrar-btn').addEventListener('click', adicionarOuEditarLinha);

// Carregar os dados ao abrir a página
carregarDados();

document.querySelector('.fechar-pop-up').addEventListener('click', function() {
    document.getElementById('pop-up').style.display = 'none';
});

document.querySelector('.export-csv').addEventListener('click', exportarCSV);

function exportarCSV() {
    const tabela = document.querySelector('table');
    const linhas = tabela.querySelectorAll('tr');
    let csv = [];
    
    // Pega os cabeçalhos das colunas
    const headers = [];
    const primeiraLinha = linhas[0].querySelectorAll('th');
    primeiraLinha.forEach((header, index) => {
        // Ignora as duas últimas colunas (Excluir e Editar)
        if (index < primeiraLinha.length - 2) {
            headers.push(header.innerText.trim());
        }
    });
    csv.push(headers.join(","));
    
    // Pega os dados das linhas
    for (let i = 1; i < linhas.length; i++) {
        const cols = linhas[i].querySelectorAll('td');
        let row = [];
        
        cols.forEach((coluna, index) => {
            // Ignora as duas últimas colunas (Excluir e Editar)
            if (index < cols.length - 2) {
                row.push('"' + coluna.innerText.trim() + '"'); // Adiciona aspas para preservar quebras de linha e vírgulas nos dados
            }
        });
        
        csv.push(row.join(","));
    }

    // Cria um Blob com o conteúdo CSV
    // Cria um Blob com o conteúdo CSV
const csvContent = csv.join("\n");
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

// Cria um link temporário para download
const link = document.createElement("a");
if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dados.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
}


// Função para abrir o pop-up com os dados para edição
function openEditPopup(row) {
    const cells = row.querySelectorAll('td');
    document.querySelector('input[name="categoria"]').value = cells[0].textContent;
    document.querySelector('input[name="perfil-tr"]').value = cells[1].textContent;
    document.querySelector('input[name="senioridade"]').value = cells[2].textContent;
    document.querySelector('input[name="formacao"]').value = cells[3].textContent;
    document.querySelector('input[name="tempo-experiencia"]').value = cells[4].textContent;
    document.querySelector('input[name="certificacoes"]').value = cells[5].textContent;
    document.querySelector('input[name="responsabilidades"]').value = cells[6].textContent;

    // Atualizar o texto do título para "Editar Perfil"
    document.querySelector('.title').textContent = "Editar Perfil";

    document.getElementById('pop-up').dataset.editingRow = row.rowIndex - 1; // Subtrai 1 porque rowIndex começa em 1

    document.getElementById('pop-up').style.display = 'flex';

    document.querySelector('.filtrar-btn').textContent = "Editar";
}

// Evento para abrir o pop-up para criar um novo perfil
document.getElementById('open-pop-up').addEventListener('click', function() {
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    delete document.getElementById('pop-up').dataset.editingRow;

    // Atualizar o texto do título para "Criar Perfil"
    document.querySelector('.title').textContent = "Criar Perfil";

    document.getElementById('pop-up').style.display = 'flex';

    document.querySelector('.filtrar-btn').textContent = "Criar";
});

// Função para filtrar a tabela com base na busca
function filtrarTabela() {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll('table tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let match = false;

        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(filter)) {
                match = true;
            }
        });

        row.style.display = match ? '' : 'none'; // Esconde ou exibe a linha com base no resultado
    });
}

// Adiciona o evento de input para filtrar enquanto digita
document.getElementById('search-input').addEventListener('input', filtrarTabela);

