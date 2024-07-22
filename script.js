document.addEventListener('DOMContentLoaded', () => {
    const temperatureElement = document.getElementById('temperature');
    const conditionElement = document.getElementById('condition');
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const weatherIconElement = document.getElementById('weather-icon');

    const weatherIcons = {
        "Sunny": "sunny",
        "Clear": "clear",
        "Partly cloudy": "partly-cloudy",
        "Cloudy": "cloudy",
        "Overcast": "overcast",
        // Add other conditions as needed
    };

    const updateWeather = () => {
        fetch(`https://api.weatherapi.com/v1/current.json?key=9d0b2624acea434ea1b204016242207&q=New York`)
            .then(response => response.json())
            .then(data => {
                const temp = Math.round(data.current.temp_f);
                const condition = data.current.condition.text;

                temperatureElement.textContent = `${temp}°F`;
                conditionElement.textContent = condition;

                const iconClass = weatherIcons[condition] || "default";
                weatherIconElement.className = `weather-icon ${iconClass}`;
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

    updateWeather();
    updateTime();
    setInterval(updateWeather, 3600000); // Update weather every hour (3600000 milliseconds)
    setInterval(updateTime, 1000); // Update time every second
});
