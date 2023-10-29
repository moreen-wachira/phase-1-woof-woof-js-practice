document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let filterOn = false;
    let allDogs = [];

    // Fetch dog data from the server
    function fetchDogs() {
        fetch('http://localhost:3000/pups')
            .then(response => response.json())
            .then(data => {
                allDogs = data;
                displayDogs(filterOn);
            });
    }

    // Display dog names in the dog bar
    function displayDogs(filter) {
        dogBar.innerHTML = '';
        const dogsToDisplay = filter ? allDogs.filter(dog => dog.isGoodDog) : allDogs;
        dogsToDisplay.forEach(dog => {
            const dogSpan = document.createElement('span');
            dogSpan.textContent = dog.name;
            dogSpan.addEventListener('click', () => showDogInfo(dog));
            dogBar.appendChild(dogSpan);
        });
    }

    // Show detailed info about a dog
    function showDogInfo(dog) {
        dogInfo.innerHTML = '';
        const dogImage = document.createElement('img');
        dogImage.src = dog.image;
        const dogName = document.createElement('h2');
        dogName.textContent = dog.name;
        const dogButton = document.createElement('button');
        dogButton.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
        dogButton.addEventListener('click', () => toggleGoodDog(dog));

        dogInfo.appendChild(dogImage);
        dogInfo.appendChild(dogName);
        dogInfo.appendChild(dogButton);
    }

    // Toggle Good Dog/Bad Dog status
    function toggleGoodDog(dog) {
        dog.isGoodDog = !dog.isGoodDog;
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ isGoodDog: dog.isGoodDog })
        })
        .then(() => showDogInfo(dog));
    }

    // Toggle filter for Good Dogs
    filterButton.addEventListener('click', () => {
        filterOn = !filterOn;
        filterButton.textContent = `Filter good dogs: ${filterOn ? 'ON' : 'OFF'}`;
        displayDogs(filterOn);
    });

    // Load dogs when the page loads
    fetchDogs();
});