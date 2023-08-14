/* Define constants and variables useful for site */
const attributes = { 'INT': 'inteligencia', 
                     'REF': 'reflejos', 
                     'TEC': 'tecnica',
                     'FRI': 'frialdad',
                     'ATR': 'atractivo',
                     'SUE': 'suerte',
                     'MOV': 'movimiento',
                     'TCO': 'tipo_corporal', 
                     'EMP': 'empatia' };
let base_array = new Object();
base_array['capacidad_especial'] = {'atributo': false, 'nombre': '', 'valor': 0, 'base': false};
base_array['habilidades_principales'] = {'atributo': 0, 'nombre': '', 'valor': 0, 'base': false};
base_array['habilidades_secundarias'] = {'atributo': 0, 'nombre': '', 'valor': 0, 'base': false};
base_array['ciberequipo'] = {'tipo': '', 'nombre': '', 'disponibilidad': 0, 'humanidad': 0, 'peso': 0, 'slot': 0, 'descripcion': ''};
base_array['armas'] = {'categoria': '', 'nombre': '', 'disponibilidad': 0, 'disimulo': 0, 'pa': 0, 'municion': 0, 'vd': 0, 'balas': 0, 'fiabilidad': 0, 'distancia': '', 'danno': 0, 'peso': 0, 'slot': 0, 'descripcion': ''};
base_array['blindaje'] = {'categoria': '', 'nombre': '', 'disponibilidad': 0, 'tipo': 0, 'cp': 0, 'ce': 0, 'peso': 0, 'slot': 0, 'descripcion': ''};
base_array['equipo'] = {'categoria': '', 'nombre': '', 'peso': 0, 'slot': 0, 'descripcion': ''};
base_array['otros'] = {'categoria': '', 'nombre': '', 'descripcion': ''};
let characterList = null;
let actualCharacter = {};

/* Functions to interact with UI */
function openCharacterList(){
    $('#sideNav').css('width', '250px');
    $('#main').css('marginLeft', '250px').fadeTo(1000, 0.4);
    if (!characterList) {
        loadCharacterList();
    }
}

function closeCharacterList(){
    $('#sideNav').css('width', '0px');
    $('#main').css('marginLeft', '0px').fadeTo(1000, 1);
}

function changeEditMode(mode) {
    $('.grid-value').attr('readonly', !mode);
    if (mode) {
        $('.grid-value').css({'background-color': '#333333', 
                              'color': 'yellow'});
        $('.action-buttons').css({'display': 'block'});
    }
    else {
        $('.grid-value').css({'background-color': 'black', 
                              'color': 'yellow'});
        $('.action-buttons').css({'display': 'none'});
    }
}

function addNewRow(type, block, dataRow, name, isNew = true) {
    let rowSchema = base_array[type];
    let newDataRow = {};
    let html = '';
    $.each(rowSchema, function(key, value){
        html += '<div>'
        if (value !== false) {
            newDataRow[key] = dataRow[key];
            html += '<input type="text" class="grid-value' + (typeof value == 'number'?' text-center':'') + '" id="' + name + '_' + key + '_' + (isNew?actualCharacter[type].length:isNew) + '" value="' + (isNew?'':dataRow[key]) + '"/>';
        }
        html += '</div>';
    });
    $('#' + block + '-block-content').append(html);
    return newDataRow;
}

/* Functions to interact with data */
function addNewElement(type, block, name) {
    let dataRow = base_array[type];
    let newDataRow = addNewRow(type, block, dataRow, name);
    actualCharacter[type].push(newDataRow);
    console.log(actualCharacter);
    $('.grid-value').css({'background-color': '#333333', 'color': 'yellow'});
}

function loadCharacterList(){
    $('#personajes').hide();
    $('#personajes_loading').show();
    $.ajax({
        url: 'https://sa-east-1.aws.data.mongodb-api.com/app/data-krfva/endpoint/data/v1/action/find',
        method: 'POST',
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
            'apikey': '4YtLjj1pn1x1xOfFhGFP6XFMboKaq3bSkQ54tVRgaBAm3omTW46nHXhQH3KvG4AL'
        },
        data: JSON.stringify({
            'dataSource': 'Cluster0',
            'database': 'cyberpunk',
            'collection': 'personajes'
        }),
        success: function(data) {
            characterList = data.documents;
            let html = '\n';
            $.each(data.documents, function(id, obj) {
                html += '<a href="#" onclick="fillCharacterSheet(' + id + ')">' + obj.nombre + '</a>\n';
            });
            $('#personajes').html(html);
            $('#personajes_loading').hide();
            $('#personajes').show();
        },
        error: function(obj, error) {
            console.error('Error ' + error);
        }
    }); 
}

function fillCharacterSheet(i){
    actualCharacter = characterList[i];

    // Hide buttons meanwhile load data
    $('#create-button').hide();
    $('#edit-button').hide();
    $('#save-button').hide();

    // Change to readonly mode
    changeEditMode(false);

    //  Load general information of character
    $('#nombre').val(actualCharacter['nombre']);
    $('#jugador').val(actualCharacter['jugador']);
    $('#rol').val(actualCharacter['rol']);
    $('#fecha_nacimiento').val(actualCharacter['fecha_nacimiento']);
    $('#estatura').val(actualCharacter['estatura']);
    $('#peso').val(actualCharacter['peso']);
    $('#experiencia').val(actualCharacter['experiencia']);
    // $1('#reputacion').val(actualCharacter['reputacion']);
    $('#descripcion').val(actualCharacter['descripcion']);
    $('#retrato').attr('src', actualCharacter['imagenes']['retrato']);
    $('#estado').val(actualCharacter['estado']);
    $('#creditos').val(actualCharacter['dinero']);

    //  Load attribute values of character
    $.each(actualCharacter['atributos'], function(id, value){
        $('#' + id).val(value);
    });

    //  Load abilities values of character
    let number = 0;
    $.each(actualCharacter['capacidad_especial'], function(id, ability){
        addNewRow('capacidad_especial', 'abilities', ability, 'especial', number);
        number++;
    });
    number = 0;
    $.each(actualCharacter['habilidades_principales'], function(id, ability){
        addNewRow('habilidades_principales', 'abilities', ability, 'principal', number);
        number++;
    });
    number = 0;
    $.each(actualCharacter['habilidades_secundarias'], function(id, ability){
        addNewRow('habilidades_secundarias', 'abilities', ability, 'secundaria', number);
        number++;
    });

    // Calculate some values
    let cargo = 0;

    // Load cyberware for character
    number = 0;
    $.each(actualCharacter['ciberequipo'], function(id, implante){
        addNewRow('ciberequipo', 'cyberware', implante, 'implante', number);
        cargo += parseFloat(implante.peso);
        number++;
    });

    // Load general gear for character
    number = 0;
    $.each(actualCharacter['blindaje'], function(id, armadura){
        addNewRow('blindaje', 'armor', armadura, 'armadura', number);
        cargo += parseFloat(armadura.peso);
        number++;
    });
    number = 0;
    $.each(actualCharacter['armas'], function(id, arma){
        addNewRow('armas', 'weapons', arma, 'arma', number);
        cargo += parseFloat(arma.peso);
        number++;
    });
    number = 0;
    $.each(actualCharacter['equipo'], function(id, equipo){
        addNewRow('equipo', 'gear', equipo, 'equipo', number);
        cargo += parseFloat(equipo.peso);
        number++;
    });

    // Load other gear for character
    number = 0;
    $.each(actualCharacter['otros'], function(id, otro){
        addNewRow('otros', 'other', otro, 'otro', number);
        cargo += parseFloat(arma.peso);
        number++;
    });
    
    // Calculate and show extra data
    $('#carga').val(cargo);
    let tco = parseInt(actualCharacter['atributos']['tipo_corporal']);
    $('#cargar').val(tco * 10);
    $('#levantar').val(tco * 40);
    let mov = parseInt(actualCharacter['atributos']['movimiento']);
    mov = (cargo > tco * 10 ? -mov / (tco * 30) + mov : mov);
    mov = (cargo > tco * 40 ? 0 : mov);
    mov = Math.round(mov * 100) / 100;
    $('#caminar').val(mov);
    $('#correr').val(mov * 4);
    $('#saltar').val(Math.round(mov * 3 / 4 * 100) / 100);
    let mtc = (tco > 2 ? -1 : 0);
    mtc += (tco > 4 ? -1 : 0);
    mtc += (tco > 7 ? -1 : 0);
    mtc += (tco > 9 ? -1 : 0);
    mtc += (tco > 10 ? -1 : 0);
    $('#mtc').val(mtc);
    $('#salvacion').val(tco);

    // Close character list after load data
    closeCharacterList();

    // Change status of buttons
    $('#create-button').show();
    $('#edit-button').show();
    $('#print-button').show();
    $('#delete-button').show();
}

function printCharacterSheet() {
    $('#printer-mode').html('@media print { body { display: block; } }');
    $('#header-section').css({'display': 'none'});
    $('#action-block').css({'display': 'none'});
    window.print();
    $('#action-block').css({'display': 'block'});
    $('#header-section').css({'display': 'block'});
    $('#printer-mode').html('@media print { body { display: none; } }');
}

function saveCharacterSheet() {
    let i = parseInt($('#i').val());

    // Updating local information of actual character
    actualCharacter['jugador'] = $('#jugador').val();
    actualCharacter['nombre'] = $('#nombre').val();
    actualCharacter['rol'] = $('#rol').val();
    actualCharacter['fecha_nacimiento'] = $('#fecha_nacimiento').val();
    actualCharacter['estatura'] = $('#estatura').val();
    actualCharacter['peso'] = $('#peso').val();
    actualCharacter['experiencia'] = $('#experiencia').val();
    // actualCharacter['reputacion'] = $('#reputacion').val();
    actualCharacter['descripcion'] = $('#descripcion').val();
    actualCharacter['estado'] = $('#estado').val();
    actualCharacter['creditos'] = $('#creditos').val();

    $.each(actualCharacter['atributos'], function(id, value){
        actualCharacter['atributos'][id] = $('#' + id).val();
    });

    let number = 0;
    $.each(actualCharacter['capacidad_especial'], function(id, ability){
        $.each(ability, function(key, ability_value){
            ability[key] = $('#especial_' + key +  '_' + number).val();
        });
        number++;
    });
    number = 0;
    $.each(actualCharacter['habilidades_principales'], function(id, ability){
        $.each(ability, function(key, ability_value){
            ability[key] = $('#principal_' + key +  '_' + number).val();
        });
        number++;
    });
    number = 0;
    $.each(actualCharacter['habilidades_secundarias'], function(id, ability){
        $.each(ability, function(key, ability_value){
            ability[key] = $('#secundaria_' + key +  '_' + number).val();
        });
        number++;
    });
    number = 0;
    $.each(actualCharacter['ciberequipo'], function(id, implante){
        $.each(implante, function(key, implante_value){
            implante[key] = $('#implante_' + key +  '_' + number).val();
        });
        number++;
    });
    number = 0;
    $.each(actualCharacter['armas'], function(id, arma){
        $.each(arma, function(key, arma_value){
            arma[key] = $('#arma_' + key +  '_' + number).val();
        });
        number++;
    });
    number = 0;
    $.each(actualCharacter['blindaje'], function(id, armadura){
        $.each(armadura, function(key, armadura_value){
            armadura[key] = $('#armadura_' + key +  '_' + number).val();
        });
        number++;
    });
    number = 0;
    $.each(actualCharacter['equipo'], function(id, equipo){
        $.each(equipo, function(key, equipo_value){
            equipo[key] = $('#equipo_' + key +  '_' + number).val();
        });
        number++;
    });
    number = 0;
    $.each(actualCharacter['otros'], function(id, otro){
        $.each(otros, function(key, otro_value){
            otro[key] = $('#otro_' + key +  '_' + number).val();
        });
        number++;
    });

    // Updating local character in buffered list
    actualCharacter['ultima_actualizacion'] = new Date().toLocaleString();
    characterList[i] = actualCharacter;

    // Sending update to database
    $.ajax({
        url: 'https://sa-east-1.aws.data.mongodb-api.com/app/data-krfva/endpoint/data/v1/action/updateOne',
        method: 'POST',
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
            'apikey': '4YtLjj1pn1x1xOfFhGFP6XFMboKaq3bSkQ54tVRgaBAm3omTW46nHXhQH3KvG4AL'
        },
        data: JSON.stringify({
            'dataSource': 'Cluster0',
            'database': 'cyberpunk',
            'collection': 'personajes',
            'filter': {
                '_id': actualCharacter['_id']
            },
            'update': {
                '$set': actualCharacter
            }
        }),
        success: function(response) {
            console.log(response);
        },
        error: function(obj, error) {
            console.error('Error ' + error);
        }
    }); 
}

/* Initial UI configurations */
$(document).ready(function(){
    // Sections title hide and show
    $('#general-block-title').click(function(){
        $('#general-block-content').slideToggle(300);
    });   
    $('#attributes-block-title').click(function(){
        $('#attributes-block-content').slideToggle(300);
    });
    $('#abilities-block-title').click(function(){
        $('#abilities-block').slideToggle(300);
    });
    $('#cyberware-block-title').click(function(){
        $('#cyberware-block').slideToggle(300);
    });
    $('#armor-block-title').click(function(){
        $('#armor-block').slideToggle(300);
    });
    $('#weapons-block-title').click(function(){
        $('#weapons-block').slideToggle(300);
    });
    $('#gear-block-title').click(function(){
        $('#gear-block').slideToggle(300);
    });
    $('#other-block-title').click(function(){
        $('#other-block').slideToggle(300);
    });
    $('#extra-block-title').click(function(){
        $('#extra-block-content').slideToggle(300);
    });

    // Action buttons
    $('#create-button').click(function(){
        changeEditMode(true);
        $('#create-button').hide();
        $('#edit-button').hide();
        $('#delete-button').hide();
        $('#print-button').hide();
        $('#save-button').show();
    });
    $('#edit-button').click(function(){
        changeEditMode(true);
        $('#create-button').hide();
        $('#edit-button').hide();
        $('#delete-button').hide();
        $('#print-button').hide();
        $('#save-button').show();
    });
    $('#save-button').click(function(){
        changeEditMode(false);
        saveCharacterSheet();
        $('#create-button').show();
        $('#save-button').hide();
        $('#edit-button').show();
        $('#delete-button').show();
        $('#print-button').show();
    });
    $('#delete-button').click(function(){
        let answer = confirm('Está seguro de que quiere eliminar este personaje? No podrá recuperarlo');
        if (answer) {
            location.href = '.';
        }
    });
    $('#print-button').click(function(){
        printCharacterSheet();
    });

    // Initial status of UI
    $('#edit-button').hide();
    $('#save-button').hide();
    $('#delete-button').hide();
    $('#print-button').hide();
    changeEditMode(false);
});
