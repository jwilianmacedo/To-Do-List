// Constantes
const LISTA_TAREFAS = 'lista_tarefas';
const btnConfirmar = document.getElementById('id-confirmar'); 

carregarListaTarefas();

function gerarId() {
    let i, random;
    let id = '';

    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            id += '-';
        }
        id += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
    }

    return id;
}

function getDataGrid() {
    return JSON.parse(localStorage.getItem(LISTA_TAREFAS));
}


function setDataGrid(data) {
    localStorage.setItem(LISTA_TAREFAS, data);
}

function adicionarTarefa() {
    const tarefa = document.getElementById("txt-tarefa").value;

    const data = getDataGrid();

    if (!tarefa) {
        alert("Preencha o campo Tarefa!");
    } else if (data?.filter(x => x.tarefa.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "") === tarefa.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "")).length > 0) {
        window.alert(`Já existe a tarefa: ${tarefa} na lista.`)
    } else {
        const objTarefa = {
            id: '',
            tarefa: '',
            feito: false
        }


        objTarefa.id = `tarefa-${gerarId()}`;
        objTarefa.tarefa = tarefa;

        const data = getDataGrid();

        let newData = '';

        if (data !== null) {
            //data.push(objTarefa);
            newData = JSON.stringify([objTarefa, ...data]);
        } else {
            newData = JSON.stringify([objTarefa]);
        }

        setDataGrid(newData);

        document.getElementById("txt-tarefa").value = '';
        document.getElementById("txt-tarefa").focus();

        carregarListaTarefas();


    }
}

function excluirTarefa(id) {
    const data = getDataGrid();
    const newDataFinal = [];

    for (let index = 0; index < data.length; index++) {
        const tarefa = data[index];
        if (tarefa.id !== id) {
            newDataFinal.push(tarefa)
        }
    }

    const newData = JSON.stringify(newDataFinal);
    setDataGrid(newData);

    
    document.getElementById("txt-pesquisar").value = '';
    document.getElementById("txt-pesquisar").focus();

    document.getElementById("txt-tarefa").value = '';
    document.getElementById("txt-tarefa").focus();


    carregarListaTarefas();

    document.getElementById('id-confirmar').classList.add('esconder-botoes')
    document.getElementById('id-cancelar').classList.add('esconder-botoes')
    document.getElementById('id-adicionar').classList.remove('esconder-botoes')
}

function Editar(objTarefa) {
    document.getElementById('txt-tarefa').value = objTarefa.tarefa

    document.getElementById('id-confirmar').classList.remove('esconder-botoes')
    document.getElementById('id-cancelar').classList.remove('esconder-botoes')
    document.getElementById('id-adicionar').classList.add('esconder-botoes')
    btnConfirmar.onclick = confirmar.bind(this, objTarefa.id)
}

function cancelar(){
    document.getElementById('txt-tarefa').value = ''
    document.getElementById('txt-tarefa').focus()

    document.getElementById('id-confirmar').classList.add('esconder-botoes')
    document.getElementById('id-cancelar').classList.add('esconder-botoes')
    document.getElementById('id-adicionar').classList.remove('esconder-botoes')

    document.getElementById("txt-pesquisar").value = '';
    document.getElementById("txt-tarefa").focus();

    carregarListaTarefas();
}

function confirmar(id_alvo){
    
    const novoValor = document.getElementById("txt-tarefa").value; 
    const data = getDataGrid(); 
 
    if (!novoValor) { 
        alert("Preencha o campo Tarefa!"); 
    } else if (data?.filter(x => x.tarefa.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "") === novoValor.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "")
    && x.id != id_alvo).length > 0) { 
        window.alert(`Já existe a tarefa: ${novoValor} na lista.`) 
    } else { 
        const indexAlvo = data?.findIndex(({id})=> id === id_alvo) 
        data[indexAlvo].tarefa = novoValor 
 
        setDataGrid(JSON.stringify(data)) 
 
        document.getElementById("txt-tarefa").value = '';
        document.getElementById("txt-tarefa").focus();
 
        carregarListaTarefas(); 
    } 

    
    document.getElementById('txt-tarefa').focus()

    document.getElementById('id-confirmar').classList.add('esconder-botoes')
    document.getElementById('id-cancelar').classList.add('esconder-botoes')
    document.getElementById('id-adicionar').classList.remove('esconder-botoes')

    
    document.getElementById("txt-pesquisar").value = '';
    document.getElementById("txt-tarefa").focus();

}

function filtrar(completada) {
    const data = getDataGrid();
    const newDataFinal = [];

    if (data !== undefined && data != null && data.length > 0) {
        for (let index = 0; index < data.length; index++) {
            const tarefa = data[index];
            if (completada) {
                if (tarefa.feito) {
                    newDataFinal.push(tarefa)
                }
            } else {
                if (!tarefa.feito) {
                    newDataFinal.push(tarefa)
                }
            }

        }

        carregarListaTarefas(newDataFinal);
    }
}

function filtrarTodas() {
    carregarListaTarefas();
}

function completarTarefa(id) {
    const data = getDataGrid();

    const dataAtualizada = data.map(tarefa => {
        if (tarefa.id === id) {
            let feitoTarefa = false;

            if (!tarefa.feito) {
                feitoTarefa = true;
            }

            return { id: tarefa.id, tarefa: tarefa.tarefa, feito: feitoTarefa }
        }

        return tarefa;
    });

    setDataGrid(JSON.stringify(dataAtualizada));


    document.getElementById("txt-pesquisar").value = '';
    document.getElementById('txt-tarefa').focus()

    carregarListaTarefas();
}

function carregarListaTarefas(dataFilter = null) {
    let dataRender = [];
    if (dataFilter !== null) {
        dataRender = dataFilter;
    } else {
        dataRender = getDataGrid();
    }

    const gridTarefas = document.getElementById('grid-tarefas');

    if (dataRender !== undefined && dataRender != null && dataRender.length > 0) {
        // Limpando os elementos
        gridTarefas.innerHTML = '';
        gridTarefas.classList.remove("container-center");

        dataRender.forEach(objTarefa => {
            const tarefaContainerPrincipal = document.createElement('div');
            tarefaContainerPrincipal.classList.add('container-tarefas');

            const tarefaContainerTarefa = document.createElement('div');
            tarefaContainerTarefa.classList.add('container-tarefa');

            const tarefaContainerPrincipalTarefaTexto = document.createElement('span');
            let style = "word-break: break-all; font-size: 16px;";
            if (objTarefa.feito) {
                style += "text-decoration: line-through;"
            }
            tarefaContainerPrincipalTarefaTexto.style = style;
            tarefaContainerPrincipalTarefaTexto.innerHTML = objTarefa.tarefa;
            tarefaContainerTarefa.appendChild(tarefaContainerPrincipalTarefaTexto);

            const tarefaContainerIcons = document.createElement('div');
            tarefaContainerIcons.classList.add('container-icones');

            // Completar
            const iconCompletarElemento = document.createElement('img');
            iconCompletarElemento.src = 'imagens/check.png'
            iconCompletarElemento.style = "margin-left: 10px; height: 27px;";
            iconCompletarElemento.onclick = () => completarTarefa(objTarefa.id);

            // Adicionando botao de completar na tarefa
            tarefaContainerIcons.appendChild(iconCompletarElemento);


            // Excluir
            const iconExcluirElemento = document.createElement('img');
            iconExcluirElemento.src = 'imagens/excluir (1).png';
            iconExcluirElemento.style = "margin-left: 10px; height: 27px;";
            iconExcluirElemento.onclick = () => excluirTarefa(objTarefa.id);

            // Adicionando botao de exluir na tarefa
            tarefaContainerIcons.appendChild(iconExcluirElemento);

             //Editar
             const iconEditarElemento = document.createElement('img');
             iconEditarElemento.src = 'imagens/editar.png';
             iconEditarElemento.style = "margin-left: 10px; height: 27px;";
             iconEditarElemento.onclick = () => Editar(objTarefa);

            // Adicionando botao de editar na tarefa
             tarefaContainerIcons.appendChild(iconEditarElemento);


            // Adicionando as tarefas na tag LI
            tarefaContainerTarefa.appendChild(tarefaContainerIcons);
            tarefaContainerPrincipal.appendChild(tarefaContainerTarefa);


            const tarefaElemento = document.createElement('li');
            tarefaElemento.id = objTarefa.id;
            tarefaElemento.appendChild(tarefaContainerPrincipal);

            // Adicionando as tarefas na tag UL
            gridTarefas.appendChild(tarefaElemento);
        });
    } else {
        gridTarefas.innerHTML = "<span style='font-size: 14px'>Nenhuma tarefa encontrada.</span>";
        gridTarefas.classList.add("container-center");
    }
}

//pesquisa
function pesquisa() {
    const elemento_pesquisa = document.getElementById("txt-pesquisar");
    const elemento_completadas = document.getElementById("completadas");
    const elemento_naoCompletadas = document.getElementById("naoCompletadas");
    
    let data_filtrada = [];

    const data = getDataGrid();

    if (elemento_completadas.checked){
        data_filtrada = data.filter(x => x.tarefa.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "").includes(elemento_pesquisa.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "")) && x.tarefa.feito)
    } else if (elemento_naoCompletadas.checked){
        data_filtrada = data.filter(x => x.tarefa.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "").includes(elemento_pesquisa.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "")) && x.tarefa.feito === false)
    } else {
        data_filtrada = data.filter(x => x.tarefa.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "").includes(elemento_pesquisa.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "")))
    }

    carregarListaTarefas(data_filtrada);
      
}
