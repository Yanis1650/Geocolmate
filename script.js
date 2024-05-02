var map = new maplibregl.Map({
  container: "map",
  style: 'https://api.maptiler.com/maps/positron/style.json?key=HMaxIXYX7Vba6w1sxsvC', // style par défaut
  center: [3.862038, 43.62505],
  zoom: 13,
  scrollZoom: true,
  customAttribution : '<a href="https://esigat.wordpress.com/" target="_blank">Master SIGAT</a><a href="https://www.umontpellier.fr/" target="_blank">Géocolmate</a>'
});



map.on('style.load', async function () {




    // Charger le fichier GeoJSON des bâtiments
    const response = await fetch('./DATA/test_centro_campus.geojson');
    const data = await response.json();

    // Filtrer les entités avec une géométrie valide
    const featuresWithGeometry = data.features.filter(feature => feature.geometry !== null);

    // Construire la liste des lieux
    buildLocationList(featuresWithGeometry);

    // Écouter l'événement "input" sur le champ de recherche
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", async function () {
      const query = searchInput.value;
      if (query) {
        const results = await searchBuildings(query);
        buildLocationList(results);
      } else {
        buildLocationList(featuresWithGeometry);
      }
    });

// Ajout de la source de données des bâtiments
function addBuildingData(map) {
  map.addSource('batiments', {
    type: 'geojson',
    data: './DATA/essai.geojson'
  });

  // Ajout de la couche 2D pour les bâtiments
  map.addLayer({
    id: "batiment2D",
    type: "fill",
    source: 'batiments',
    paint: {
      'fill-color': [
        'match',
        ['get', 'CAMPUS'],
        "CIHEAM IAM Montpellier\n", '#5770AC',
        "Centre Sportif Universitaire de la Motte Rouge", '#FFA500',
        "Campus Saint Priest - Université de Montpellier", '#F8384C',
        "CIRAD", '#1CA636',
        "Cité U' Boutonnet\n", '#E20512',
        "COMUE Languedoc-Roussillon Universités", '#202124',
        "ENSA montpellier", '#7F7F7E',
        "enscm montpellier", '#4F9CB9',
        "Faculté de Droit et Science politique\n", '#323483',
        "Faculté de médecine", '#323483',
        "INRAE - Centre Occitanie-Montpellier\n", '#23AEB0',
        "INSPE de l'Académie de Montpellier", '#FF8800',
        "Institut de biologie\n", '#CBB908',
        "IUT Montpellier\n", '#FF5660',
        "L'Institut Agro Montpellier\n", '#F1A600',
        "site saint charles", '#231F20',
        "UFR STAPS", '#F39338',
        "Université Montpellier\n", '#F8384C',
        "Université Paul-Valéry Montpellier 3\n", '#231F20',
        '#A01E1E'
      ],
      'fill-opacity': 0.90
    }
  });

  // Ajout de la couche 3D avec les couleurs basées sur la propriété "site_geo" de centro_bat.geojson
  map.addLayer({
    id: "batiment3D",
    type: "fill-extrusion",
    source: 'batiments',
    paint: {
      'fill-extrusion-color': [
        'match',
        ['get', 'CAMPUS'],
        "CIHEAM IAM Montpellier\n", '#5770AC',
        "Centre Sportif Universitaire de la Motte Rouge", '#FFA500',
        "Campus Saint Priest - Université de Montpellier", '#F8384C',
        "CIRAD", '#1CA636',
        "Cité U' Boutonnet\n", '#E20512',
        "COMUE Languedoc-Roussillon Universités", '#202124',
        "ENSA montpellier", '#7F7F7E',
        "enscm montpellier", '#4F9CB9',
        "Faculté de Droit et Science politique\n", '#323483',
        "Faculté de médecine", '#323483',
        "INRAE - Centre Occitanie-Montpellier\n", '#23AEB0',
        "INSPE de l'Académie de Montpellier", '#FF8800',
        "Institut de biologie\n", '#CBB908',
        "IUT Montpellier\n", '#FF5660',
        "L'Institut Agro Montpellier\n", '#F1A600',
        "site saint charles", '#231F20',
        "UFR STAPS", '#F39338',
        "Université Montpellier\n", '#F8384C',
        "Université Paul-Valéry Montpellier 3\n", '#231F20',
        '#A01E1E'
      ],
      'fill-extrusion-height': ['get', 'HAUTEUR'],
      'fill-extrusion-opacity': 0.90
    }
  });
// Ajout de la source de données des campus
map.addSource('campus', {
  type: 'geojson',
  data: './DATA/titre_campus.geojson',
  maxzoom: 15
});

// Ajout de la couche pour les noms des campus

// Ajout de la couche pour les noms des campus
map.addLayer({
  id: 'campus-labels',
  minzoom:15,
  type: 'symbol',
  source: 'campus',
  layout: {
    'text-field': ['get', 'CAMPUS'],
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-size': 14,
    'text-transform': 'uppercase',
    'text-letter-spacing': 0.1,
    'text-offset': [0, 1.25],
    'text-anchor': 'top',
    'text-max-width': 10,
    'text-line-height': 1.2,
    'visibility': 'visible'
  },
  paint: {
    'text-color': [
      'match',
      ['get', 'CAMPUS'],
      "CIHEAM IAM Montpellier\n", '#5770AC',
      "Centre Sportif Universitaire de la Motte Rouge", '#FFA500',
      "Campus Saint Priest - Université de Montpellier", '#F8384C',
      "CIRAD", '#1CA636',
      "Cité U' Boutonnet\n", '#E20512',
      "COMUE Languedoc-Roussillon Universités", '#202124',
      "ENSA montpellier", '#7F7F7E',
      "enscm montpellier", '#4F9CB9',
      "Faculté de Droit et Science politique\n", '#323483',
      "Faculté de médecine", '#323483',
      "INRAE - Centre Occitanie-Montpellier\n", '#23AEB0',
      "INSPE de l'Académie de Montpellier", '#FF8800',
      "Institut de biologie\n", '#CBB908',
      "IUT Montpellier\n", '#FF5660',
      "L'Institut Agro Montpellier\n", '#F1A600',
      "site saint charles", '#231F20',
      "UFR STAPS", '#F39338',
      "Université Montpellier\n", '#F8384C',
      "Université Paul-Valéry Montpellier 3\n", '#231F20',
      '#A01E1E' // Couleur par défaut si aucun campus ne correspond
    ],
    'text-halo-color': 'rgba(200, 200, 200, 0.8)', // Couleur gris clair quasi transparent
    'text-halo-width': 2, // Largeur de l'arrière-plan
    // 'text-color': 'rgba(0, 0, 0, 1)', // Couleur du texte
    'text-halo-blur': 1 // Flou du contour
  }
});
  // Définir une variable pour suivre l'état actuel de la vue (2D ou 3D)
  let currentView = '2D';

  // Fonction pour basculer entre les couches
  function switchLayer(layerId) {
    if (layerId === 'batiment2D') {
      map.setLayoutProperty('batiment2D', 'visibility', 'visible');
      map.setLayoutProperty('batiment3D', 'visibility', 'none');
      map.easeTo({ pitch: 50, bearing: 50, duration: 2000 });
      currentView = '2D';
    } else if (layerId === 'batiment3D') {
      map.setLayoutProperty('batiment2D', 'visibility', 'none');
      map.setLayoutProperty('batiment3D', 'visibility', 'visible');
      map.easeTo({ pitch: 45, bearing: 50, duration: 2000 });
      currentView = '3D';
    }
  }

  // Ajouter des événements clic pour basculer entre les couches
  document.getElementById('batiment2D').addEventListener('click', function () {
    if (currentView !== '2D') {
      switchLayer('batiment2D');
    }
  });

  document.getElementById('batiment3D').addEventListener('click', function () {
    if (currentView !== '3D') {
      switchLayer('batiment3D');
    }
  });


}

addBuildingData(map); // Appeler la fonction addBuildingData(map)



  // Ajout de la source de données des lignes de bus
  map.addSource('BUS_L', {
    type: 'geojson',
    data: './DATA/bus_buffer.geojson'
  });

  // Ajout de la couche 2D pour les lignes de bus
  map.addLayer({
    id: "ligne_bus",
    type: "fill",
    source: 'BUS_L',
    layout: {
      'visibility': 'visible'
    },
    paint: {
      'fill-color': [
        'match',
        ['get', 'num_commer'],
        '11', '#6DC5DC',
        '10', '#FFAB00',
        '13', '#FFD700',
        '14', '#FE8972',
        '15', '#C50002',
        '16', '#009FE3',
        '17', '#D9C100',
        '19', '#FFCB00',
        '18', '#F8432C',
        '20', '#008CE0',
        '21', '#FFE200',
        '22', '#59C7F1',
        '23', '#FF7C00',
        '24', '#A1006C',
        '25', '#883900',
        '26', '#0A576E',
        '27', '#004D40',
        '28', '#5C3E9F',
        '30', '#FD9FC6',
        '31', '#BA68C8',
        '32', '#00716E',
        '33', '#BACD00',
        '34', '#548B3A',
        '35', '#FFEBEE',
        '36', '#F20000',
        '38', '#88003C',
        '40', '#FFD700',
        '41', '#51B035',
        '42', '#FBBC43',
        '43', '#B71C1C',
        '44', '#EA5198',
        '46', '#7A1C79',
        '52', '#FFC107',
        '51', '#FFA000',
        '53', '#FFD54F',
        '6', '#F6007C',
        '7', '#9D5CA1',
        '8', '#FFD700',
        '9', '#00952B',
        '96', '#FF9800',
        'La Navette', '#FF5722',
        'Navette Gare', '#FF4081',
        '#000'
      ],
      'fill-opacity': 0.50
    }
  });

  // Ajout de la source de données des lignes de tram
  map.addSource('TRAM_L', {
    type: 'geojson',
    data: './DATA/tram_buffer.geojson'
  });

  // Ajout de la couche 2D pour les lignes de tram
  map.addLayer({
    id: "ligne_tram",
    type: "fill",
    source: 'TRAM_L',
    layout: {
      'visibility': 'visible'
    },
    paint: {
      'fill-color': [
        'match',
        ['get', 'num_exploi'],
        1.0,"#005AA1",
        2.0,"#EE7F00",
        3.0,"#CBD300",
        4.0,"#4A2A15",
        '#000'
      ],
      'fill-opacity': 0.80
    }
  });

  // Ajout de la source de données des lignes de velo
  map.addSource('OSM_VELO', {
    type: 'geojson',
    data: './DATA/OSM_VELO_BUFFER.geojson'
  });

  // Ajout de la couche 2D pour les lignes de velo
  map.addLayer({
    id: "ligne_veloOSM",
    type: "fill",
    source: 'OSM_VELO',
    layout: {
      'visibility': 'visible'
    },
    paint: {
      'fill-color': "#5FCD13",
      'fill-opacity':
0.90
}
});

// Ajout de la source de données des points/arrets de bus
map.addSource('ARRET_BUS', {
type: 'geojson',
data: './DATA/ARRET_BUS.geojson'
});
map.loadImage('./DATA/Icons/bus-station.png', (error, image) => {
if (error) throw error;
map.addImage('bus-icon', image);
});

// Ajout de la couche 2D pour les points/arrets de bus
map.addLayer({
id: "points_bus",
type: "symbol", // Changé de "fill" à "line"
source: 'ARRET_BUS',
layout: {
  'visibility': 'visible',
  'icon-image': 'bus-icon',
'icon-size': 0.6
}
});

// Ajout de la source de données des points/arrets de tram
map.addSource('ARRET_TRAM', {
type: 'geojson',
data: './DATA/ARRET_TRAM.geojson'
});
map.loadImage('./DATA/Icons/transport_2.png', (error, image) => {
if (error) throw error;
map.addImage('tram-icon', image);
});

// Ajout de la couche 2D pour les points/arrets de tram
map.addLayer({
id: 'points_tram',
type: 'symbol',
source: 'ARRET_TRAM',
layout: {
  'visibility': 'visible',
  'icon-image': 'tram-icon',
'icon-size': 0.5
}
});

// Récupère les icônes et les couches de la carte
var busIcon = document.getElementById('bus-toggle');
var tramIcon = document.getElementById('tram-toggle');
var veloIcon = document.getElementById('velos-toggle');
var busLayer = map.getLayer('ligne_bus');
var tramLayer = map.getLayer('ligne_tram');
var veloLayer = map.getLayer('ligne_veloOSM');
var busPointLayer = map.getLayer('points_bus'); // ajoute la couche points_bus
var tramPointLayer = map.getLayer('points_tram'); // ajoute la couche points_tram

// Ajoute un écouteur d'événements pour l'icône Bus
busIcon.addEventListener('click', function() {
  busIcon.classList.toggle('active');
  busLayer.setLayoutProperty('visibility', busLayer.getLayoutProperty('visibility') === 'visible' ? 'none' : 'visible');
  busPointLayer.setLayoutProperty('visibility', busPointLayer.getLayoutProperty('visibility') === 'visible' ? 'none' : 'visible');
  map.fire('data'); // Déclenche un événement de données sur la carte'none' : 'visible'
});

// Ajoute un écouteur d'événements pour l'icône Tram
tramIcon.addEventListener('click', function() {
  tramIcon.classList.toggle('active');
  tramLayer.setLayoutProperty('visibility', tramLayer.getLayoutProperty('visibility') === 'visible' ? 'none' : 'visible');
  tramPointLayer.setLayoutProperty('visibility', tramPointLayer.getLayoutProperty('visibility') === 'visible' ? 'none' : 'visible');
  map.fire('data'); // Déclenche un événement de données sur la carte
});

// Ajoute un écouteur d'événements pour l'icône Vélos
veloIcon.addEventListener('click', function() {
  veloIcon.classList.toggle('active');
  veloLayer.setLayoutProperty('visibility', veloLayer.getLayoutProperty('visibility') === 'visible' ? 'none' : 'visible');
  map.fire('data'); // Déclenche un événement de données sur la carte
});







////////// FIN MAP.ON //////////////

});


/////////////



  // Interaction pour l'icône 2D/3D
  $('#state').text('3D');

  $('#state').click(function () {
    if ($('#state').text() == '3D') {
      $('#state').text('2D');
      map.setPaintProperty(
        'batiment3D',
        'fill-extrusion-height',
        ['get', 'h_faitage']
      );
      map.setMaxPitch(50);
      map.easeTo({ bearing: 30, pitch: 50 });
    } else {
      $('#state').text('3D');
      map.setPaintProperty('batiment3D', 'fill-extrusion-height', 0);
      map.easeTo({ bearing: 0, pitch: 0 });
      map.setMaxPitch(0);
    }
  });

  // Écouter l'événement "click" sur le bouton de recherche
  document.getElementById('search-button').addEventListener('click', function () {
    const searchQuery = document.getElementById('search-input').value;
    searchBuilding(searchQuery);
  });

  // Écouter l'événement "keydown" dans le champ de recherche
  document.getElementById('search-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const searchQuery = document.getElementById('search-input').value;
      searchBuilding(searchQuery);
    }
  });

  // Ajout Echelle cartographique
  var scaleControl = new maplibregl.ScaleControl({
    maxWidth: 120,
    unit: 'metric'
  });
  map.addControl(scaleControl);

  // Resize au changement d'orientation
  $(window).on('orientationchange', function () {
    document.body.style.display = 'none';
    document.body.offsetHeight;
    document.body.style.display = 'block';
  });

  async function searchBuildings(query) {
    const response = await fetch('./DATA/test_centro_campus.geojson');
    const data = await response.json();

    return data.features.filter(feature =>
      feature.properties.libelle_bat.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Ajouter le contrôle de géolocalisation à la carte avec la classe CSS geolocate-btn
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      container: document.querySelector('.geolocate-btn')
    })
  );
// Ajouter le reste du code de la fonction d'initialisation de la carte ici
// Gestion des fonds de carte
var layerList = document.getElementById("menu");
var inputs = layerList.getElementsByTagName("input");

function switchLayer(layer) {
  var layerId = layer.target.id;
  map.setStyle(layerId);
};

for (var i = 0; i < inputs.length; i++) {
  inputs[i].onclick = switchLayer;
};













////////////////// EFFET SURVOL LIGNES ////////////////////
// Ajoute un écouteur d'événements pour l'événement "mousemove" sur la carte
map.on("mousemove", function(e) {
  // Vérifie si le pointeur de la souris est sur une couche de ligne de bus ou de tram
  var features = map.queryRenderedFeatures(e.point, {
    layers: ["ligne_bus", "ligne_tram"]
  });

  // Si le pointeur de la souris est sur une couche de ligne de bus ou de tram
  if (features.length > 0) {
    // Récupère le nom de la ligne à partir des propriétés de la couche
    var nom_ligne = features[0].properties.nom_ligne;

    // Met à jour le contenu de la popup avec le nom de la ligne
    document.querySelector(".popup-content").innerHTML = nom_ligne;

    // Affiche la popup
    document.querySelector(".popup").style.display = "block";

    // Positionne la popup à côté du pointeur de la souris
    document.querySelector(".popup").style.left = e.originalEvent.pageX + 10 + "px";
    document.querySelector(".popup").style.top = e.originalEvent.pageY - 10 + "px";
  } else {
    // Masque la popup
    document.querySelector(".popup").style.display = "none";
  }
});











///////////////////////// LISTE COULEUR CAMPUS /////////////////////////
// Objet contenant les couleurs associées à chaque campus
const campusColors = {
  "CIHEAM IAM Montpellier": '#5770AC',
  "Centre Sportif Universitaire de la Motte Rouge": '#FFA500',
  "Campus Saint Priest - Université de Montpellier": '#F8384C',
  "CIRAD": '#1CA636',
  "Cité U' Boutonnet": '#E20512',
  "COMUE Languedoc-Roussillon Universités": '#202124',
  "ENSA montpellier": '#7F7F7E',
  "enscm montpellier": '#4F9CB9',
  "Faculté de Droit et Science politique": '#323483',
  "Faculté de médecine": '#323483',
  "INRAE - Centre Occitanie-Montpellier": '#23AEB0',
  "INSPE de l'Académie de Montpellier": '#FF8800',
  "Institut de biologie": '#CBB908',
  "IUT Montpellier": '#FF5660',
  "L'Institut Agro Montpellier": '#F1A600',
  "site saint charles": '#231F20',
  "UFR STAPS": '#F39338',
  "Université Montpellier": '#F8384C',
  "Université Paul-Valéry Montpellier 3": '#231F20',
  "#A01E1E": '#A01E1E' // Couleur par défaut si aucun campus ne correspond
};
const campusImages = {
  "BATIMENT A - BATIMENT HISTORIQUE - MEDECINE": "./DATA/images_batiments/facultedemedecinerotmontpellier.jpg",
  "BATIMENT 05 TRIOLET AMPHITHEATRES 1 à 6": "DATA/images_batiments/BATIMENT 05 TRIOLET AMPHITHEATRES 1 à 6.png",
  "BATIMENT I IUT MONTPELLIER SETE - ELECTRONIQUE": "DATA/images_batiments/BATIMENT I IUT MONTPELLIER SETE - ELECTRONIQUE.jpg",
  "BATIMENT S - RAMON LULL": "DATA/images_batiments/BATIMENT S - RAMON LULL.jpg",
  "BATIMENT M - MUSEE DES MOULAGES": "DATA/images_batiments/montpellier_musee_des_moulages_upvm.jpg",
  "BATIMENT SAINT-CHARLES 2": "DATA/images_batiments/saint_charle_bat2.png",
  // Ajoutez d'autres entrées pour les autres campus
};

/////////////////////// CONSTRUCTION DE LA LISTE DES BÂTIMENTS /////////////////////////



function buildLocationList(data) {
  // Récupérer l'élément HTML 'listings'
  const listings = document.getElementById("listings");
  // Vider le contenu de 'listings'
  listings.innerHTML = "";

  // Parcourir chaque élément 'feature' dans les données 'data'
  for (const feature of data) {
    // Créer un nouvel élément HTML 'div' pour chaque bâtiment
    const listing = document.createElement("div");
    listing.id = `listing-${feature.properties.id}`; // Définir l'id de l'élément 'div'
    listing.className = "item"; // Définir la classe de l'élément 'div'

    // Créer un nouvel élément HTML 'a' pour le lien
    const link = document.createElement("a");
    link.href = "#"; // Définir le 'href' du lien
    link.className = "title"; // Définir la classe du lien
    link.id = `link-${feature.properties.id}`; // Définir l'id du lien
    link.textContent = `${feature.properties.libelle_bat}`; // Définir le texte du lien

    // Appliquer la couleur en fonction du campus
    const campusColor = campusColors[feature.properties.CAMPUS] || campusColors['#A01E1E'];
    link.style.color = campusColor;

    // Créer un nouvel élément HTML 'div' pour les détails
    const details = document.createElement("div");

    // Vérifier si feature.properties.CAMPUS existe avant de définir details.textContent
    const campusName = feature.properties.CAMPUS ? feature.properties.CAMPUS : 'Campus inconnu';
    details.textContent = `${campusName}`; // Définir le texte des détails

    // Ajouter un écouteur d'événements 'click' sur le lien
    link.addEventListener("click", function () {
      flyToStore(feature); // Appeler la fonction 'flyToStore' avec 'feature' comme argument lors du clic
      createBuildingPopUp(feature); // Mettre à jour le nom de la fonction ici
    
      // Récupérer l'élément actif actuel
      const activeItem = document.getElementsByClassName("active");
      // Si un élément actif existe, supprimer la classe 'active'
      if (activeItem[0]) {
        activeItem[0].classList.remove("active");
      }
      // Ajouter la classe 'active' à l'élément parent du lien cliqué
      this.parentNode.classList.add("active");

    });

    // Ajouter le lien et les détails à l'élément 'div' du bâtiment
    listing.appendChild(link);
    listing.appendChild(details);
    // Ajouter l'élément 'div' du bâtiment à 'listings'
    listings.appendChild(listing);
  }
}

/////////////////// MENU DEROULANT ////////////////////////////////

// const sidebar = document.querySelector('.sidebar');
// const toggleSidebar = document.getElementById('toggleSidebar');
// const map = document.querySelector('.map');

// toggleSidebar.addEventListener('click', () => {
//   sidebar.classList.toggle('collapsed');
//   map.classList.toggle('collapsed');
// });


///////////////////////// CENTRAGE DE LA CARTE SUR UN BÂTIMENT /////////////////////////
/**
 * Centre la carte sur le bâtiment sélectionné.
 * @param {Object} currentFeature - Le bâtiment sélectionné.
 */
function flyToStore(currentFeature) {
  const lon = currentFeature.geometry.coordinates[0];
  const lat = currentFeature.geometry.coordinates[1];
  map.flyTo({
    center: [lon, lat],
    zoom: 18
  });
}

///////////////////////// CRÉATION DE LA POP-UP D'UN BÂTIMENT /////////////////////////
/**
 * Crée une pop-up pour le bâtiment sélectionné.
 * @param {Object} currentFeature - Le bâtiment sélectionné.
 */
function createBuildingPopUp(currentFeature) {
  console.log("createBuildingPopUp appelée");
  console.log(currentFeature);
  const lon = currentFeature.geometry.coordinates[0];
  const lat = currentFeature.geometry.coordinates[1];
  console.log("Longitude :", lon);
  console.log("Latitude :", lat);

  // Supprimer les pop-ups existantes
  const popUps = document.getElementsByClassName("maplibregl-popup");
  if (popUps[0]) popUps[0].remove();

  // Créer une nouvelle pop-up avec la couleur du texte en fonction du campus
  const campusColor = campusColors[currentFeature.properties.CAMPUS] || campusColors['#A01E1E'];

  // Récupérer le chemin vers l'image du bâtiment à partir de l'objet campusImages
  const imagePath = campusImages[currentFeature.properties.libelle_bat] || '';

  // Ajouter l'image et les informations du bâtiment à la pop-up
  const popupContent = `<h3 style="color: ${campusColor}">${currentFeature.properties.libelle_bat}</h3><h5><hr>Campus : ${currentFeature.properties.CAMPUS}</h5>${imagePath ? `<img src="${imagePath}" alt="${currentFeature.properties.libelle_bat}" width="200">` : ''}`;

  const popup = new maplibregl.Popup({ className: "building-popupstyle2", closeOnClick: true, closeButton: false })
    .setLngLat([lon, lat])
    .setHTML(popupContent)
    .addTo(map);
  popup.getElement().classList.add('show');
}

/////////////////// EVENEMENT CLICK SUR ARRETS //////////////////////
//Interactivité CLICK

// Fonction pour créer un popup pour les arrêts de transport en commun
function createStopPopup(feature) {
  var popup = new maplibregl.Popup({ className: "popupstyle", offset: [0, -15], closeButton: false})
      .setLngLat(feature.geometry.coordinates)
      .setHTML('<h5>' + feature.properties.descriptio + '</h5><hr>'
      + "Desservie par le : " + feature.properties.lignes_pas)
      .addTo(map);
      popup.getElement().classList.add('show'); // Ajouter la classe 'show' pour afficher la popup
  return popup;
}

// Fonction pour gérer le clic sur les arrêts de tram
function handleTramClick(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['points_tram'], source: 'ARRET_TRAM' });
  if (!features.length) {
      return;
  }
  var feature = features[0];
  createStopPopup(feature);
}

// Fonction pour gérer le survol des arrêts de tram
function handleTramMousemove(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['points_tram'], source: 'ARRET_TRAM' });
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
}

// Fonction pour gérer le clic sur les arrêts de bus
function handleBusClick(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['points_bus'], source: 'ARRET_BUS' });
  if (!features.length) {
      return;
  }
  var feature = features[0];
  createStopPopup(feature);
}

// Fonction pour gérer le survol des arrêts de bus
function handleBusMousemove(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['points_bus'], source: 'ARRET_BUS' });
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
}

// Ajout des gestionnaires d'événements pour les arrêts de tram
map.on('click', 'points_tram', handleTramClick);
map.on('mousemove', 'points_tram', handleTramMousemove);

// Ajout des gestionnaires d'événements pour les arrêts de bus
map.on('click', 'points_bus', handleBusClick);
map.on('mousemove', 'points_bus', handleBusMousemove);





//   // Add zoom and rotation controls to the map.
map.addControl(new maplibregl.NavigationControl());
var nav = new maplibregl.NavigationControl({showZoom:false});



////////////////////  Bouton de géolocalisation  //////////////////////////

// Configuration onglets géographiques
const buttons = document.querySelectorAll('#ongletsgeo button');
document.getElementById('Depart').addEventListener('click', function () {
  map.flyTo({
    zoom: 15,
    center: [3.866412, 43.626402],
    pitch: 15,
    bearing: 0
  });
});

// Boucle sur chaque bouton
buttons.forEach(button => {
  // Récupération du nom du campus à partir de l'attribut data-campus
  const campusName = button.dataset.campus;

  // Récupération de la couleur correspondante à partir de l'objet campusColors
  const campusColor = campusColors[campusName] || '#A01E1E'; // Couleur par défaut si aucun campus ne correspond

  // Application de la couleur au bouton
  button.style.backgroundColor = campusColor;
  button.style.color = '#fff'; // Couleur du texte en blanc

  // Ajout de l'événement click au bouton
  button.addEventListener('click', function() {
    // Supprime la classe 'clicked' de tous les boutons
    buttons.forEach(btn => {
      btn.classList.remove('clicked');
    });

    // Ajoute la classe 'clicked' au bouton cliqué
    button.classList.add('clicked');

    switch (campusName) {
      case 'Université Paul-Valéry Montpellier 3':
        map.flyTo({zoom: 16, center: [3.867883, 43.632998], pitch: 20, bearing: 0 });
        break;
      case 'Université Montpellier':
        map.flyTo({zoom: 16, center: [3.861484, 43.63173], pitch: 20, bearing: 0 });
        break;
      case 'UFR STAPS':
        map.flyTo({zoom: 16, center: [3.853073, 43.640066], pitch: 20, bearing: 0});
        break;
      case 'Faculté de Droit et Science politique':
        map.flyTo({zoom: 16, center: [3.877209, 43.613932], pitch: 20, bearing: 0});
        break;
      case 'Faculté de médecine':
        map.flyTo({zoom: 16, center: [3.848846, 43.634039], pitch: 20, bearing: 0});
        break;
      case 'Campus Saint Priest - Université de Montpellier':
        map.flyTo({zoom: 16, center: [3.841485, 43.636244], pitch: 20, bearing: 0});
        break;
      case 'IUT Montpellier':
        map.flyTo({zoom: 16, center: [3.850968, 43.635128], pitch: 20, bearing: 0});
        break;
      case "L'Institut Agro Montpellier":
        map.flyTo({zoom: 16, center: [3.855011, 43.617428], pitch: 20, bearing: 0});
        break;
    }
  });
});
// // Ajouter le reste du code de la fonction d'initialisation de la carte ici
// // Gestion des fonds de carte
// var layerList = document.getElementById("menu");
// var inputs = layerList.getElementsByTagName("input");

// function switchLayer(layer) {
//   var layerId = layer.target.id;
//   map.setStyle(layerId);
// };

// for (var i = 0; i < inputs.length; i++) {
//   inputs[i].onclick = switchLayer;
// };

  // document.getElementById('CIHEAM').addEventListener('click', function ()
  // { map.flyTo({zoom: 16,
  //            center: [3.863994, 43.647819],
  //          pitch: 20,
  //             bearing: 0});
  // });
  // document.getElementById('CIRAD').addEventListener('click', function ()
  // { map.flyTo({zoom: 16,
  //            center: [3.869038, 43.649983],
  //          pitch: 20,
  //             bearing: 0});
  // });
   // document.getElementById('INRAE').addEventListener('click', function ()
  // { map.flyTo({zoom: 16,
  //            center: [3.856480, 43.618382],
  //          pitch: 20,
  //             bearing: 0});
  // });