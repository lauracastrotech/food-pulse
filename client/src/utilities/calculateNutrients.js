const authKey = import.meta.env.VITE_APP_API_KEY;
import userFriendlyNutrientNames from "./userFriendlyNutrientNames"
import axios from "axios";


export default async function calculateNutrients(listIng) {

    const requests = listIng.map(ingredient =>
        axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${authKey}`, {
            params: {
                query: ingredient.name,
                pageSize: 1,
            },
        })
    );

    try {
        const responses = await axios.all(requests);

        const allNutrients = {};

        Object.keys(userFriendlyNutrientNames).forEach(nut => {
          allNutrients[nut] = 0;
        });

        responses.forEach((res, index) => {
          const food = res.data.foods?.[0];
          if (!food) return;

          let ingAmount;
          if ("numberAmount" in listIng[index]) {
            ingAmount = listIng[index].numberAmount;
          } else if ("amount" in listIng[index]) {
            ingAmount = listIng[index].amount;
          }

          food.foodNutrients
            .filter(nut => Object.keys(userFriendlyNutrientNames).includes(nut.nutrientName))
            .forEach(nut => {
              allNutrients[nut.nutrientName] += ((nut.value / 100) * ingAmount);
            });
        });

        for (let key in allNutrients) {
          allNutrients[key] = Math.round(allNutrients[key] * 100) / 100;
        }

        return allNutrients;

    } catch (err) {
        console.error("Error calculating nutrients:", err);
        throw err;
    }
}