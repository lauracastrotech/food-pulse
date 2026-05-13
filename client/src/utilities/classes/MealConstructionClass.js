import Meal from "./MealClass";

import calculateNutrients from "../calculateNutrients";
import axios from "axios";
const requestPath = import.meta.env.VITE_URL_REQUESTS;

export default class MealConstruction extends Meal{
    constructor(ingredients,functionnality){

        if(!ingredients){
            super([{name:"",amount:0}]);
        } else {
            super(ingredients);
        }

        this.functionnality = functionnality;

    }

    //Ingredients is an array of objects like that :
    // {name:"Potato",amount : 20}


    addIngredient(){
        this.ingredients.push({name:"",amount:0});
        return this.ingredients;
    }

    deleteIngredient(index){
        if(index>=0 && index<this.ingredients.length){
            this.ingredients.splice(index,1);
        } else {
            console.log("Index is uncorrect")
        }
        return this.ingredients;
    }



    async getSuggestionsFromAPI(inputValue, authKey) {
    
        if (inputValue) {
    
            try {
                const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${authKey}`, {
                    params: {
                        query: inputValue,
                        pageSize: 5,
                    },
                });
    
                if (response.data.foods) {
                    return response.data.foods.map((s) => s.description);
                }
            } catch (err) {
                console.error(err);
            }
        }
    
        return [];
    }
    

    async updateMeal(profile_id,index,date,ingredients,nutrients){
        await axios.put(`${requestPath}/api/meals/${profile_id}/${date}`,{
            ingredients,
            nutrients,
            index
        }).catch(err=>{
            console.error("Error updating meal:", err);
        });
    }

    async createMeal(date,nutrients,ingredients,profile_id){
        await axios.post(`${requestPath}/api/meals/${profile_id}`,{
            date,
            nutrients,
            ingredients
        }).catch(err=>{
            console.error("Error creating meal:", err);
        });
    }

    async sendToDB(day,profile_id,index){
        const {date,ingredients,nutrients} = await this.formatInfo(day);

        if(this.functionnality==="create"){
            await this.createMeal(date,nutrients,ingredients,profile_id);
        } else if(this.functionnality==="update"){
            await this.updateMeal(profile_id,index,date,ingredients,nutrients);
        } else {
            console.log("The functionality is not correct.")
        }
    }

    async formatInfo(day){
        let nutrients;

        await calculateNutrients(this.ingredients)
        .then(result=>{
            nutrients=result;
        }).catch(err=>{
            console.log(err);
        })



        let ingredients = {};

        this.ingredients.forEach(i=>{
            ingredients[i.name]=Number(i.amount);
        })

        const date = day

        return {nutrients,ingredients,date}
    }


}

