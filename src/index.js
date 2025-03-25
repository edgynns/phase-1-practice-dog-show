document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
    
    // Fetch and render dogs
    async function fetchDogs() {
        try {
            const response = await fetch('http://localhost:3000/dogs');
            const dogs = await response.json();
            renderDogTable(dogs);
        } catch (error) {
            console.error('Error fetching dogs:', error);
        }
    }

    // Render dogs in the table
    function renderDogTable(dogs) {
        tableBody.innerHTML = ''; // Clear existing rows
        
        dogs.forEach(dog => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class='padding center'>${dog.name}</td>
                <td class='padding center'>${dog.breed}</td>
                <td class='padding center'>${dog.sex}</td>
                <td class='padding center'>
                    <button class='edit-btn' data-id="${dog.id}">Edit</button>
                </td>
            `;
            
            // Add edit button event listener
            row.querySelector('.edit-btn').addEventListener('click', () => populateForm(dog));
            
            tableBody.appendChild(row);
        });
    }

    // Populate form with dog details
    function populateForm(dog) {
        dogForm.querySelector('input[name="name"]').value = dog.name;
        dogForm.querySelector('input[name="breed"]').value = dog.breed;
        dogForm.querySelector('input[name="sex"]').value = dog.sex;
        
        // Store dog ID as a data attribute on the form
        dogForm.dataset.dogId = dog.id;
    }

    // Handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        // Get dog ID from form's data attribute
        const dogId = dogForm.dataset.dogId;
        
        // Prepare updated dog data
        const updatedDog = {
            name: dogForm.querySelector('input[name="name"]').value,
            breed: dogForm.querySelector('input[name="breed"]').value,
            sex: dogForm.querySelector('input[name="sex"]').value
        };

        try {
            // Send PATCH request to update dog
            await fetch(`http://localhost:3000/dogs/${dogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(updatedDog)
            });

            // Refetch and re-render dogs to get latest data
            fetchDogs();

            // Reset form
            dogForm.reset();
            delete dogForm.dataset.dogId;
        } catch (error) {
            console.error('Error updating dog:', error);
        }
    }

    // Add form submit event listener
    dogForm.addEventListener('submit', handleFormSubmit);

    // Initial fetch of dogs
    fetchDogs();
});