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
    $('#nombre').html(actualCharacter['nombre']);
    $('#jugador').html(actualCharacter['jugador']);
    $('#rol').html(actualCharacter['rol']);
    $('#fecha_nacimiento').html(actualCharacter['fecha_nacimiento']);
    $('#estatura').html(actualCharacter['estatura'] + ' mts');
    $('#peso').html(actualCharacter['peso'] + ' kgs');
    $('#experiencia').html(actualCharacter['experiencia'] + ' pp');
    $('#estado').html(actualCharacter['estado']);
}