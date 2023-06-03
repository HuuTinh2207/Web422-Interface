/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Huu Tinh Luu Student ID: 152712196 Date: 6/2/2023
*
********************************************************************************/ 


var page = 1;
const perPage = 10;

function fetchMovieData(title = null) {

    const url = title ? `https://good-teal-millipede-garb.cyclic.app/api/movies?page=1&perPage=${perPage}&title=${title}` : `https://good-teal-millipede-garb.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;
    const pagination = document.querySelector('.pagination');
    if (title) {
        pagination.classList.add('d-none');
    } else {
        pagination.classList.remove('d-none');
    }
    return fetch(url)
        .then(response => response.json())
        .catch(error => { error });

};

function fetchMovieDataByID(id) {
    const url = `https://good-teal-millipede-garb.cyclic.app/api/movies/${id}`;
    return fetch(url)
        .then(response => response.json())
        .catch(error => error);
}

function loadMovieData(title = null) {
    // DOM the tbody element
    const tbody = document.querySelector('#moviesTable tbody');

    //Generate the table rows
    fetchMovieData(title).then(data => {
        const rows = data.map(movie => {
            const hours = Math.floor(movie.runtime / 60);
            const minutes = (movie.runtime % 60).toString().padStart(2, '0');

            return `
            <tr data-id="${movie._id}">
                <td>${movie.year}</td>
                <td>${movie.title}</td>
                <td>${movie.plot || 'N/A'}</td>
                <td>${movie.rated || 'N/A'}</td>
                <td>${hours}:${minutes}</td>
            </tr>
        `;
        })
        // Add the rows to the tbody
        tbody.innerHTML = rows.join('');
        // Add event listeners to the rows
        const rowsAll = document.querySelectorAll("#moviesTable tbody tr");
        loadModalWindowData(rowsAll);
        // Update the current page
        const currentPage = document.querySelector('#current-page');
        currentPage.textContent = page;
    })
        .catch(error => console.log(error));
}

function loadModalWindowData(rows) {
    rows.forEach(row => {
        row.addEventListener('click', function () {
            // Get the movie ID
            const id = row.getAttribute('data-id');
            // Fetch the movie details
            fetchMovieDataByID(id).then(movie => {
                console.log(movie);
                // Create modal content
                const directors = movie.directors.join(', ');
                const cast = movie.cast ? movie.cast.join(', ') : 'N/A';
                const modalContent = `
        ${movie.poster ? `<img class="img-fluid w-100" alt="movie picture" src="${movie.poster}"><br><br>` : ''}
        <strong>Directed By:</strong> ${directors}<br><br>
        <p>${movie.fullplot}</p>
        <strong>Cast:</strong> ${cast}<br><br>
        <strong>Awards:</strong> ${movie.awards.text}<br>
        <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)
    `;
                // Update modal content
                const modalTitle = document.querySelector('#detailsModal .modal-title');
                const modalBody = document.querySelector('#detailsModal .modal-body');
                modalTitle.textContent = movie.title;
                modalBody.innerHTML = modalContent;

                // Display the modal
                let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                    backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
                    keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
                    focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
                });

                myModal.show();
            })
        });
    })
}

document.addEventListener('DOMContentLoaded', function () {
    // Select elements
    const prevButton = document.querySelector('#previos-page');
    const nextButton = document.querySelector('#next-page');
    const searchForm = document.querySelector('#searchForm');
    const titleField = document.querySelector('#searchForm #title');
    const clearButton = document.querySelector('#clear');

    // Add click event for "previous page" button
    prevButton.addEventListener('click', function () {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });

    // Add click event for "next page" button
    nextButton.addEventListener('click', function () {
        page++;
        loadMovieData();
    });

    // Add submit event for "searchForm" form
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        loadMovieData(titleField.value);
    });

    // Add click event for "clearForm" button
    clearButton.addEventListener('click', function () {
        titleField.value = '';
        loadMovieData();
    });

    // Load initial data
    loadMovieData();
});










