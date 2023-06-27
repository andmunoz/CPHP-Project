let characterList = null;
let actualCharacter = {};

function openCharacterList(){
    if (!characterList) {
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
                console.log(data);
                characterList = data.documents;
                let html = '\n';
                $.each(data.documents, function(id, obj) {
                    html += '<a href="#" onclick="fillCharacterSheet(' + id + ')">' + obj.nombre + '</a>\n';
                });
                $('#personajes').html(html);
            },
            error: function(obj, error) {
                console.error('Error ' + error);
            }
        }); 
    }
    $('#sideNav').css('width', '250px');
    $('#main').css('marginLeft', '250px').fadeTo(1000, 0.4);
}

function closeCharacterList(){
    $('#sideNav').css('width', '0');
    $('#main').css('marginLeft', '0').fadeTo(1000, 1);
}

function fillCharacterSheet(id){
    actualCharacter = characterList[id];
    console.log(actualCharacter);

    /* Load general information of character */ 
    $('#nombre').val(actualCharacter['nombre']);
    $('#jugador').val(actualCharacter['jugador']);
    $('#rol').val(actualCharacter['rol']);
    $('#fecha_nacimiento').val(actualCharacter['fecha_nacimiento']);
    $('#estatura').val(actualCharacter['estatura'] + ' mts');
    $('#peso').val(actualCharacter['peso'] + ' kgs');
    $('#experiencia').val(actualCharacter['experiencia'] + ' pp');
    $('#estado').val(actualCharacter['estado']);

    /* Load attribute values of character */
    const attributes = { 'INT': 'inteligencia', 
                         'REF': 'reflejos', 
                         'TEC': 'tecnica',
                         'FRI': 'frialdad',
                         'ATR': 'atractivo',
                         'SUE': 'suerte',
                         'MOV': 'movimiento',
                         'TCO': 'tipo_corporal', 
                         'EMP': 'empatia' };
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
        html += '<div><input type="text" class="grid-value text-center" id="especial_valor' + number + '" value="' + ability.valor + '"/></div>';
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
    $.each(actualCharacter['habilidades_secundarias'], function(id, ability){
        number++;
        html += '<div><input type="text" class="grid-value text-center" id="habilidad_atributo_' + number + '" value="' + ability.atributo + '"/></div>';
        html += '<div><input type="text" class="grid-value" id="habilidad_nombre_' + number +  '" value="' + ability.nombre + '"/></div>';
        html += '<div><input type="text" class="grid-value text-center" id="habilidad_valor_' + number +  '" value="' + ability.valor + '"/></div>';
        html += '<div class="text-center"><label>+' + (parseInt(actualCharacter['atributos'][attributes[ability.atributo]]) + parseInt(ability.valor)) + '</label></div>';
    });
    $('#abilities-block-content').html(html);

    /* Leave readonly data */
    $('.grid-value').attr('readonly', true);
}

$(document).ready(function(){
    $('#general-block-title').click(function(){
        $('#general-block-content').slideToggle(1000);
    });   
    $('#attributes-block-title').click(function(){
        $('#attributes-block-content').slideToggle(1000);
    });
    $('#abilities-block-title').click(function(){
        $('#abilities-block-content').slideToggle(1000);
    });
});
