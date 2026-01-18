# RecipeHub

## Homepage

The homepage shows what recipes are popular each day and offers a new joke every refresh.

The homepage works by sending 6 API requests for a random recipe as we don't have access to a true popular API and then saving those 6 recipes for 24 hours. The joke section just sends an API request for a joke on every refresh.

## All Recipes

This page shows all of the recipes we have access to and lets you either search for a recipe or filter them by category and, or country

The All recipes site sends API requests for all recipes starting with every letter in the alphabet

## Recipe Card

Clicking on the recipe card on either the homepage or all recipes lets you see what is needed for every recipe and instructions on how to prepare the dish, you can also see similar recipes to the one you are currently looking at

The recipe card works by sending an API request for the recipe corresponding with the id that was selected and then displays the information on that recipe
