 // Só mostra a página se ele realmente puder ver
// 🚨 GUARDA DE ROTA: Verifica se o usuário está logado ANTES de carregar a página
const usuarioLogado = localStorage.getItem('id_usuario');

if (!usuarioLogado) {
    // Se não encontrar o ID, exibe um aviso e expulsa o invasor para o login
    window.location.href = "404.html"; // Altere para o nome exato do seu arquivo de login
}else {
    //  Se está logado, remove o 'd-none' do Bootstrap para a tela aparecer suavemente
    const painel = document.getElementById("conteudo-painel");
    painel.classList.remove("d-none");
    
    // Seu código original de carregar as atividades continua aqui embaixo...
}

function fazerLogout() {
    // Garante que a memória seja limpa antes de ir para o login!
    localStorage.removeItem('id_usuario'); 
    localStorage.removeItem('nome'); 
}

const formBusca=document.getElementById('formBusca');
const campoBuscar=document.getElementById( 'buscarAtividade')
const idUsuario=localStorage.getItem('id_usuario')
  formBusca.addEventListener('submit',async(event)=>{
    event.preventDefault();
   const atividadeBuscada=campoBuscar.value;
    
    // 🚀 AGORA SIM A MÁGICA FUNCIONA: Se estiver vazio, chama a função limpa lá de cima
    if (atividadeBuscada.trim() === "") {
        await listarTodasAsAtividades(); 
        return; 
    }
    try{
        const resposta=await fetch(`http://localhost:8000/buscar_atividade?id_usuario=${idUsuario}&titulo=${encodeURIComponent(atividadeBuscada)}`,{
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        });
        if(resposta.ok){
            const tarefaBuscada= await resposta.json();
            montarTabela([tarefaBuscada]);
        }else{
             console.error('Erro ao buscar tarefas do servidor');
        }
    }catch (error) {
        console.error('Erro ao conectar com a API:', error);
    }
  });
  // ⌨️ 3. EVENTO DE INPUT (Opcional - Solto também! Se apagar tudo, a tabela volta sozinha)
campoBuscar.addEventListener('input', async () => {
    if (campoBuscar.value.trim() === "") {
        await listarTodasAsAtividades(); 
    }
});

function montarTabela(tarefas) {
            const tbody = document.getElementById('body_table');
            tbody.innerHTML = ''; // Limpa a tabela antes de preencher

            tarefas.forEach(tarefa => {
        // Cria uma linha para cada tarefa vinda do Python
            const linha = `
             <tr id="linha-${tarefa.id_tarefas}">
                 <td class="titulo-celula">${tarefa.titulo}</td>
                 <td class="descricao-celula">${tarefa.descricao}</td>
                <td class="status-celula">${tarefa.status}</td>
          <td class="d-flex justify-content-center gap-3">       
    <button type="button" 
            class="btn btn-link text-secondary p-0 border-0 fs-4" 
            onclick="entrarEmModoEdicao(${tarefa.id_tarefas})">
        <ion-icon name="pencil-outline"></ion-icon>
    </button>
    
    <button type="button" 
            class="btn btn-link text-danger p-0 border-0 fs-4" 
            onclick="deletarAtividade(${tarefa.id_tarefas})">
        <ion-icon name="trash-outline"></ion-icon> 
    </button>
  </td>
             </tr>
          
          `;
            tbody.innerHTML += linha; // Adiciona a linha na tabela
    });
}
async function listarTodasAsAtividades() {
    
// Colocamos o "async" aqui na frente para o await funcionar lá dentro

    const idUsuario = localStorage.getItem('id_usuario');
    const nome = localStorage.getItem('nome');
 
    if (!idUsuario) {
        // Se não tem ID salvo, manda de volta pro login
        window.location.href = "login.html";
        return;
    }

    try {
        // Passamos o id_usuario na URL para o Python saber de quem são as tarefas
        const resposta = await fetch(`http://localhost:8000/atividades?id_usuario=${idUsuario}`,
        {
            method:'GET',
            headers:{'Content-Type': 'application/json'}
        }
        );
        if (resposta.ok) {
            const listaTarefas = await resposta.json();
  // 🔍 ISSO VAI MOSTRAR O QUE VEIO DO PYTHON NO CONSOLE:
          //console.log("O Python respondeu! Dados recebidos:", listaTarefas);
          //console.log("Quantidade de tarefas encontradas:", listaTarefas.length);

          montarTabela(listaTarefas);
          
           
        } else {
            console.error('Erro ao buscar tarefas do servidor');
        }

    } catch (error) {
        console.error('Erro ao conectar com a API:', error);
    }

} document.addEventListener("DOMContentLoaded", async function() {
        await listarTodasAsAtividades()
    });


async function deletarAtividade(idTarefa){
const confirmar = confirm("Tem certeza que deseja excluir esta atividade?");
    if (!confirmar) return;
    const idUsuario=localStorage.getItem('id_usuario');
    try{
        const resposta=await fetch(`http://localhost:8000/delete_atividade?id_usuario=${idUsuario}&id_tarefa=${idTarefa}`,{
            method:'DELETE',
        });
        if (resposta.ok){
            alert('Atividade deletada com sucesso!');
            window.location.reload();
        }else{
            const erro= await resposta.json();
            alert(`Erro ao deletar: ${erro.detail || 'Não foi possível excluir.'}`);
        }
    }catch(error){
        console.error('Erro na requisição delete:',error);
        alert("Não foi possível conectar ao servidor.");
    }
}

// 1️⃣ ETAPA 1: Acionada pelo botão da CANETA (Apenas joga os inputs na tela)
function entrarEmModoEdicao(idTarefa) {
    const linha = document.getElementById(`linha-${idTarefa}`);
    
    const celulaTitulo = linha.querySelector('.titulo-celula');
    const celulaDescricao = linha.querySelector('.descricao-celula');
    const celulaStatus = linha.querySelector('.status-celula');

    const tituloAtual = celulaTitulo.innerText;
    const descricaoAtual = celulaDescricao.innerText;
    const statusAtual = celulaStatus.innerText;
    // Transforma o texto em inputs
    celulaTitulo.innerHTML = `<input type="text" id="input-titulo-${idTarefa}" class="form-control form-control-sm" value="${tituloAtual}">`;
    celulaDescricao.innerHTML = `<input type="text" id="input-descricao-${idTarefa}" class="form-control form-control-sm" value="${descricaoAtual}">`;
    celulaStatus.innerHTML=`<input type="text" id="input-status-${idTarefa}" class="form-control form-control-sm" value="${statusAtual}">`;
    // Troca os botões: Caneta vira DISQUETE, Lixeira vira CANCELAR (X)
    const celulaBotoes = linha.lastElementChild;
    celulaBotoes.innerHTML = `
        <button type="button" class="btn btn-link text-success p-0 border-0 fs-4" onclick="salvarAtualizacao(${idTarefa})">
            <ion-icon name="save-outline"></ion-icon>
        </button>
        <button type="button" class="btn btn-link text-muted p-0 border-0 fs-4" onclick="window.location.reload()">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    `;}
    async function salvarAtualizacao(idTarefa) {
    const confirmar = confirm("Tem certeza que quer atualizar essa atividade?");
    if (!confirmar) return;
    
    
    // Agora sim! O usuário já digitou, então nós lemos o valor atualizado do input
    const novoTitulo = document.getElementById(`input-titulo-${idTarefa}`).value;
    const novaDescricao = document.getElementById(`input-descricao-${idTarefa}`).value;
    const novoStatus = document.getElementById(`input-status-${idTarefa}`).value;

    const idUsuario= localStorage.getItem('id_usuario');

    const dadosAtualizados = {
        titulo: novoTitulo,
        descricao: novaDescricao,
        status:novoStatus
    };

    try {
        const resposta = await fetch(`http://localhost:8000/atualizar_atividade?id_usuario=${idUsuario}&id_atividade=${idTarefa}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (resposta.ok) {
            alert("🎉 Atividade atualizada com sucesso!");
            window.location.reload();
        } else {
            const erro = await resposta.json();
            alert(`Erro ao atualizar: ${erro.detail || 'Essa atividade já pertecence outro usuario!.'}`);
        }
    } catch (error) {
        console.error('Erro na requisição update:', error);
        alert("Não foi possível conectar ao servidor.");
    }
}