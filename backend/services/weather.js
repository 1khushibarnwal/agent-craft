export async function getWeather(city) {
  const res = await fetch(`https://wttr.in/${city}?format=j1`);
  const data = await res.json();
  return data.current_condition[0].temp_C;
}
