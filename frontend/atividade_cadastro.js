const usuarioLogado = localStorage.getItem('id_usuario');

if (!usuarioLogado) {
    window.location.href = "404.html"; 
}else {
    // 🟢 Se está logado, remove o 'd-none' do Bootstrap para a tela aparecer suavemente
    const painel = document.getElementById("conteudo-painel");
    painel.classList.remove("d-none");
    painel.classList.add("d-flex");
    
    // Seu código original de carregar as atividades continua aqui embaixo...
}
const form=document.getElementById('formcadatividades');

form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    
    const idUsuario=localStorage.getItem('id_usuario');
    if(!idUsuario){
            window.location.href = "login.html";
        return;
        }

    const titulo=document.getElementById('titulo').value;
    const descricao=document.getElementById('descricao').value;

// 🟢 Travando diretamente no JavaScript antes do fetch
    if (titulo.trim() === "" || descricao.trim() === "") {
        alert("Por favor, preencha todos os campos do formulário!");
        return; // 🚨 Para a execução aqui e não envia nada para o servidor
    }
    const newAtividade={
        titulo : titulo,
        descricao:descricao,
        status:"Pendente"
    };
   try{
      const resposta= await fetch(`http://localhost:8000/cadastro_atividades?id_usuario=${idUsuario}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
          },
         body: JSON.stringify(newAtividade)
         });

       if(resposta.ok){
         const atiividade_cad= await resposta.json();
           alert('Atividade cadastrada com sucesso!')
           form.reset();
           return;
       }else{
        const erro= await resposta.json();
        alert(`Erro no cadastro: ${erro.detail || 'Verifique os dados.'}`);
        form.reset();
        return;
       }

}catch(erro){
    console.error('Erro ao conectar com a API:', erro);
    alert('Não foi possível conectar ao servidor. O seu backend FastAPI está ligado?');
}
});