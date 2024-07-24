document.addEventListener('DOMContentLoaded', () => {
    const temperatureElement = document.getElementById('temperature');
    const conditionElement = document.getElementById('condition');
    const locationElement = document.getElementById('location');
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const editBtn = document.getElementById('edit-btn');
    const colorPicker = document.getElementById('color-picker');
    const applyColorBtn = document.getElementById('apply-color');
    const startColorInput = document.getElementById('start-color');
    const endColorInput = document.getElementById('end-color');
    const toolbar = document.getElementById('toolbar');
    let isEditing = false;
    let currentDraggable = null;

    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });

    // Listen for fullscreen change to toggle toolbar visibility
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            toolbar.style.display = 'none';
        } else {
            toolbar.style.display = 'flex';
        }
    });

    // Toggle edit mode
    editBtn.addEventListener('click', () => {
        isEditing = !isEditing;
        colorPicker.style.display = isEditing ? 'block' : 'none';
    });

    // Apply new background gradient colors
    applyColorBtn.addEventListener('click', () => {
        const startColor = startColorInput.value;
        const endColor = endColorInput.value;
        document.documentElement.style.setProperty('--start-color', startColor);
        document.documentElement.style.setProperty('--end-color', endColor);
    });

    // Draggable functionality
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        draggable.addEventListener('mousedown', (e) => {
            if (!isEditing) return;

            currentDraggable = draggable;
            const shiftX = e.clientX - draggable.getBoundingClientRect().left;
            const shiftY = e.clientY - draggable.getBoundingClientRect().top;

            const moveAt = (pageX, pageY) => {
                currentDraggable.style.left = `${pageX - shiftX}px`;
                currentDraggable.style.top = `${pageY - shiftY}px`;
            };

            const onMouseMove = (e) => {
                moveAt(e.pageX, e.pageY);
            };

            document.addEventListener('mousemove', onMouseMove);

            draggable.onmouseup = () => {
                document.removeEventListener('mousemove', onMouseMove);
                draggable.onmouseup = null;
                currentDraggable = null;
            };
        });

        draggable.ondragstart = () => false;
    });

    document.addEventListener('mouseup', () => {
        if (currentDraggable) {
            currentDraggable.onmouseup();
        }
    });

    const updateWeather = (latitude, longitude) => {
        console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);
        fetch(`https://api.weatherapi.com/v1/current.json?key=9d0b2624acea434ea1b204016242207&q=${latitude},${longitude}`)
            .then(response => response.json())
            .then(data => {
                const temp = Math.round(data.current.temp_f);
                const condition = data.current.condition.text;
                const location = `${data.location.name}, ${data.location.region}`;

                console.log(`Weather data fetched: ${temp}°F, ${condition}, ${location}`);

                temperatureElement.textContent = `${temp}°F`;
                conditionElement.textContent = condition;
                locationElement.textContent = location;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                locationElement.textContent = 'Error fetching location';
            });
    };

    const updateTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
        const formattedDate = now.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        timeElement.textContent = formattedTime;
        dateElement.textContent = formattedDate;
    };

    const getLocationAndUpdateWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                console.log(`Device location: ${latitude}, ${longitude}`);
                updateWeather(latitude, longitude);
            }, error => {
                console.error('Error getting location:', error);
                // Fallback to a default location if user denies geolocation
                updateWeather(40.7128, -74.0060); // Coordinates for New York City
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
            // Fallback to a default location if geolocation is not supported
            updateWeather(40.7128, -74.0060); // Coordinates for New York City
        }
    };

    getLocationAndUpdateWeather();
    updateTime();
    setInterval(getLocationAndUpdateWeather, 3600000); // Update weather every hour (3600000 milliseconds)
    setInterval(updateTime, 1000); // Update time every second
});
