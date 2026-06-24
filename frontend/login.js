/*const usuarioLogado = localStorage.getItem('id_usuario');
if(usuarioLogado){
    window.location.href="painel.html"
}
*/
const form=document.getElementById("formlogin");

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;


        const dadosUsuario = {
        email: email,
        senha: senha
};
 try {
        // 5. Fazemos o disparo (fetch) para a rota do seu backend FastAPI
        const resposta = await fetch(`http://localhost:8000/login_usuario`, {
            method: 'POST', // Método HTTP correspondente à rota @app.post
            headers: {
                'Content-Type': 'application/json' // Avisa a API que estamos enviando um JSON
            },
            body: JSON.stringify(dadosUsuario) // Transforma o objeto JavaScript em texto JSON
       });
 
        if (resposta.status===404){
        alert("Ops! Este e-mail não está cadastrado. Verifique o que digitou ou crie uma conta.");
         form.reset()// Seu reset que já funciona!
         return;
        }
       if (resposta.status===401){
        alert("Ops! Senha incorreto!.");
       // form.reset()// Seu reset que já funciona!
        return;
        }
      
        const usuarioLogado= await resposta.json();
        // Salva o ID do usuário na memória do navegador para usar depois
     
        localStorage.setItem('id_usuario',usuarioLogado.id_usuario);
        localStorage.setItem('nome',usuarioLogado.nome);
        window.location.href="painel_usuario.html";
        
    }catch (error) {
        console.error('Erro ao conectar com a API:', error);
        alert('Não foi possível conectar ao servidor. O seu backend FastAPI está ligado?');
    }
});
