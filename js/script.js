// Create a variable and assign empty array.
// IIFE to avoid accidentally accessing the global state
var pokemonRepository = (function () {
  var pokeDex = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  //function to add pokemon data
  function add(pokemon) {
    pokeDex.push(pokemon);
  }

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  //function to pull pokemon data
  function getAll() {
    return pokeDex;
  }

  function addListItem(pokemon) {
    //if to validate object contents
    if (pokemon.name) {
      //create list and contents of list
      var pokemonList = $(".pokemon-list");
      var listItem = $("<li></li>");
      var button = $(
        "<button type='button' class='btn btn-danger button-class' data-toggle='modal' data-target='#exampleModal'>" +
          capitalize(pokemon.name) +
          "</button>"
      );

      //append children to corresponding element
      pokemonList.append(listItem);
      listItem.append(button);

      //add click listener to button
      button.on("click", function () {
        showDetails(pokemon);
      });
    }
    //if not conforming, exit forEach loop
    else {
      return;
    }
  }

  //fetch API pokemon name and URL details
  function loadList() {
    return $.ajax(apiUrl)
      .then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  //fetch API pokemon details from URLdetails found in LoadList()
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function (details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;

        if (details.types.length === 2) {
          item.type0 = details.types[1].type.name;
          item.type1 = details.types[0].type.name;
        } else {
          item.type0 = details.types[0].type.name;
        }
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //Load details items unto modal when called
  function showDetails(item) {
    loadDetails(item).then(function () {
      showModal(item);
    });
  }

  function catchAll() {
    return pokeDex;
  }

  function showModal(details) {
    // Clear all existing modal content
    var modalBody = $(".modal-body");
    var modalTitle = $(".modal-title");
    modalBody.empty();
    modalTitle.empty();

    // name
    var nameElement = $("<h1>" + capitalize(details.name) + "</h1>");
    //height
    var heightElement = $("<p>Height: " + details.height / 10 + " m</p>");
    //image
    var imageElement = $(
      "<img class='modal-image' src='" + details.imageUrl + "'>"
    );
    //types
    if (details.type0 && details.type1) {
      var typesElement = $(
        "<p>Types: " +
          capitalize(details.type0) +
          ", " +
          capitalize(details.type1) +
          "</p>"
      );
    } else {
      var typesElement = $("<p>Type: " + capitalize(details.type0) + "</p>");
    }

    //append elements to modal
    modalTitle.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(typesElement);
    modalBody.append(heightElement);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
  };
})();

//Get pokemon on buttons
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

//for search bar
$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myDiv *").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
