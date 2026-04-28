import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function App() {

  //Estados de autenticação
  const [ user, setUser ] = useState(null);
  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  
  //Estados da tarefa
  const [ tarefas, setTarefas ] = useState([]);
  const [ titulo, setTitulo ] = useState('');
  const [ descricao, setDescricao ] = useState('');

  useEffect(function(){
    
    async function carregarSessao(){
      const resposta = await supabase.auth.getSession();
      const sessao = resposta.data.session;

      if(sessao){
        setUser(sessao.user);
      } else {
        setUser(null);
      }
    }
    carregarSessao();

    const listener = supabase.auth.onAuthStateChange(
      function(evento, sessao) {
        if(sessao){
          setUser(sessao.user);
        } else {
          setUser(null);
        }
      }
    );

    return function(){
      listener.data.subscription.unsubscribe();
    }
  }, []);

  useEffect(function(){
    if(user){
      buscarTarefas();
    } else {
      setTarefas([]);
    }
  }, [user]);

  async function cadastrar() {
    const resposta = await supabase.auth.signUp(
      {
        email: email,
        password: senha
      }
    );

    if(resposta.error){
      alert('Erro ao cadastrar: ' + resposta.error.message);
    } else {
      alert('Mais um pro time! Se vira, menó');
    }
  }

  async function login() {
    const resposta = await supabase.auth.signInWithPassword(
      {
        email: email,
        password: senha,
      }
    );
  }

  async function logout(){
    await supabase.auth.signOut();
  }

  if(!user){
    return (
      <div>da nada</div>
    )
  }
  return (
    <div>deu tudo</div>
  )
}
