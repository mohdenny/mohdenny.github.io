const base_url = "https://api.football-data.org/v2/";
const klasemen_url = `${base_url}competitions/`;
const team_url = `${base_url}teams/`;
const match_url = `matches?status=SCHEDULED`;

const fetchAPI = (url) => {
    return fetch(url, {
        method: "GET",
        headers: {
        "X-Auth-Token": "c79e449cf918476dbe24f107541f54ec"
        }
    });
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

function getStandings(id_liga) {

    const render = (data) => {
        // Objek/array JavaScript dari response.json() masuk lewat data.
        console.log(data);
        console.log("Berhasil render");

        standings = data.standings["0"].table; 
        competition = data.competition; 
        let standingsHTML = "";

        document.getElementById("preloader").classList.add("active");

        setTimeout(() => {
            standings.forEach(function(standing) {
                const {position, team, playedGames, won, draw, lost, goalDifference, points} = standing
    
                standingsHTML += `
                        <tr>
                            <td>${position}</td>
                            <td width='10%'>
                                <img class='responsive-img' src='${team.crestUrl}' alt='${team.name}'/>
                            </td>
                            <td>
                                <span>${team.name}</span>
                            </td>
                            <td>${playedGames}</td>
                            <td>${won}</td>
                            <td>${draw}</td>
                            <td>${lost}</td>
                            <td>${goalDifference}</td>
                            <td><strong>${points}</strong></td>
                        </tr>
                    `;
            })

            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("preloader").classList.remove("active");
            document.getElementById("standings").innerHTML = standingsHTML;
        }, 3000);

    }
    
    // API dari cache lokal
    if('caches' in window){
        caches.match(`${klasemen_url}${id_liga}/standings`)
            .then(response => {
                if (response) {
                    response.json()
                        .then(data => {

                            render(data);
                            
                        });
                }
            })
    }

    // API dari url
    fetchAPI(`${klasemen_url}${id_liga}/standings`)
        .then(status)
        .then(json)
        .then(data => {
            // Menyusun komponen card artikel secara dinamis

            render(data)
            
        });

    let element = document.getElementById("tableStandings");
    element.classList.remove("hide");

    console.log("data dipilih");
}

function getTeams(id_liga) {

    const render = (data) => {
        // Objek/array JavaScript dari response.json() masuk lewat data.
        console.log(data);
        console.log("Berhasil render");
        // Menyusun komponen card artikel secara dinamis

        teams = data.standings["0"].table; 
        let teamsHTML = "";

        document.getElementById("preloader").classList.add("active");
        
        setTimeout(() => {
            teams.forEach(function(teams) {
                const {id, name, crestUrl} = teams.team;

                teamsHTML += `
                        <div class="col s12 m6 l6">
                            <div class="card border-radius .card-team">
                                <div class="section">
                                    <div class="card-image">
                                        <a href="./team.html?id=${id}">
                                            <figure>
                                                <img class="responsive-img" id="logo-team" src='${crestUrl}' alt='${name}' />
                                            </figure>
                                        </a>
                                    </div>
                                    <div class="card-content center-align">
                                        <p><strong>${name}</strong></p>
                                    </div>
                                </div>
                            </div>     
                        </div>
                    `;
            })

            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("preloader").classList.remove("active");
            document.getElementById("teams").innerHTML = teamsHTML;
        }, 3000);
    }

    // API dari cache lokal
    if('caches' in window){
        caches.match(`${klasemen_url}${id_liga}/standings`)
            .then(response => {
                if (response) {
                    response.json()
                        .then(data => {
                            
                            render(data);

                        });
                }
            })
    }

    // API dari url
    fetchAPI(`${klasemen_url}${id_liga}/standings`)
        .then(status)
        .then(json)
        .then(data => {
            
            render(data);
            
        });
}

function getFavoritDetailMatchTeams() {

        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        const render = (data) => {

            console.log(data)
            console.log("Berhasil render");

            teams = data.matches;
            let teamsHTML = "";

            document.getElementById("preloader").classList.add("active");
        
            setTimeout(() => {
                teams.forEach(function (team) {  
                    const {competition, awayTeam, score, homeTeam, utcDate} = team;
            
                    teamsHTML += `
                            <div class="card-panel border-radius">
                                <div class="card-title center-align">
                                    ${competition["name"]}
                                </div>
                                <div class="card-content center-align">
                                    <span class="flow-text"><strong>${awayTeam["name"]}</strong></span>
                                    <span class="flow-text"> ${(score["fullTime"]["awayTeam"] == null) ? "": score["fullTime"]["awayTeam"]}</span>
                                </div>
                                <div class="card-content center-align">
                                    <span class="flow-text">VS</span>
                                </div>
                                <div class="card-content center-align">
                                    <span class="flow-text"><strong>${homeTeam["name"]}</strong></span>
                                    <span class="flow-text"> ${(score["fullTime"]["homeTeam"] == null) ? "": score["fullTime"]["homeTeam"]}</span>
                                </div>
                                <div class="card-title center-align">
                                    ${
                                        new Date(utcDate)
                                    }
                                </div>
                            </div>
                            `;
                });
                // Sisipkan komponen card ke dalam elemen dengan id #content
                document.getElementById("preloader").classList.remove("active");
                document.getElementById("body-content").innerHTML = teamsHTML;
            }, 3000);
        }

        // API dari cache lokal
        if('caches' in window){
            caches.match(`${base_url}teams/${idParam}/${match_url}`)
                .then(response => {
                    if (response) {
                        response.json()
                            .then(data => {
                                
                                render(data);
                            
                            })
                    }
                })
        }

        // API dari url
        fetchAPI(`${base_url}teams/${idParam}/${match_url}`)
            .then(status)
            .then(json)
            .then(data => {
                
                render(data);
            
            })
}

function getTeamById() {
    // Ambil nilai query parameter (?id=)
    return new Promise(function (resolve, reject) {
  
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        const render = (data) => {

            console.log(data);
            console.log("Berhasil render");

            // Menyusun komponen card secara dinamis
            const   {crestUrl, name, activeCompetitions, shortName, address,
                        phone, website, email, founded, clubColors, venue, squad} = data;

            let teamHTML = `
                <div class="card-panel border-radius">
                    <div class="card-image waves-effect waves-block waves-light center-align">
                        <figure>
                            <img class="responsive-img" src="${crestUrl}" />
                            <figcaption><span class="card-title">${name}</span></figcaption>
                            <figcaption><span class="flow-text">${activeCompetitions["0"].name}</span></figcaption>
                            <figcaption><span class="flow-text">${activeCompetitions["0"].area.name}</span></figcaption>
                        </figure>
                    </div>
                </div>

                <ul class="tabs">
                    <li class="tab col s12 m6 l6"><a href="#info">Info</a></li>
                    <li class="tab col s12 m6 l6"><a href="#players">Players</a></li>
                </ul>

                <div id="info" class="col s12">
                    <ul>
                        <li class="flow-text">Shortname : <strong>${shortName}</strong></li>
                        <li class="flow-text">Address : <strong>${address}</strong></li>
                        <li class="flow-text">Phone : <strong>${phone}</strong></li>
                        <li class="flow-text">Website : <a href="${website}"><strong>${website}</strong></a></li>
                        <li class="flow-text">Email : <strong>${email}</strong></li>
                        <li class="flow-text">Founded : <strong>${founded}</strong></li>
                        <li class="flow-text">Club Colors : <strong>${clubColors}</strong></li>
                        <li class="flow-text">Venue : <strong>${venue}</strong></li>
                    </ul>
                </div>

                <div id="players" class="col s12">
                    <ul class='collection'>
                        ${squad.map(function (players) {
                            return "<li class='collection-item'>" + players.name  +"<span class='new badge blue'>" + players.position + "</span></li>";         
                        }).join("")}
                    </ul>
                </div>
            `;

            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = teamHTML;
            resolve(data);

            $(document).ready(function(){
                $('.tabs').tabs();
            });
        }

        // API dari cache lokal
        if('caches' in window){
            caches.match(team_url + idParam)
                .then(response => {
                    if (response) {
                        response.json()
                            .then(data => {
                                
                                render(data);

                            });
                    }
                })
        }

        fetchAPI(team_url + idParam)
            .then(status)
            .then(json)
            .then(function (data) {
            
                render(data);

        });
    });
}

function getFavoritTeamById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
  
    getById(parseInt(idParam)).then(function (team) {
        console.log(team);

        let teamHTML = '';
        const {crestUrl, name, activeCompetitions, shortName, address, phone, website,
                email, founded, clubColors, venue, squad} = team;

            teamHTML = `
                <div class="card-panel border-radius">
                    <div class="card-image waves-effect waves-block waves-light center-align">
                        <figure>
                            <img class="responsive-img" src="${crestUrl}" />
                            <figcaption><span class="card-title">${name}</span></figcaption>
                            <figcaption><span class="flow-text">${activeCompetitions["0"].name}</span></figcaption>
                            <figcaption><span class="flow-text">${activeCompetitions["0"].area.name}</span></figcaption>
                        </figure>
                    </div>
                </div>

                <ul class="tabs">
                    <li class="tab col s12 m6 l6"><a href="#info">Info</a></li>
                    <li class="tab col s12 m6 l6"><a href="#players">Players</a></li>
                </ul>

                <div id="info" class="col s12">
                    <ul>
                        <li class="flow-text">Shortname : <strong>${shortName}</strong></li>
                        <li class="flow-text">Address : <strong>${address}</strong></li>
                        <li class="flow-text">Phone : <strong>${phone}</strong></li>
                        <li class="flow-text">Website : <a href="${website}"><strong>${website}</strong></a></li>
                        <li class="flow-text">Email : <strong>${email}</strong></li>
                        <li class="flow-text">Founded : <strong>${founded}</strong></li>
                        <li class="flow-text">Club Colors : <strong>${clubColors}</strong></li>
                        <li class="flow-text">Venue : <strong>${venue}</strong></li>
                    </ul>
                </div>

                <div id="players" class="col s12">
                    <ul class='collection'>
                        ${squad.map(function (players) {
                            return "<li class='collection-item'>" + players.name  +"<span class='new badge blue'>" + players.position + "</span></li>";         
                        }).join("")}
                    </ul>
                </div>
                `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = teamHTML;
        $(document).ready(function(){
            $('.tabs').tabs();
        });
    });
}

function getFavoritTeams() {
    getAll().then(function (teams) {
        console.log(teams);
        // Menyusun komponen card artikel secara dinamis
        let teamsHTML = "";

        if (teams == "") {
            teamsHTML += `
                    <div class="card-panel center-align">
                        <span class="flow-text">
                            Belum ada Team difavorit.
                        </span>
                    </div>
                    `;
        } else {
            teams.forEach(function (teams) {
                const {id, name, crestUrl} = teams;   
        
                teamsHTML += `
                        <div class="card border-radius .card-team">
                            <div class="section">
                                <div class="card-image">
                                    <a href="./team.html?id=${id}&favorit=true">
                                        <figure>
                                            <img class="responsive-img" id="logo-team" src='${crestUrl}' alt='${name}' />
                                        </figure>
                                    </a>
                                </div>
                                <div class="card-content center-align">
                                    <p><strong>${name}</strong></p>
                                </div>
                            </div>
                        </div> 
                        `;
            });
        }
        // Sisipkan komponen card ke dalam elemen dengan id #body-content
        document.getElementById("body-content").innerHTML = teamsHTML;
    });
}

function getFavoritMatchTeams() {
    getAll().then(function (teams) {
        console.log(teams);
        // Menyusun komponen card artikel secara dinamis
        let teamsHTML = "";

        if (teams == "") {
            teamsHTML += `
                    <div class="card-panel center-align">
                        <span class="flow-text">
                            Belum ada Team difavorit.
                        </span>
                    </div>
                    `;
        } else {
            teams.forEach(function (teams) {
                const {id, name, crestUrl} = teams;   
        
                teamsHTML += `
                        <div class="card border-radius .card-team">
                            <div class="section">
                                <div class="card-image">
                                    <a href="./schedule.html?id=${id}">
                                        <figure>
                                            <img class="responsive-img" id="logo-team" src='${crestUrl}' alt='${name}' />
                                        </figure>
                                    </a>
                                </div>
                                <div class="card-content center-align">
                                    <p><strong>${name}</strong></p>
                                </div>
                            </div>
                        </div> 
                        `;
            });
        }
        // Sisipkan komponen card ke dalam elemen dengan id #body-content
        document.getElementById("body-content").innerHTML = teamsHTML;
    });
}
