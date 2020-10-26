const selectForm = () => {
  $(document).ready(function(){
    $('select').formSelect();
  });
}

document.addEventListener("DOMContentLoaded", function() {
    // Active sidebar nav
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status != 200) return;
    
            // Muat daftar tautan menu
            document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
              elm.innerHTML = xhttp.responseText;
            });
    
            // Daftarkan event listener untuk setiap tautan menu
            document
              .querySelectorAll(".sidenav a, .topnav a")
              .forEach(function(elm) {
                elm.addEventListener("click", function(event) {
                  // Tutup sidenav
                  var sidenav = document.querySelector(".sidenav");
                  M.Sidenav.getInstance(sidenav).close();
    
                  // Muat konten halaman yang dipanggil
                  page = event.target.getAttribute("href").substr(1);
                  loadPage(page);
                });
              });
          }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    let page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);

    // getRowCount()
    //     .then(row => {// Load page content
    //         let page = window.location.hash.substr(1);

    //         if (page == "") page = "home";
    //         loadPage(page);

    //         if(row < 1) {
    //             $(document).ready(function(){
    //                 $('#modal').modal({dismissible:false});
    //                 $('#modal').modal('open'); 
    //             });
    //         }
    //     })
    
    function loadPage(page) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            let content = document.querySelector("#body-content");
            let title = document.querySelector("#pageHeading");
            
            // tambahkan blok if berikut
            if (page === "home") {

              title.innerHTML = "Jadwal Pertandingan";
              getFavoritMatchTeams();

            } else if (page === "klasemen") {
                
              title.innerHTML = "Klasemen Liga";
              selectForm();

            } else if (page === "klub") {
              
              title.innerHTML = "Klub";
              selectForm();
                
            } else if (page === "favorit") {

              title.innerHTML = "Daftar Favorit";
              getFavoritTeams();

            } else if (page === "about") {

              title.innerHTML = "About";

            } else if (page === "contact") {

              title.innerHTML = "Contact";

            }

            // ---
            if (this.status == 200) {
              content.innerHTML = xhttp.responseText;
            } else if (this.status == 404) {
              content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
              content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            }
          }
        };
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();
      }
    
    
    });