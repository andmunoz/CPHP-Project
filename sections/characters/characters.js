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
const base_array = new Map([
    ['capacidad_especial', {nombre: '', valor:''}],
    ['habilidades_principales', {atributo: '', nombre: '', valor:''}],
    ['habilidades_secundarias', {atributo: '', nombre: '', valor:''}],
]);
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
    $('#sideNav').css('width', '0');
    $('#main').css('marginLeft', '0').fadeTo(1000, 1);
}

function changeEditMode(mode) {
    $('.grid-value').attr('readonly', !mode);
    if (mode) {
        $('.grid-value').css({'background-color': '#333333', 
                              'color': 'yellow'});
        $('.action-buttons').show();
    }
    else {
        $('.grid-value').css({'background-color': 'black', 
                              'color': 'yellow'});
        $('.action-buttons').show();
    }
}

/* Functions to interact with data */
function add_new_row(tipo) {
    actualCharacter();
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

    /* Hide buttons meanwhile load data */
    $('#create-button').hide();
    $('#edit-button').hide();
    $('#save-button').hide();

    /* Change to readonly mode */
    changeEditMode(false);

    /* Load general information of character */ 
    $('#nombre').val(actualCharacter['nombre']);
    $('#jugador').val(actualCharacter['jugador']);
    $('#rol').val(actualCharacter['rol']);
    $('#fecha_nacimiento').val(actualCharacter['fecha_nacimiento']);
    $('#estatura').val(actualCharacter['estatura']);
    $('#peso').val(actualCharacter['peso']);
    $('#experiencia').val(actualCharacter['experiencia']);
    // $('#reputacion').val(actualCharacter['reputacion']);
    $('#descripcion').val(actualCharacter['descripcion']);
    $('#retrato').attr('src', actualCharacter['imagenes']['retrato']);
    $('#estado').val(actualCharacter['estado']);
    $('#creditos').val(actualCharacter['dinero']);

    /* Load attribute values of character */
    $.each(actualCharacter['atributos'], function(id, value){
        $('#' + id).val(value);
    });

    /* Load abilities values of character */
    let html = '';
    let number = 0;
    $.each(actualCharacter['capacidad_especial'], function(id, ability){
        number++;
        html += '<div class="text-center"><label>Especial</label></div>';
        html += '<div><input type="text" class="grid-value" id="especial_nombre_' + number + '" value="' + ability.nombre + '"/></div>';
        html += '<div><input type="text" class="grid-value text-center" id="especial_valor_' + number + '" value="' + ability.valor + '"/></div>';
        html += '<div></div>';
    });
    number = 0;
    $.each(actualCharacter['habilidades_principales'], function(id, ability){
        number++;
        html += '<div><input type="text" class="grid-value text-center" id="habilidad_atributo_' + number + '" value="' + ability.atributo + '"/></div>';
        html += '<div><input type="text" class="grid-value" id="habilidad_nombre_' + number +  '" value="' + ability.nombre + '"/></div>';
        html += '<div><input type="text" class="grid-value text-center" id="habilidad_valor_' + number +  '" value="' + ability.valor + '"/></div>';
        html += '<div class="text-center"><label>+' + (parseInt(actualCharacter['atributos'][attributes[ability.atributo]]) + parseInt(ability.valor)) + '</label></div>';
    });
    number = 0;
    $.each(actualCharacter['habilidades_secundarias'], function(id, ability){
        number++;
        html += '<div><input type="text" class="grid-value text-center" id="habilidad_atributo_' + number + '" value="' + ability.atributo + '"/></div>';
        html += '<div><input type="text" class="grid-value" id="habilidad_nombre_' + number +  '" value="' + ability.nombre + '"/></div>';
        html += '<div><input type="text" class="grid-value text-center" id="habilidad_valor_' + number +  '" value="' + ability.valor + '"/></div>';
        html += '<div class="text-center"><label>+' + (parseInt(actualCharacter['atributos'][attributes[ability.atributo]]) + parseInt(ability.valor)) + '</label></div>';
    });
    $('#abilities-block-content').html(html);

    /* Calculate some values */
    let cargo = 0;

    /* Load cyberware for character */
    html = '';
    number = 0;
    $.each(actualCharacter['ciberequipo'], function(id, implante){
        number++;
        html += '<div><input type="text" class="grid-value" id="implante_tipo_' + number + '" value="' + implante.tipo + '"></div>';
        html += '<div><input type="text" class="grid-value" id="implante_nombre_' + number + '" value="' + implante.nombre + '"></div>';
        html += '<div><input type="text" class="grid-value" id="implante_disponibilidad_' + number + '" value="' + implante.disponibilidad + '"></div>';
        html += '<div><input type="text" class="grid-value text-center" id="implante_humanidad_' + number + '" value="' + implante.humanidad + '"></div>';
        html += '<div><input type="text" class="grid-value" id="implante_slot_' + number + '" value="' + implante.slot + '"></div>';
        html += '<div><input type="text" class="grid-value text-center" id="implante_peso_' + number + '" value="' + implante.peso + '"></div>';
        html += '<div><input type="text" class="grid-value" id="implante_descripcion_' + number + '" value="' + implante.descripcion + '"></div>';
        cargo += parseFloat(implante.peso);
    });
    $('#cyberware-block-content').html(html);

    /* Load general gear for character */
    html = '';
    number = 0;
    $.each(actualCharacter['armas'], function(id, arma){
        number++;
        html += '<div><input type="text" class="grid-value" id="arma_tipo_' + number + '" value="' + arma.tipo + '"></div>';
        html += '<div><input type="text" class="grid-value" id="arma_nombre_' + number + '" value="' + arma.nombre + '"></div>';
        html += '<div><input type="text" class="grid-value" id="arma_disponibilidad_' + number + '" value="' + arma.disponibilidad + '"></div>';
        html += '<div><input type="text" class="grid-value" id="arma_slot_' + number + '" value="' + arma.slot + '"></div>';
        html += '<div><input type="text" class="grid-value text-center" id="arma_peso_' + number + '" value="' + arma.peso + '"></div>';
        html += '<div><input type="text" class="grid-value" id="arma_descripcion_' + number + '" value="Disimulo ' + arma.disimulo + ', PA ' + arma.pa + ' (' + arma.municion + '), ' + arma.vd + '/' + arma.balas + ', ' + arma.fiabilidad + ', Alcance ' + arma.distancia + ' mts, Daño ' + arma.danno + '"></div>';
        cargo += parseFloat(arma.peso);
    });
    number = 0;
    $.each(actualCharacter['blindaje'], function(id, armadura){
        number++;
        html += '<div><input type="text" class="grid-value" id="armadura_tipo_' + number + '" value="' + armadura.categoria + '"></div>';
        html += '<div><input type="text" class="grid-value" id="armadura_nombre_' + number + '" value="' + armadura.nombre + '"></div>';
        html += '<div><input type="text" class="grid-value" id="armadura_disponibilidad_' + number + '" value="' + armadura.disponibilidad + '"></div>';
        html += '<div><input type="text" class="grid-value" id="armadura_slot_' + number + '" value="' + armadura.cobertura + '"></div>';
        html += '<div><input type="text" class="grid-value text-center" id="armadura_peso_' + number + '" value="' + armadura.peso + '"></div>';
        html += '<div><input type="text" class="grid-value" id="armadura_descripcion_' + number + '" value="' + armadura.tipo + ', CP ' + armadura.cp + ', CE ' + armadura.ce + '"></div>';
        cargo += parseFloat(armadura.peso);
    });
    number = 0;
    $.each(actualCharacter['equipo'], function(id, equipo){
        number++;
        html += '<div><input type="text" class="grid-value" id="equipo_tipo_' + number + '" value="' + equipo.categoria + '"></div>';
        html += '<div><input type="text" class="grid-value" id="equipo_nombre_' + number + '" value="' + equipo.nombre + '"></div>';
        html += '<div><input type="text" class="grid-value" id="equipo_disponibilidad_' + number + '" value="' + equipo.disponibilidad + '"></div>';
        html += '<div><input type="text" class="grid-value" id="equipo_slot_' + number + '" value="' + equipo.slot + '"></div>';
        html += '<div><input type="text" class="grid-value text-center" id="equipo_peso_' + number + '" value="' + equipo.peso + '"></div>';
        html += '<div><input type="text" class="grid-value" id="equipo_descripcion_' + number + '" value="Cantidad ' + equipo.cantidad + '"></div>';
        cargo += parseFloat(equipo.peso);
    });
    $('#gear-block-content').html(html);

    /* Load other gear for character */
    html = '';
    number = 0;
    $.each(actualCharacter['otros'], function(id, otro){
        number++;
        html += '<div><input type="text" class="grid-value" id="otro_tipo_' + number + '" value="' + otro.tipo + '"></div>';
        html += '<div><input type="text" class="grid-value" id="otro_nombre_' + number + '" value="' + otro.nombre + '"></div>';
        html += '<div><input type="text" class="grid-value" id="otro_descripcion_' + number + '" value="Disimulo ' + otro.disimulo + ', PA ' + arma.pa + ' (' + arma.municion + '), ' + arma.vd + '/' + arma.balas + ', ' + arma.fiabilidad + ', Alcance ' + arma.distancia + ' mts, Daño ' + arma.danno + '"></div>';
        cargo += parseFloat(arma.peso);
    });
    $('#other-block-content').html(html);
    
    /* Calculate and show extra data */
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

    /* Close character list after load data */
    closeCharacterList();

    /* Change status of buttons */
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

    /* Updating local information of actual character */
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
        number++;
        $.each(ability, function(key, ability_value){
            ability[key] = $('#especial_' + key +  '_' + number).val();
        });
    });
    number = 0;
    $.each(actualCharacter['habilidades_principales'], function(id, ability){
        number++;
        $.each(ability, function(key, ability_value){
            ability[key] = $('#habilidad_principal_' + key +  '_' + number).val();
        });
    });
    number = 0;
    $.each(actualCharacter['habilidades_secundarias'], function(id, ability){
        number++;
        $.each(ability, function(key, ability_value){
            ability[key] = $('#habilidad_secundaria_' + key +  '_' + number).val();
        });
    });
    number = 0;
    $.each(actualCharacter['ciberequipo'], function(id, implante){
        number++;
        $.each(implante, function(key, implante_value){
            implante[key] = $('#implante_' + key +  '_' + number).val();
        });
    });
    number = 0;
    $.each(actualCharacter['armas'], function(id, arma){
        number++;
        $.each(arma, function(key, arma_value){
            arma[key] = $('#arma_' + key +  '_' + number).val();
        });
    });
    number = 0;
    $.each(actualCharacter['blindaje'], function(id, armadura){
        number++;
        $.each(armadura, function(key, armadura_value){
            armadura[key] = $('#armadura_' + key +  '_' + number).val();
        });
    });
    number = 0;
    $.each(actualCharacter['equipo'], function(id, equipo){
        number++;
        $.each(equipo, function(key, equipo_value){
            equipo[key] = $('#equipo_' + key +  '_' + number).val();
        });
    });
    number = 0;
    $.each(actualCharacter['otros'], function(id, otro){
        number++;
        $.each(otros, function(key, otro_value){
            otro[key] = $('#otro_' + key +  '_' + number).val();
        });
    });

    /* Updating local character in buffered list */
    actualCharacter['ultima_actualizacion'] = new Date().toLocaleString();
    characterList[i] = actualCharacter;

    /* Sending update to database */
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
    $('#general-block-title').click(function(){
        $('#general-block-content').slideToggle(500);
    });   
    $('#attributes-block-title').click(function(){
        $('#attributes-block-content').slideToggle(500);
    });
    $('#abilities-block-title').click(function(){
        $('#abilities-block').slideToggle(500);
    });
    $('#cyberware-block-title').click(function(){
        $('#cyberware-block').slideToggle(500);
    });
    $('#gear-block-title').click(function(){
        $('#gear-block').slideToggle(500);
    });
    $('#other-block-title').click(function(){
        $('#other-block').slideToggle(500);
    });
    $('#extra-block-title').click(function(){
        $('#extra-block-content').slideToggle(500);
    });
    $('#create-button').click(function(){
        changeEditMode(true);
        $('#create-button').hide();
        $('#delete-button').hide();
        $('#print-button').hide();
        $('#save-button').show();
    });
    $('#edit-button').click(function(){
        changeEditMode(true);
        $('#edit-button').hide();
        $('#delete-button').hide();
        $('#print-button').hide();
        $('#save-button').show();
    });
    $('#save-button').click(function(){
        changeEditMode(false);
        saveCharacterSheet();
        $('#save-button').hide();
        $('#edit-button').show();
        $('#delete-button').show();
        $('#print-button').show();
    });
    $('#print-button').click(function(){
        printCharacterSheet();
    });

    $('#edit-button').hide()
    $('#save-button').hide()
    $('#delete-button').hide();
    $('#print-button').hide()
    changeEditMode(false);
});
