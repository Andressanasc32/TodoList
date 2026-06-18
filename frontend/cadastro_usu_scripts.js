const usuarioLogado = localStorage.getItem('id_usuario');
if(usuarioLogado){
    window.location.href="painel.html"
}
    // 1. Pegamos o formulário do HTML pelo ID
const form = document.getElementById('formCadastro');

// 2. Adicionamos um evento para quando o formulário for enviado (submetido)
form.addEventListener('submit', async (event) => {
    // Evita que a página recarregue ao enviar o formulário
    event.preventDefault();

    // 3. Capturamos os valores que o usuário digitou nos inputs
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // 4. Montamos o objeto exatamente no formato que o Pydantic (CreateUsuario) espera
    const dadosUsuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    try {
        // 5. Fazemos o disparo (fetch) para a rota do seu backend FastAPI
        const resposta = await fetch('http://localhost:8000/cadastro_usuario', {
            method: 'POST', // Método HTTP correspondente à rota @app.post
            headers: {
                'Content-Type': 'application/json' // Avisa a API que estamos enviando um JSON
            },
            body: JSON.stringify(dadosUsuario) // Transforma o objeto JavaScript em texto JSON
        });

        // 6. Verificamos se a API aceitou e salvou no banco
        if (resposta.ok) {
            const usuarioCriado = await resposta.json();
            alert(`Usuário ${usuarioCriado.nome} cadastrado com sucesso! ID: ${usuarioCriado.id_usuario}`);
            form.reset(); // Limpa os campos do formulário
        }
        if (resposta.status === 422) {
        alert("A senha precisa ter pelo menos 6 caracteres!");
        return; // Para a execução aqui
         }
       // Se o e-mail já existe (Status 400 ou o que você configurou)
    if (resposta.status === 404) {
        alert("Ops! Você já tem uma conta no sistema. Que tal fazer o login?");
        meuFormulario.reset(); // Seu reset que já funciona!
        return;
       } 
    }catch (error) {
        console.error('Erro ao conectar com a API:', error);
        alert('Não foi possível conectar ao servidor. O seu backend FastAPI está ligado?');
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const bolinhasContainer = document.querySelector(".bolinhas");
    for (let i = 0; i < 10; i++) {
        const bolinha = document.createElement("li");
        bolinhasContainer.appendChild(bolinha);
    }
});