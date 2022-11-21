//add and delete item product

const $item = $('.item').html()

$('#buttonItemInclude').on('click', function(){    
    $('.products').append(`<div class="row item">${$item}</div>`)
    $('.containerButtonDeleteItem').removeClass( "hidden" )
})

$(document).on('click', '.buttonDeleteItem', function(){
    $(this).parent().parent().remove()
    if($('.containerButtonDeleteItem').length == 1){
        $('.containerButtonDeleteItem').addClass( "hidden" )
    }
})

//calculate item total value

$(document).on( "focusout", '#qtdeEstoque', function(){
    $(this).closest('div').next('div').find('input:text').trigger('focusout')
})

$(document).on( "focusout", '#valorUnitario', function(){
    calculateValueTotalItem(this)
})

function calculateValueTotalItem(thisItem){    
    let quantityStock = $(thisItem).closest('div').prev('div').find('input:text').val()
    let fullValue = $(thisItem).closest('div').next('div').find('input:text')
    if(!$(thisItem).val() == '' && !quantityStock == ''){
        let result = quantityStock * $(thisItem).val() 
        fullValue.val(`R$ ${result}`)
    }
}

//send formulary

$('#send').on('click', function(){
    const formulary = { };
    let thisOk   
    $('.requester input, .provider input').each(function(){
        
        if($(this).hasClass("required") && $(this).val() == ''){
            alert('Por favor, preencha os campos obrigatórios')
            thisOk = false
            return false         
        } else {
            formulary[$(this).attr('id')] = $(this).val();
            thisOk = true
        }
    });    
    let itemList = {}; 
    let contItem = 1 
    if(thisOk){
        $('.products input, select').each(function(){
            if($(this).hasClass("required") && $(this).val() == ''){
                alert('Por favor, preencha os campos obrigatórios')
                thisOk = false
                return false            
            }else{
                itemList[$(this).attr('id')] = $(this).val();
        
                if($(this).attr('id') == 'totalPrice'){
                    formulary[`item${contItem}`] = itemList;
                    itemList = {}
                    contItem++
                }
                thisOk = true
            }
        });   
    }

    if(anexos.length == 0){
        alert('Inclua ao menos um documento nos anexos!')
        thisOk = false
    }
    
    if(thisOk){
        formulary['anexos'] = anexos
        sessionStorage.setItem('@form-registration', JSON.stringify(formulary))
        alert('Formulário enviado!')
    }
})

//Upload append

$('#openFileUpload').click(function(){ $('#fileUpload').trigger('click')});

let anexos = []
let contAppendFile = 0

$('#fileUpload').on("change", function(){
    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);        
        reader.onload = function () {            
            anexos[contAppendFile] = 
                [{
                    indice: contAppendFile,
                    nomeArquivo: file.name,
                    blobArquivo: reader.result            
                }]                            
            updateSessionStorage()           
            filesTextArea()
            contAppendFile++   
        };

    };
     var fileUpload = document.getElementById("fileUpload")
     var file = fileUpload.files[0]
     getBase64(file); 
})

function updateSessionStorage(){
    sessionStorage.setItem('@file-append', JSON.stringify(anexos))
}

//List Files append in page

let listFiles = []

function filesTextArea(){
    anexos.forEach((e) => {
        e.forEach((e) => {listFiles[contAppendFile] = e.nomeArquivo})
    })                             
    $('#docsArea').append(`
    <div class="row fs-md-margin" id="${contAppendFile}">
    <button type="button" class="btn btn-danger buttonDeleteFile">Apagar</button>
    <button type="button" class="btn btn-success buttonDownFile">Download</button>
    ${listFiles.slice(-1).join("\n")}</div>`) 
}

// delete files append

$(document).on('click', '.buttonDeleteFile', function(){    
    const indiceFileDelete = $(this).parent().attr('id')
    sessionStorage.removeItem('@file-append')
    anexos.splice(indiceFileDelete, 1)
    updateSessionStorage()
    contAppendFile--
    $(this).parent().remove()
})

// Download append

$(document).on("click", '.buttonDownFile', function() {    
    const indiceFileDown = $(this).parent().attr('id')
    downloadFile(indiceFileDown)
});

function downloadFile(indiceFileDown) {      
    let fileDownload = JSON.parse(sessionStorage.getItem('@file-append'))    
    let file = fileDownload[indiceFileDown][0];
    let link = document.createElement('a');
    link.href = file.blobArquivo;
    link.download = file.nomeArquivo;
    link.click();      
    
}

//autocomplete for cep

const inputAddress = (address) => {
    $('#address').val(address.logradouro)
    $('#district').val(address.bairro)
    $('#state').val(address.uf)
    $('#county').val(address.localidade)    
}

const searchCep = async() => {
    const cep = $('#cep').val()
    const url = `http://viacep.com.br/ws/${cep}/json/`
    const dateAddress = await fetch(url)
    const address = await dateAddress.json() 
    if(!address.hasOwnProperty('erro')){
        inputAddress(address)
    }
}

$('#cep').on( "focusout", searchCep)