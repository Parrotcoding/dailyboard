document.addEventListener('DOMContentLoaded', () => {
    const temperatureElement = document.getElementById('temperature');
    const conditionElement = document.getElementById('condition');
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    const updateWeather = (latitude, longitude) => {
        fetch(`https://api.weatherapi.com/v1/current.json?key=9d0b2624acea434ea1b204016242207&q=${latitude},${longitude}`)
            .then(response => response.json())
            .then(data => {
                const temp = Math.round(data.current.temp_f);
                const condition = data.current.condition.text;

                temperatureElement.textContent = `${temp}°F`;
                conditionElement.textContent = condition;
            })
            .catch(error => console.error('Error fetching weather data:', error));
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
